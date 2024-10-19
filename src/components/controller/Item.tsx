import { Switch, Match, Component } from "solid-js";
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
          <Section isExpanded={!props.hidden} header={props.name}>
            <MyChart metrics={props.metrics} chart={props} />
          </Section>
        </div>
      </Match>
    </Switch>
  );
};

export default Item;
