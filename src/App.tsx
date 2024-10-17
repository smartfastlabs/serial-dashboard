import { createEffect, createSignal, Component, For, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { makePersisted } from "@solid-primitives/storage";
import { SplitPane } from "solid-split-pane";
import styles from "./App.module.css";
import { WebSerialPort } from "./utils/WebSerial";
import JsonEditor from "./components/Controller/JsonEditor";
import Item from "./components/Controller/Item";
import Log from "./components/Log";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MetricsOverview from "./components/metrics/Overview";

function getMetric(event) {
  let data = event.detail.slice(1).split(":");
  return {
    key: data[0],
    value: parseFloat(data[1]),
    timestamp: new Date(),
  };
}

function getMessage(event) {
  return {
    message: event.detail,
    direction: "RX",
    timestamp: new Date(),
  };
}

const App: Component = () => {
  const [config, setConfig] = makePersisted(createSignal({ root: {} }));
  const [metricStore, setMetricStore] = createStore([]);
  const [metrics, setMetrics] = createSignal([]);
  const [messages, setMessages] = createSignal([]);
  const [baudRate, setBaudRate] = createSignal(115200);
  const [isConnected, setIsConnected] = createSignal(false);
  const [showSerialMonitor, setShowSerialMonitor] = createSignal(true);
  const [showDashboard, setShowDashboard] = createSignal(false);
  const [showEditor, setShowEditor] = createSignal(false);
  const [showMetrics, setShowMetrics] = createSignal(false);
  const [pausedAt, setPausedAt] = createSignal(null);
  const messageBuffer = [];
  let serial;

  async function updateConfig(config) {
    console.log("Updating Config: ", config);
  }

  createEffect(() => {
    if (!pausedAt) {
      for (let message of messageBuffer) {
        readSerial(message);
      }
      messageBuffer.length = 0;
    }
  });

  async function readSerial(event) {
    if (!event) return;
    if (pausedAt()) {
      return messageBuffer.push(event);
    }
    if ((event.detail.match(/>/g) || []).length == 1) {
      const metric = getMetric(event);
      setMetrics((current) => {
        if (current.length > 15000) {
          current = current.slice(-10000);
        }
        return [...current, metric];
      });
      setMetricStore((current) => {
        if (!metric) return current;
        for (let currentValue of current) {
          if (currentValue && currentValue.key === metric.key) {
            return current.map((m) => (m.key === metric.key ? metric : m));
          }
        }
        //TODO: USE PRODUCE
        return [...current, metric];
      });
    } else {
      setMessages((current) => {
        if (current.length > 10000) {
          current = current.slice(-8000);
        }
        //TODO: USE PRODUCE
        return [...current, getMessage(event)];
      });
    }
  }

  async function sendSerial(value) {
    await serial.sendSerial(value);
    setMessages((current) => [
      ...current,
      { message: value, timestamp: new Date(), direction: "RX" },
    ]);
  }

  async function connect() {
    console.log("Connecting");
    setIsConnected(await serial.openPort());
  }
  async function disconnect() {
    console.log("Disconnecting");
    serial.disconnect();
    setIsConnected(false);
  }

  async function clearData() {
    setMetricStore((current) => []);
    setMetrics([]);
    setMessages([]);
  }

  function createSplitPane(
    connected,
    serial,
    _showDashboard,
    _showEditor,
    _showMetrics
  ) {
    const children = [];

    if (_showDashboard) {
      children.push(
        <div
          class="vh-100 overflow-scroll"
          style="height: calc(100% - 200px); padding-bottom: 60px; padding-top: 60px"
        >
          <Item metrics={metrics} sendSerial={sendSerial} {...config().root} />
        </div>
      );
    }

    if (_showEditor) {
      children.push(
        <div class="vh-100 container-fluid p-0">
          <JsonEditor setConfig={setConfig} config={config} />
        </div>
      );
    }

    if (serial) {
      children.push(
        <div class="vh-100 container-fluid p-0">
          <Log sendSerial={sendSerial} messages={messages} />
        </div>
      );
    }

    if (_showMetrics) {
      children.push(
        <div class="vh-100 container-fluid p-0">
          <MetricsOverview metricStore={metricStore} metrics={metrics} />
        </div>
      );
    }

    return (
      <SplitPane gutterClass="gutter gutter-vertical bg-light">
        <For each={children}>{(child) => child}</For>
      </SplitPane>
    );
  }
  onMount(() => {
    serial = new WebSerialPort(readSerial, baudRate(), readSerial, () =>
      setIsConnected(false)
    );
  });

  return (
    <>
      <Header
        connect={connect}
        disconnect={disconnect}
        isConnected={isConnected}
        baudRate={baudRate}
        setBaudRate={setBaudRate}
        clearData={clearData}
        sendSerial={sendSerial}
        showSerialMonitor={showSerialMonitor}
        setShowSerialMonitor={setShowSerialMonitor}
        showDashboard={showDashboard}
        setShowDashboard={setShowDashboard}
        showEditor={showEditor}
        setShowEditor={setShowEditor}
        showMetrics={showMetrics}
        setShowMetrics={setShowMetrics}
        pausedAt={pausedAt}
        setPausedAt={setPausedAt}
      />
      <div class={styles.App}>
        {createSplitPane(
          isConnected(),
          showSerialMonitor(),
          showDashboard(),
          showEditor(),
          showMetrics()
        )}
      </div>
      <Footer />
    </>
  );
};

export default App;
