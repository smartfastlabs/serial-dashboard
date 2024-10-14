import { Switch, Match, Component } from "solid-js";
import Container from "./Container";
import Button from "./Button";
import Metric from "./Metric";
import MyChart from "./Chart";

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
        <Metric metrics={props.metrics} metric={props} />
      </Match>
      <Match when={props.type === "chart"}>
        <MyChart metrics={props.metrics} chart={props} />
      </Match>
    </Switch>
  );
};

export default Item;
