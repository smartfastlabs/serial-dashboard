import Item from "./Item";
import { Component, Show } from "solid-js";
import ControllerReadMe from "./ReadMe";

const ControllerBase: Component = (props: any) => {
  return (
    <Show
      when={
        props.configStore.controller &&
        props.configStore.controller.children.length
      }
      fallback={<ControllerReadMe />}
    >
      <div class="vh-100 overflow-scroll">
        <Item
          metricStore={props.metricStore}
          metrics={props.metrics}
          sendSerial={props.sendSerial}
          type="container"
          name="Dashboard"
          class={props.configStore.controller.class}
          children={props.configStore.controller.children}
        />
      </div>
    </Show>
  );
};

export default ControllerBase;
