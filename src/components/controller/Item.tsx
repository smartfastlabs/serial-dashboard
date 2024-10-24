import { Switch, Match, Component, For } from "solid-js";
import Container from "./Container";
import Button from "./Button";
import MyChart from "./Chart";
import MetricsGuage from "../metrics/Guage";
import Section from "./Section";

const Item: Component = (props) => {
  return (
    <Switch fallback={<h4>{props.name}</h4>}>
      <Match when={props.type === "container"}>
        <Container {...props} />
      </Match>
      <Match when={props.type === "button"}>
        <Button {...props} />
      </Match>
      <Match when={props.type === "metric"}>
        <MetricsGuage metric={props} metricStore={props.metricStore} />
      </Match>
      <Match when={props.type === "chart"}>
        <div class={props.class}>
          <MyChart metrics={props.metrics} chart={props} />
        </div>
      </Match>
      <Match when={props.type === "section"}>
        <Section isExpanded={!props.hidden} header={props.name}>
          <For each={props.children}>
            {(child, i) => (
              <Item
                metricStore={props.metricStore}
                metrics={props.metrics}
                sendSerial={props.sendSerial}
                {...child}
              />
            )}
          </For>
        </Section>
      </Match>
    </Switch>
  );
};

export default Item;
