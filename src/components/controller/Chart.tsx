import { onMount, createEffect, createSignal } from "solid-js";
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
  for (const [i, metric] of props.chart.dataSets.entries()) {
    keys.push(metric.key);
    series.push({
      label: metric.name,
      stroke: metric.color || COLORS[i % COLORS.length],
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
    series: series,
    cursor: cursorOpts,
    scales: {
      x: {
        time: false,
      },
      y: {},
    },
  };

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

  function throttle(cb, limit) {
    var wait = false;

    return () => {
      if (!wait) {
        requestAnimationFrame(cb);
        wait = true;
        setTimeout(() => {
          wait = false;
        }, limit);
      }
    };
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
    plot = new uPlot(options, getData(props.metrics()), chartContainer);
  });

  createEffect(() => {
    plot.setData(getData(props.metrics()));
  });

  return (
    <div class={props.chart.class}>
      <Section isExpanded={!props.chart.hidden} header={props.chart.name}>
        <div class="w-100" ref={chartContainer}></div>
      </Section>
    </div>
  );
};

export default MyChart;
