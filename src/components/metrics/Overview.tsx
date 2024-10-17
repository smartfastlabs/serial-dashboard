import { Switch, Match, Component } from "solid-js";
import MetricsGuage from "./Guage";

function getMetrics(metrics) {
  if (!metrics) return [];
  const temp = {};
  for (let m of metrics) {
    console.log(m);
    temp[m.key] = m.value;
  }

  const output = [];
  for (let key in temp) {
    output.push({ key, value: temp[key] });
  }

  output.sort((a, b) => a.key.localeCompare(b.key));
  return output;
}

const MetricsOverview: Component = (props) => {
  console.log("METRICS OVERVIEW", props);
  return (
    <div style="margin-top: 80px">
      <For each={getMetrics(props.metrics())}>
        {(metric, i) => {
          return (
            <>
              <MetricsGuage {...metric} />
              <MetricsGuage {...metric} />
              <MetricsGuage {...metric} />
              <MetricsGuage {...metric} />
              <MetricsGuage {...metric} />
              <MetricsGuage {...metric} />
              <MetricsGuage {...metric} />
              <MetricsGuage {...metric} />
              <MetricsGuage {...metric} />
            </>
          );
        }}
      </For>
    </div>
  );
};

export default MetricsOverview;
