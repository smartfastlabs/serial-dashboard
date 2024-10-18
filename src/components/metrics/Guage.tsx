import { Switch, Match, Component } from "solid-js";

const MetricsGuage: Component = (props) => {
  function getMetricValue(metrics) {
    for (let m of metrics || []) {
      if (m.key === props.metric.key) {
        return m.value;
      }
    }
    return "N/A";
  }
  return (
    <div class={`${props.metric.class} m-1`}>
      <Show when={props.metric.name} fallback={props.metric.key}>
        <h4>{props.metric.name}</h4>
      </Show>
      <h2>{getMetricValue(props.metricStore)}</h2>
      <Show when={props.timestamp}>
        <h2>{props.timestamp.toLocaleTimeString()}</h2>
      </Show>
    </div>
  );
};

export default MetricsGuage;
