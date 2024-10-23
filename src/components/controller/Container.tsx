import { Show, Component, For, Switch, Match } from "solid-js";

import Item from "./Item";

const Container: Component = (props) => {
  function getChildProps(child) {
    if (!props.defaults) {
      return child;
    }
    const values = { ...props.defaults, ...child };
    if (child.class && props.defaults.class) {
      values.class = `${props.defaults.class} ${child.class}`;
    }

    return values;
  }
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
              {...getChildProps(item)}
            />
          )}
        </For>
      </Show>
    </div>
  );
};

export default Container;
