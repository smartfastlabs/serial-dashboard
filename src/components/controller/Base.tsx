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
      <div class="vh-100 overflow-scroll" style="">
        <div
          class="overflow-scroll"
          style="margin-top: 65px; height: calc(100% - 120px);"
        >
          <Item
            metricStore={props.metricStore}
            metrics={props.metrics}
            sendSerial={props.sendSerial}
            type="container"
            name={props.configStore.controller.name}
            class={props.configStore.controller.class}
            children={props.configStore.controller.children}
          />
        </div>
      </div>
    </Show>
  );
};

export default ControllerBase;
