import { Component, Show, createSignal, For, on } from "solid-js";
import { createEffect } from "solid-js";

const Log: Component = (props) => {
  const [lockBottom, setLockBottom] = createSignal(true);
  const [sendValue, setSendValue] = createSignal("");
  const [sendNewLine, setSendNewLine] = createSignal(true);
  const [sendCarriageReturn, setSendCarriageReturn] = createSignal("");
  const [filters, setFilters] = createSignal([]);
  const [pauseMessagesAt, setPauseMessagesAt] = createSignal(0);

  let messageContainer = null;

  function sendSerial() {
    props.sendSerial(sendValue());
    setSendValue("");
  }

  createEffect(() => {
    let m = props.messages();
    if (messageContainer) {
      if (lockBottom()) {
        console.log("scrolling to bottom");
        messageContainer.scrollTo({
          top: 1000000000,
        });
      }
    }
  });

  createEffect(() => {
    if (lockBottom()) {
      setPauseMessagesAt(null);
    } else {
      console.log("setPaushMessagesAt");
      setPauseMessagesAt(new Date());
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
          <div class="col-2 form-check form-check-inline">
            <input
              class="form-check-input"
              type="checkbox"
              id="lockBottomCheckbox"
              checked={lockBottom()}
              onChange={(e) => setLockBottom(e.target.checked)}
            />
            <label
              class="fw-bold float-start form-check-label"
              for="inlineCheckbox1"
            >
              Auto Scroll
            </label>
          </div>
          <div class="col-2 form-check form-check-inline">
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
          <div class="col-2 form-check form-check-inline">
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
      <div
        class={`bg-primary row ${
          lockBottom() ? "overflow-hidden" : "overflow-scroll"
        }`}
        style="height: calc(100% - 147px);"
        ref={messageContainer}
      >
        <For
          each={
            props.messages &&
            props
              .messages()
              .filter((m) => {
                if (!pauseMessagesAt()) {
                  return true;
                }
                return m.recievedAt < pauseMessagesAt();
              })
              .slice(-100)
          }
        >
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
