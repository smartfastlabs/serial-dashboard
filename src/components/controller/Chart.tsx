import { onMount, createEffect, createSignal } from "solid-js";
import { trackDeep } from "@solid-primitives/deep";
import { makeResizeObserver } from "@solid-primitives/resize-observer";
import Section from "./Section";
import uPlot from "uplot";
import { scales } from "chart.js";
import { COLORS } from "../../utils/Color";

const MyChart = (props) => {
  const { observe, unobserve } = makeResizeObserver(resize, {
    box: "content-box",
  });

  let chartContainer = null;
  let plot = null;

  let series = [{}];
  let keys = [];
  // TODO: Make Reactivity work for this

  function getSeries() {
    series = [{}];
    keys = [];
    for (const [i, metric] of props.chart.dataSets.entries()) {
      keys.push(metric.key);
      series.push({
        label: metric.name,
        stroke: metric.color || COLORS[i % COLORS.length],
        spanGaps: true,
      });
    }
    return series;
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
  function getOptions() {
    return {
      width: 500,
      height: 300,
      series: getSeries(),
      cursor: cursorOpts,
      scales: {
        x: {
          time: false,
        },
        y: {},
      },
    };
  }

  function getData(metrics) {
    const startTime = metrics.length ? metrics[0].timestamp : Date.now();
    const data = Array(series.length);
    for (let i = 0; i < series.length; i++) {
      data[i] = Array(metrics.length);
    }

    for (const [i, metric] of metrics.entries()) {
      const j = keys.findIndex((m) => metric.key === m);
      data[0][i] = (metric.timestamp - startTime) / 1000;
      if (j > -1) {
        data[j + 1][i] = metric.value;
      }
    }

    return data;
  }

  function resize(entries) {
    for (const entry of entries) {
      if (entry.target === chartContainer) {
        plot.setSize({
          width: entry.contentRect.width,
          height: 350,
        });
      }
    }
  }

  onMount(() => {
    observe(chartContainer);
    plot = new uPlot(getOptions(), getData(props.metrics), chartContainer);
  });

  createEffect(() => {
    plot.setData(getData(props.metrics));
  });

  createEffect(() => {
    try {
      plot.destroy();
      plot = new uPlot(getOptions(), [], chartContainer);
    } catch (e) {
      console.error("ERROR UPDATING CHART", e);
    }
  });

  return <div class="w-100" ref={chartContainer}></div>;
};

export default MyChart;
