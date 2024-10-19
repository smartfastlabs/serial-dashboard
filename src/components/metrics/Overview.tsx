import { createSignal, Component, Show } from "solid-js";
import MyChart from "../Controller/Chart";
import { M } from "vite/dist/node/types.d-aGj9QkWt";

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

const MetricRow: Component = (props) => {
  const [expanded, setExpanded] = createSignal(props.expanded);
  return (
    <>
      <div class="col-12 mb-3">
        <div class="d-flex justify-content-between align-items-center">
          <div class="fw-bold metric-name">{props.metric.key}</div>
          <a
            href="#"
            onClick={() => {
              console.log("expand");
              setExpanded(!expanded());
              props.setExpanded(expanded());
            }}
            class="metric-timestamp"
          >
            GRAPH
          </a>
          <div
            onClick={() => {
              console.log("expand");
              setExpanded(!expanded());
              props.setExpanded(expanded());
            }}
            class="metric-timestamp"
          >
            {props.metric.timestamp.toLocaleTimeString()}
          </div>
          <div class="metric-value d-flex align-items-center">
            <span>{props.value}</span>
            <Show when={props.metric.changeDirection == "up"}>
              <i class="fas fa-arrow-up text-success ms-2"></i>
            </Show>
            <Show when={props.metric.changeDirection == "down"}>
              <i class="fas fa-arrow-down text-danger ms-2"></i>
            </Show>
          </div>
        </div>
      </div>
      <Show when={expanded()}>
        <div class="col-12">
          <MyChart
            metrics={props.metrics}
            chart={{
              type: "chart",
              name: props.metric.key,
              hidden: true,
              dataSets: [
                {
                  name: props.metric.key,
                  key: props.metric.key,
                },
              ],
            }}
          />
        </div>
      </Show>
    </>
  );
};

const MetricsOverview: Component = (props) => {
  const [expandedRows, setExpandedRows] = createSignal([]);
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
                  <MetricRow
                    expanded={expandedRows().includes(metric.key)}
                    value={metric.value}
                    setExpanded={(expanded) => {
                      console.log(
                        "setExpanded",
                        expanded,
                        expandedRows(),
                        expandedRows().includes(metric.key)
                      );
                      if (!expanded && expandedRows().includes(metric.key)) {
                        setExpandedRows(
                          expandedRows().filter((k) => k !== metric.key)
                        );
                      } else if (
                        expanded &&
                        !expandedRows().includes(metric.key)
                      ) {
                        setExpandedRows([...expandedRows(), metric.key]);
                      }
                    }}
                    metric={metric}
                    metrics={props.metrics}
                  />
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
