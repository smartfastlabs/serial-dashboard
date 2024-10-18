import { Show, Component, For, Switch, Match } from "solid-js";

import Item from "./Item";

const Container: Component = (props) => {
  return (
    <div class={props.class}>
      <Show when={props.name}>
        <h4>{props.name}</h4>
      </Show>
      <Show when={props.children && props.children.length > 0}>
        <For each={props.children}>
          {(item, i) => (
            <Item
              metricStore={props.metricStore}
              metrics={props.metrics}
              sendSerial={props.sendSerial}
              {...{ ...props.defaults, ...item }}
            />
          )}
        </For>
      </Show>
    </div>
  );
};

export default Container;
