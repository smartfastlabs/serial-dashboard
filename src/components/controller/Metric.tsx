import { Component } from "solid-js";

const Metric: Component = (props) => {
  console.log("METRIC COMPONENT", props);
  function getMetricValue(metrics) {
    let value = "N/A";
    for (let m of metrics) {
      if (m.key === props.metric.key) {
        value = m.value;
      }
    }
    return value;
  }
  return (
    <div class={`${props.metric.class} m-1`}>
      <b>{props.metric.name}:</b>
      <div>{getMetricValue(props.metrics())}</div>
    </div>
  );
};

export default Metric;
