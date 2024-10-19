import { Component, Show, createSignal, For, on } from "solid-js";
import { createEffect } from "solid-js";

const Log: Component = (props) => {
  const [sendValue, setSendValue] = createSignal("");
  const [scrollLock, setScrollLock] = createSignal(true);
  const [sendNewLine, setSendNewLine] = createSignal(true);
  const [sendCarriageReturn, setSendCarriageReturn] = createSignal("");
  const [showOutgoing, setShowOutgoing] = createSignal(true);

  let messageContainer = null;

  function getMessages(messages, _showOutgoing) {
    if (!messages) return [];
    if (!_showOutgoing) {
      messages = messages.filter((m) => m.direction === "RX");
    }

    return messages.slice(-500);
  }

  function sendSerial() {
    var value = sendValue();
    if (sendCarriageReturn()) {
      value += "\r";
    }
    if (sendNewLine()) {
      value += "\n";
    }
    props.sendSerial(value);
    setSendValue("");
  }

  createEffect(() => {
    let m = props.messages.length;
    if (messageContainer && scrollLock()) {
      messageContainer.scrollTo({
        top: 1000000000,
      });
    }
  });

  return (
    <div class="vh-100 w-100 container-fluid overflow-hidden">
      <div class="row bg-white w-100" style="margin-top: 60px">
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Serial message"
            aria-label="Serial message"
            aria-describedby="basic-addon2"
            value={sendValue()}
            onChange={(e) => setSendValue(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                sendSerial();
                return false;
              }
            }}
          />
          <div class="input-group-append">
            <button
              class="btn btn-outline-secondary rounded-start-0"
              type="button"
              onClick={sendSerial}
            >
              Send <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
        <div class="row ps-4">
          <div class="col form-check form-check-inline">
            <input
              class="form-check-input"
              type="checkbox"
              id="scrollLockCheckbox"
              checked={scrollLock()}
              onChange={(e) => setScrollLock(e.target.checked)}
            />
            <label
              class="fw-bold float-start form-check-label"
              for="scrollLockCheckbox"
            >
              Scroll Lock
            </label>
          </div>
          <div class="col form-check form-check-inline">
            <input
              class="form-check-input"
              type="checkbox"
              id="showOutgoingCheckbox"
              checked={showOutgoing()}
              onChange={(e) => setShowOutgoing(e.target.checked)}
            />
            <label
              class="fw-bold float-start form-check-label"
              for="showOutgoingCheckbox"
            >
              Show TX
            </label>
          </div>
          <div class="col form-check form-check-inline">
            <input
              class="form-check-input"
              type="checkbox"
              id="sendNewLineCheckbox"
              checked={sendNewLine()}
              onChange={(e) => setSendNewLine(e.target.checked)}
            />
            <label
              class="float-start fw-bold form-check-label"
              for="sendNewLineCheckbox"
            >
              Send \n
            </label>
          </div>
          <div class="col form-check form-check-inline">
            <input
              class="form-check-input"
              type="checkbox"
              id="sendCarriageReturnCheckbox"
              checked={sendCarriageReturn()}
              onChange={(e) => setSendCarriageReturn(e.target.checked)}
            />
            <label
              class="float-start fw-bold form-check-label"
              for="sendNewLineCheckbox"
            >
              Send \r
            </label>
          </div>
        </div>
      </div>
      <ul
        class={`list-group ${
          scrollLock() ? "overflow-hidden" : "overflow-scroll"
        }`}
        style="height: calc(100% - 220px);"
        ref={messageContainer}
      >
        <For each={getMessages(props.messages)}>
          {(m, i) => {
            return (
              <li
                class={`list-group-item d-flex justify-content-between align-items-start ${
                  i() % 2 == 0 ? "" : "bg-light"
                }`}
              >
                <div
                  class="text-start text-monospace col-auto border-right"
                  style="width: 150px;"
                >
                  [{m.direction}] {m.timestamp.toLocaleTimeString()}
                </div>
                <div class="col col text-start">{m.message}</div>
                <div class="col-auto" style="width: 200px;">
                  <Show when={m.direction === "RX"}>
                    <a
                      href="#"
                      onClick={() => {
                        console.log("copying");
                        navigator.clipboard
                          .writeText(m.message)
                          .then(console.log);
                      }}
                    >
                      copy
                    </a>
                  </Show>
                  <Show when={m.direction === "TX"}>
                    <a href="#" onClick={() => props.sendSerial(m.message)}>
                      resend
                    </a>
                  </Show>
                </div>
              </li>
            );
          }}
        </For>
      </ul>
    </div>
  );
};

export default Log;
