import { Component, Show, createSignal, For, on } from "solid-js";
import { createEffect } from "solid-js";

const Log: Component = (props) => {
  const [lockBottom, setLockBottom] = createSignal(true);
  const [sendValue, setSendValue] = createSignal("");
  const [sendNewLine, setSendNewLine] = createSignal(true);
  const [sendCarriageReturn, setSendCarriageReturn] = createSignal("");
  const [filters, setFilters] = createSignal([]);

  let messageContainer = null;

  function sendSerial() {
    props.sendSerial(sendValue());
    setSendValue("");
  }

  createEffect(() => {
    let m = props.messages();
    console.log("createRenderEffect");
    if (messageContainer) {
      console.log(
        "SCROLL",
        messageContainer.scrollTop,
        messageContainer.scrollHeight
      );
      if (lockBottom()) {
        messageContainer.scrollTo({
          top: 1000000000,
        });
      }
    }
  });

  createEffect(() => {
    console.log("sendNewLine", sendNewLine());
  });
  console.log("LOGS COMPONENT", props);
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
              Send
            </button>
          </div>
        </div>
        <div class="row">
          <div class="container-fluid">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <div class="ms-3 form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    onChange={(e) => setSendNewLine(e.target.checked)}
                    checked={sendNewLine()}
                  />
                  <label class="form-check-label" for="flexSwitchCheckDefault">
                    Send with \n
                  </label>
                </div>
              </li>
              <li class="nav-item">
                <div class="ms-3 form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    onChange={(e) => setSendCarriageReturn(e.target.checked)}
                    checked={sendCarriageReturn()}
                  />
                  <label class="form-check-label" for="flexSwitchCheckDefault">
                    Send with \r
                  </label>
                </div>
              </li>
              <li class="nav-item">
                <a class="dropdown-item" href="#">
                  Another action
                </a>
              </li>
              <li class="nav-item">
                <a class="dropdown-item" href="#">
                  Something else here
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        class="bg-primary row overflow-scroll"
        style="height: calc(100% - 147px);"
        ref={messageContainer}
      >
        <For each={props.messages && props.messages().slice(-50)}>
          {(m, i) => {
            return (
              <div class="row my-2 mx-1 border-1">
                <Switch>
                  <Match when={m.direction === "in"}>
                    <div class="col-1 bg-light border-right">
                      [{i}/50] {m.recievedAt.toLocaleTimeString()}{" "}
                      {m.direction.toUpperCase()}
                    </div>
                  </Match>
                  <Match when={m.direction === "out"}>
                    <div class="col-1 bg-secondary r-right">{m.direction}</div>
                  </Match>
                </Switch>
                <div class="col text-start">{m.message}</div>
                <Show when={m.direction === "out"}>
                  <div class="col-1">
                    <a href="#" onClick={() => props.sendSerial(m.message)}>
                      resend
                    </a>
                  </div>
                </Show>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
};

export default Log;
