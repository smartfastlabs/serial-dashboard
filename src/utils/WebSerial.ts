export class WebSerialPort {
  private baudRate: number;
  private serailReadPromise: Promise<void>;
  private port: SerialPort;
  private reader: ReadableStreamDefaultReader;
  private onDisconnect: CallableFunction | null;

  public constructor(
    onMessage: CallableFunction,
    baudRate: number = 115200,
    onDisconnect: CallableFunction | null = null
  ) {
    if (!navigator.serial) {
      alert("WebSerial is not enabled in this browser");
      return;
    }

    this.onDisconnect = onDisconnect;
    this.baudRate = baudRate;

    parent.addEventListener("data", onMessage);
  }

  async openPort(): Boolean {
    console.log("openPort");
    try {
      this.port = await navigator.serial.requestPort();

      await this.port.open({ baudRate: this.baudRate });
      this.serialReadPromise = this.listenForSerial();
      return true;
    } catch (err) {
      console.error("There was an error opening the serial port:", err);
    }
    return false;
  }

  async closePort() {
    if (this.port) {
      this.reader.cancel();
      await this.serialReadPromise;
      await this.port.close();
      this.port = null;
    }
  }

  async sendSerial(data) {
    if (this.port && this.port.writable) {
      const writer = this.port.writable.getWriter();
      var output = new TextEncoder().encode(data);
      writer.write(output).then(writer.releaseLock());
    }
  }

  async listenForSerial() {
    if (!this.port) return;

    var buffer = "";
    while (this.port.readable) {
      this.reader = this.port.readable.getReader();
      try {
        const { value, done } = await this.reader.read();
        if (value) {
          let lines = new TextDecoder().decode(value).split(/\r?\n/);
          let isComplete = lines[lines.length - 1] === "";
          if (buffer.length > 0) {
            lines[0] = buffer + lines[0];
          }

          buffer = lines.pop();

          for (let line of lines) {
            if (line.length > 0) {
              parent.dispatchEvent(
                new CustomEvent("data", {
                  detail: line,
                  bubbles: true,
                })
              );
            }
          }
        }
        if (done) {
          break;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.reader.releaseLock();
      }
    }

    if (this.onDisconnect) {
      this.onDisconnect();
    }
  }
}
