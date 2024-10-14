import { Component, Show, When, For } from "solid-js";

const Log: Component = (props) => {
  console.log("LOGS COMPONENT", props);
  return (
    <div class="vh-100 overflow-scroll">
      <h4>Serial Messages</h4>
      <div>
        <For each={props.messages && props.messages().slice(-100)}>
          {(m, i) => {
            return (
              <div class="row my-2 mx-1 border">
                <Switch>
                  <Match when={m.direction === "in"}>
                    <div class="col-1 bg-light border-right">
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
