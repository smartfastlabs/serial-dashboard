import { createSignal, For, Component, Show } from "solid-js";

const BAUD_RATES = [
  4800, 9600, 19200, 38400, 57600, 112500, 230400, 460800, 921600,
];

const Header: Component = (props) => {
  let [value, setValue] = createSignal("");
  var serial = null;

  async function sendSerial() {
    console.log("Sending: ", value());
    await props.sendSerial(value());
  }

  return (
    <nav class="navbar fixed-top navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <a class="fw-bold navbar-brand" href="#">
          <span class="text-danger">[ALPHA]</span> Serial Dashboard
        </a>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <Show when={props.isConnected()}>
              <li class="nav-item">
                <button
                  class="btn btn-outline-success"
                  onClick={props.clearData}
                >
                  Clear
                </button>
              </li>
            </Show>
            <li class="nav-item">
              <Show when={props.isConnected()}>
                <a class="nav-link active" aria-current="page">
                  Connected
                </a>
              </Show>
              <Show when={!props.isConnected()}>
                <a class="nav-link disabled" aria-disabled="true">
                  Disconnected
                </a>
              </Show>
            </li>
          </ul>
          <div class="ms-3 form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              id="flexSwitchCheckDefault"
              onChange={(e) => props.setShowDashboard(e.target.checked)}
              checked={props.showDashboard()}
            />
            <label class="form-check-label" for="flexSwitchCheckDefault">
              controller
            </label>
          </div>
          <div class="ms-3 form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              id="flexSwitchCheckChecked"
              onChange={(e) => props.setShowEditor(e.target.checked)}
              checked={props.showEditor()}
            />
            <label class="form-check-label" for="flexSwitchCheckChecked">
              configurator
            </label>
          </div>
          <div class="ms-3 form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              id="flexSwitchCheckDisabled"
              onchange={(e) => props.setShowSerialMonitor(e.target.checked)}
              checked={props.showSerialMonitor()}
            />
            <label class="form-check-label" for="flexSwitchCheckDisabled">
              monitor
            </label>
          </div>
          <Show when={props.isConnected()}>
            <input
              style="width: 400px"
              class="form-control ms-3 me-2"
              placeholder="Send Serial"
              aria-label="Send Serial"
              onChange={(e) => setValue(e.target.value)}
            />
            <button class="btn btn-outline-success" onClick={sendSerial}>
              Send
            </button>
          </Show>
          <Show when={!props.isConnected()}>
            <div class="dropdown mx-2">
              <button
                class="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Baudrate: {props.baudRate()}
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <For each={BAUD_RATES}>
                  {(rate) => (
                    <li>
                      <a
                        class="dropdown-item"
                        onClick={() => props.setBaudRate(rate)}
                      >
                        {rate}
                      </a>
                    </li>
                  )}
                </For>
              </ul>
            </div>
            <button class="btn btn-outline-success" onclick={props.connect}>
              Connect
            </button>
          </Show>
        </div>
      </div>
    </nav>
  );
};

export default Header;
