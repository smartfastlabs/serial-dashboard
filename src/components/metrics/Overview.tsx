import { createSignal, Component, Show, createEffect } from "solid-js";
import {
  DragDropProvider,
  DragDropSensors,
  DragEventHandler,
  createDraggable,
  createDroppable,
} from "@thisbeyond/solid-dnd";

import MetricRow from "./Row";
import MetricsReadMe from "./ReadMe";

const MetricsOverview: Component = (props) => {
  const [expandedRows, setExpandedRows] = createSignal([]);
  const [expandAll, setExpandAll] = createSignal(false);
  function onDragEnd(event) {
    console.log("onDragEnd", event);
  }
  return (
    <DragDropProvider onDragEnd={onDragEnd}>
      <DragDropSensors />
      <div
        class="container overflow-scroll"
        style="margin-top: 65px; height: calc(100% - 110px);"
      >
        <Show when={props.metricStore.length > 0} fallback={<MetricsReadMe />}>
          <div class="card">
            <div class="card-header">
              <h4>
                Metrics Overview (
                <a href="#" onClick={() => setExpandAll(!expandAll())}>
                  <Show fallback={"Show All"} when={expandAll()}>
                    Hide All
                  </Show>
                </a>
                )
              </h4>
            </div>
            <div class="card-body">
              <div class="row">
                <For each={props.metricStore}>
                  {(metric, i) => {
                    return (
                      <MetricRow
                        expandAll={expandAll}
                        expanded={expandedRows().includes(metric.key)}
                        value={metric.value}
                        setExpanded={(expanded) => {
                          console.log(
                            "setExpanded",
                            expanded,
                            expandedRows(),
                            expandedRows().includes(metric.key)
                          );
                          if (
                            !expanded &&
                            expandedRows().includes(metric.key)
                          ) {
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
        </Show>
      </div>
    </DragDropProvider>
  );
};

export default MetricsOverview;
