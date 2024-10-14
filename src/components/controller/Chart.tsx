import { onMount, createEffect, createSignal } from "solid-js";
import Section from "./Section";
import { i } from "vite/dist/node/types.d-aGj9QkWt";
import uPlot from "uplot";
import { scales } from "chart.js";

const MyChart = (props) => {
  let chartContainer = null;
  let plot = null;

  let series = [{}];
  let keys = [];
  for (let metric of props.chart.dataSets) {
    keys.push(metric.key);
    series.push({
      label: metric.name,
      stroke: "red",
      spanGaps: true,
    });
  }

  const matchSyncKeys = (own, ext) => own == ext;

  const cursorOpts = {
    lock: true,
    focus: {
      prox: 16,
    },
    sync: {
      key: "sync",
      setSeries: true,
      match: [matchSyncKeys, matchSyncKeys],
    },
  };
  let options = {
    width: 500,
    height: 300,
    series: series.slice(0, 4),
    cursor: cursorOpts,
    scales: {
      x: {
        time: false,
      },
      y: {},
    },
  };

  const startTime = Date.now();
  function getData(metrics) {
    const data = Array(series.length);
    for (let i = 0; i < series.length; i++) {
      data[i] = Array(metrics.length);
    }

    for (const [i, metric] of metrics.entries()) {
      const j = keys.findIndex((m) => metric.key === m);
      data[0][i] = (metric.recievedAt - startTime) / 1000;
      if (j > -1) {
        data[j + 1][i] = metric.value;
      }
    }

    return data;
  }

  onMount(() => {
    plot = new uPlot(options, getData(props.metrics()), chartContainer);
  });

  createEffect(() => {
    console.log("UPDATING CHART");
    plot.setData(getData(props.metrics()));
  });

  return (
    <div class={props.chart.class}>
      <Section isExpanded={!props.chart.hidden} header={props.chart.name}>
        <div ref={chartContainer}></div>
      </Section>
    </div>
  );
};

export default MyChart;
