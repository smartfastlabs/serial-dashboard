import { Show, Component, For, Switch, Match } from "solid-js";

import Item from "./Item";

const Container: Component = (props) => {
  return (
    <div class={props.class}>
      <Show when={props.name}>
        <h4>{props.name}</h4>
      </Show>
      <Show when={props.items && props.items.length > 0}>
        <For each={props.items}>
          {(item, i) => (
            <Item
              metrics={props.metrics}
              sendSerial={props.sendSerial}
              {...item}
            />
          )}
        </For>
      </Show>
    </div>
  );
};

export default Container;
