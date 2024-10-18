import { Switch, Match, Component, Show } from "solid-js";
import MyChart from "../Controller/Chart";

function getMetrics(metrics) {
  if (!metrics) return [];
  const temp = {};
  for (let m of metrics) {
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
  return (
    <div class="container" style="margin-top: 60px;">
      <div class="card">
        <div class="card-header">
          <h4>Metrics Overview</h4>
        </div>
        <div class="card-body">
          <div class="row">
            <For each={props.metricStore}>
              {(metric, i) => {
                return (
                  <>
                    <div class="col-12 mb-3">
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="fw-bold metric-name">{metric.key}</div>
                        <div class="metric-timestamp">
                          {metric.timestamp.toLocaleTimeString()}
                        </div>
                        <div class="metric-value d-flex align-items-center">
                          <span>{metric.value}</span>
                          <Show when={metric.changeDirection == "up"}>
                            <i class="fas fa-arrow-up text-success ms-2"></i>
                          </Show>
                          <Show when={metric.changeDirection == "down"}>
                            <i class="fas fa-arrow-down text-danger ms-2"></i>
                          </Show>
                        </div>
                      </div>
                    </div>
                    <div class="col-12">
                      <MyChart
                        metrics={props.metrics}
                        chart={{
                          type: "chart",
                          name: metric.key,
                          dataSets: [
                            {
                              name: metric.key,
                              key: metric.key,
                            },
                          ],
                        }}
                      />
                    </div>
                  </>
                );
              }}
            </For>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsOverview;
