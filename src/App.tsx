import {
  createSignal,
  Show,
  Component,
  For,
  Switch,
  Match,
  onMount,
} from "solid-js";
import { createJSONEditor } from "vanilla-jsoneditor";
import { makePersisted } from "@solid-primitives/storage";
import { SplitPane } from "solid-split-pane";
import styles from "./App.module.css";
import { WebSerialPort } from "./utils/WebSerial";
import { LevelingConfig } from "./configs/leveling";
import JsonEditor from "./components/Controller/JsonEditor";
import Item from "./components/Controller/Item";
import Log from "./components/Log";
import Header from "./components/Header";
import Footer from "./components/Footer";

function getMetric(event) {
  let data = event.detail.slice(1).split(":");
  console.log("getMetric: ", data);
  return {
    key: data[0],
    value: parseFloat(data[1]),
    recievedAt: new Date(),
  };
}

function getMessage(event) {
  console.log("getMessage: ", event);
  return {
    message: event.detail,
    direction: "in",
    recievedAt: new Date(),
  };
}

const App: Component = () => {
  const [config, setConfig] = makePersisted(createSignal(LevelingConfig));
  const [metrics, setMetrics] = createSignal([]);
  const [messages, setMessages] = createSignal([]);
  const [baudRate, setBaudRate] = createSignal(115200);
  const [isConnected, setIsConnected] = createSignal(false);
  const [displayMode, setDisplayMode] = createSignal("default");
  const [showSerialMonitor, setShowSerialMonitor] = createSignal(false);
  const [showDashboard, setShowDashboard] = createSignal(true);
  const [showEditor, setShowEditor] = createSignal(true);
  let serial;

  async function updateConfig(config) {
    console.log("Updating Config: ", config);
  }

  async function readSerial(event) {
    console.log(event.detail);
    if (event.detail.startsWith(">")) {
      setMetrics((current) => {
        if (current.length > 25000) {
          current = current.slice(-20000);
        }
        console.log("Metric Count: ", current.length + 1);
        return [...current, getMetric(event)];
      });
    } else {
      console.log("Message: ", event.detail);
      setMessages((current) => {
        if (current.length > 250) {
          current = current.slice(-200);
        }
        return [...current, getMessage(event)];
      });
    }
  }

  async function sendSerial(value) {
    console.log("Sending: ", value);
    await serial.sendSerial(value);
    setMessages((current) => [
      ...current,
      { message: value, direction: "out" },
    ]);
  }

  async function connect() {
    console.log("Connecting");
    setIsConnected(await serial.openPort());
    console.log(serial);
  }

  async function clearData() {
    setMetrics([]);
    setMessages([]);
  }

  function createSplitPane(connected, serial, dash, editor) {
    const children = [];

    if (dash) {
      children.push(
        <div class="vh-100 overflow-scroll" style="padding-top: 150px">
          <Item metrics={metrics} sendSerial={sendSerial} {...config().root} />
        </div>
      );
    }

    if (editor) {
      children.push(
        <div class="vh-100 overflow-scroll" style="padding-top: 150px">
          <JsonEditor setConfig={setConfig} config={config} />
        </div>
      );
    }
    if (connected && serial) {
      children.push(
        <div class="vh-100 overflow-scroll" style="padding-top: 150px">
          <Log sendSerial={sendSerial} messages={messages} />
        </div>
      );
    }

    console.log(children);

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
      />
      <div class={styles.App}>
        {createSplitPane(
          isConnected(),
          showSerialMonitor(),
          showDashboard(),
          showEditor()
        )}
      </div>
      <Footer />
    </>
  );
};

export default App;
