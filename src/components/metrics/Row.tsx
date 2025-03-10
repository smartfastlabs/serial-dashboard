import { createSignal, Component, Show, createEffect } from "solid-js";
import {
  DragDropProvider,
  DragDropSensors,
  DragEventHandler,
  createDraggable,
  createDroppable,
} from "@thisbeyond/solid-dnd";
import MyChart from "../controller/Chart";

const MetricRow: Component = (props) => {
  const [expanded, setExpanded] = createSignal(false);
  const droppable = createDroppable(props.i);
  const draggable = createDraggable(props.i);

  createEffect(() => {
    if (props.expandAll()) {
      console.log("HERE");
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  });

  function toggleExpanded() {
    setExpanded(!expanded());
    props.setExpanded(expanded());
  }

  function onDragEnd(event) {
    console.log("onDragEnd", event);
  }

  return (
    <DragDropProvider onDragEnd={onDragEnd}>
      <div
        use:droppable
        class="col-12 mb-3 droppable"
        classList={{ "!droppable-accept": droppable.isActiveDroppable }}
      >
        <div class="row">
          <div class="col-4 d-flex d-flex-row">
            <a href="#" onClick={toggleExpanded} class="metric-timestamp">
              <Show when={expanded()}>
                <i class="fas me-2 fa-minus-square"></i>
              </Show>
              <Show when={!expanded()}>
                <i class="fas me-2 fa-plus-square"></i>
              </Show>
              {props.metric.key}
            </a>
          </div>
          <div onClick={toggleExpanded} class="col metric-timestamp">
            {props.metric.timestamp.toLocaleTimeString()}
          </div>
          <div
            style="width: 150px;"
            class="col metric-value d-flex flex-row-reverse"
          >
            <Show when={props.metric.changeDirection == "up"}>
              <i class="fas fa-arrow-up text-success ms-2"></i>
            </Show>
            <Show when={props.metric.changeDirection == "down"}>
              <i class="fas fa-arrow-down text-danger ms-2"></i>
            </Show>
            <span>{props.value}</span>
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
    </DragDropProvider>
  );
};

export default MetricRow;
