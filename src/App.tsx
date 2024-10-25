import {
  createEffect,
  createSignal,
  Component,
  For,
  onMount,
  Show,
} from "solid-js";
import { produce } from "solid-js/store";
import { createStore, reconcile } from "solid-js/store";
import { makePersisted } from "@solid-primitives/storage";
import { SplitPane } from "solid-split-pane";
import styles from "./App.module.css";
import { WebSerialPort } from "./utils/WebSerial";
import JsonEditor from "./components/controller/JsonEditor";
import ControllerBase from "./components/controller/Base";
import Log from "./components/Log";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MetricsOverview from "./components/metrics/Overview";

function getMetric(event) {
  let data = event.detail.slice(1).split(":");
  return {
    key: data[0],
    value: parseFloat(data[1]),
    timestamp: event.timestamp || new Date(),
  };
}

function getMessage(event) {
  return {
    message: event.detail,
    direction: "RX",
    timestamp: event.timestamp || new Date(),
  };
}

const App: Component = () => {
  const [configStore, setConfigStore] = makePersisted(createStore({}), {
    name: "config",
  });
  const [metricStore, setMetricStore] = createStore([]);
  const [messages, setMessages] = createStore([]);
  const [baudRate, setBaudRate] = createSignal(115200);
  const [isConnected, setIsConnected] = createSignal(false);
  const [pausedAt, setPausedAt] = createSignal(null);
  const metrics = [];
  const messageBuffer = [];
  let serial;

  function saveJSON(json) {
    // TODO: BETTER WAY TO HANDLE THIS
    setConfigStore("controller", reconcile(json.controller));
    setConfigStore("config", reconcile(json.config));
  }

  if (!configStore.controller) {
    setConfigStore((current) => {
      current.controller = {};
    });
  }
  if (!configStore.config) {
    setConfigStore((current) => {
      current.config = {
        serial: {
          baudRate: 115200,
          sendNewLine: true,
          sendCarriageReturn: true,
          scrollLock: true,
        },
        showController: false,
        showEditor: false,
        showMetrics: false,
        showSerialMonitor: true,
      };
    });
  }

  if (!configStore.config.serial) {
    setConfigStore((current) => {
      current.config.serial = {
        baudRate: 115200,
        sendNewLine: true,
        sendCarriageReturn: true,
        scrollLock: true,
      };
    });
  }

  function setConfig(key, value) {
    setConfigStore(
      produce((current) => {
        current.config[key] = value;
      })
    );
  }

  function setSerialConfig(key, value) {
    setConfigStore(
      produce((current) => {
        current.config.serial[key] = value;
      })
    );
  }
  createEffect(() => {
    if (!pausedAt()) {
      for (let message of messageBuffer) {
        readSerial(message);
      }
      messageBuffer.length = 0;
    }
  });

  async function readSerial(event) {
    if (!event) return;
    if (pausedAt()) {
      return messageBuffer.push({
        timestamp: new Date(),
        detail: event.detail,
      });
    }
    if ((event.detail.match(/>/g) || []).length == 1) {
      const metric = getMetric(event);
      if (metrics.length > 25000) {
        metrics.splice(0, 5000);
      }
      metrics.push(metric);

      setMetricStore(
        produce((current) => {
          const metric = getMetric(event);
          if (!metric) return current;
          for (let i = 0; i < current.length; i++) {
            if (current[i] && current[i].key === metric.key) {
              current[i].changeDirection =
                metric.value == current[i].value
                  ? current[i].changeDirection
                  : metric.value > current[i].value
                  ? "up"
                  : "down";
              current[i].value = metric.value;
              current[i].timestamp = new Date();
              return;
            }
          }
          current.push(metric);
        })
      );
    } else {
      setMessages(
        produce((messages) => {
          if (messages.length > 10000) {
            messages.splice(0, 2000);
          }
          messages.push(getMessage(event));
          return [...messages];
        })
      );
    }
  }

  async function sendSerial(value) {
    await serial.sendSerial(value);
    setMessages(
      produce((current) => {
        current.push({
          message: value,
          timestamp: new Date(),
          direction: "TX",
        });
      })
    );
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
    metrics.length = 0;
    setMessages([]);
  }

  function createController() {
    return (
      <ControllerBase
        metricStore={metricStore}
        metrics={metrics}
        sendSerial={sendSerial}
        configStore={configStore}
      />
    );
  }

  function createJSONEditor() {
    return (
      <div class="vh-100 container-fluid p-0">
        <JsonEditor saveJSON={saveJSON} config={configStore} />
      </div>
    );
  }

  function createSerialLog() {
    return (
      <div class="vh-100 container-fluid p-0">
        <Log
          config={configStore.config.serial}
          setConfig={setSerialConfig}
          pausedAt={pausedAt}
          sendSerial={sendSerial}
          messages={messages}
        />
      </div>
    );
  }

  function createMetrics() {
    return (
      <div class="vh-100 container-fluid p-0">
        <MetricsOverview metricStore={metricStore} metrics={metrics} />
      </div>
    );
  }

  const splitPanePanels = {
    controller: createController(),
    serial: createSerialLog(),
    metrics: createMetrics(),
  };

  function createSplitPane() {
    console.log("CREATE SPLIT PANE");
    const children = [];

    if (configStore.config.showController) {
      children.push(splitPanePanels.controller);
    }

    if (configStore.config.showEditor) {
      // if we render create the editor before it is visible it will not render correctly
      children.push(createJSONEditor());
    }

    if (configStore.config.showSerialMonitor) {
      children.push(splitPanePanels.serial);
    }

    if (configStore.config.showMetrics) {
      children.push(splitPanePanels.metrics);
    }
    if (!children.length) {
      children.push(<div style="margin-top: 65px;">GOTTA PICK SOMETHING</div>);
    }

    return (
      <Show when={children.length > 1} fallback={children[0]}>
        <SplitPane gutterClass="gutter gutter-vertical bg-light">
          <For each={children}>{(child) => child}</For>
        </SplitPane>
      </Show>
    );
  }
  onMount(() => {
    serial = new WebSerialPort(readSerial, baudRate(), () => {
      console.log("ON DISCONNECT");
      setIsConnected(false);
    });
  });

  return (
    <>
      <Header
        connect={connect}
        disconnect={disconnect}
        isConnected={isConnected}
        baudRate={configStore.config.baudRate}
        setSerialConfig={setSerialConfig}
        clearData={clearData}
        sendSerial={sendSerial}
        config={configStore.config}
        setConfig={setConfig}
        pausedAt={pausedAt}
        setPausedAt={setPausedAt}
      />
      <div class={styles.App}>{createSplitPane()}</div>
      <Footer />
    </>
  );
};

export default App;
