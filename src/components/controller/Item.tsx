import { Switch, Match, Component } from "solid-js";
import Container from "./Container";
import Button from "./Button";
import MyChart from "./Chart";
import MetricsGuage from "../metrics/Guage";

const Item: Component = (props) => {
  console.log("ITEM COMPONENT", props);
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
        <MyChart metrics={props.metrics} chart={props} />
      </Match>
    </Switch>
  );
};

export default Item;
