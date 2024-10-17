import { createSignal, Component, For, onMount } from "solid-js";
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
    recievedAt: new Date(),
  };
}

function getMessage(event) {
  return {
    message: event.detail,
    direction: "in",
    recievedAt: new Date(),
  };
}

const App: Component = () => {
  const [config, setConfig] = makePersisted(createSignal({ root: {} }));
  const [metrics, setMetrics] = createSignal([]);
  const [messages, setMessages] = createSignal([]);
  const [baudRate, setBaudRate] = createSignal(115200);
  const [isConnected, setIsConnected] = createSignal(false);
  const [showSerialMonitor, setShowSerialMonitor] = createSignal(true);
  const [showDashboard, setShowDashboard] = createSignal(false);
  const [showEditor, setShowEditor] = createSignal(false);
  const [showMetrics, setShowMetrics] = createSignal(false);
  let serial;

  async function updateConfig(config) {
    console.log("Updating Config: ", config);
  }

  async function readSerial(event) {
    if ((event.detail.match(/>/g) || []).length == 1) {
      setMetrics((current) => {
        if (current.length > 25000) {
          current = current.slice(-20000);
        }
        return [...current, getMetric(event)];
      });
    } else {
      setMessages((current) => {
        if (current.length > 10000) {
          current = current.slice(-8000);
        }
        return [...current, getMessage(event)];
      });
    }
  }

  async function sendSerial(value) {
    await serial.sendSerial(value);
    setMessages((current) => [
      ...current,
      { message: value, direction: "out" },
    ]);
  }

  async function connect() {
    console.log("Connecting");
    setIsConnected(await serial.openPort());
  }

  async function clearData() {
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
        <div class="vh-100 overflow-scroll" style="padding-top: 60px">
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
          <MetricsOverview metrics={metrics} />
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
