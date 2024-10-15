import { Component, Show, createSignal, For } from "solid-js";
import { createEffect } from "solid-js";

const Log: Component = (props) => {
  const [lockBottom, setLockBottom] = createSignal(true);
  let messageContainer = null;

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
  console.log("LOGS COMPONENT", props);
  return (
    <div class="vh-100 w-100 container-fluid overflow-hidden">
      <div class="row bg-white w-100" style="margin-top: 60px">
        <h4>Serial Messages</h4>
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
