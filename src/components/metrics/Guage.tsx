import { Switch, Match, Component } from "solid-js";

const MetricsGuage: Component = (props) => {
  return (
    <div class="float-start m-2 p-2 border">
      <Show when={props.name} fallback={props.key}>
        <h4>{props.name}</h4>
      </Show>
      <h2>{props.value}</h2>
      <Show when={props.timestamp}>
        <h2>{props.timestamp.toLocaleTimeString()}</h2>
      </Show>
    </div>
  );
};

export default MetricsGuage;
