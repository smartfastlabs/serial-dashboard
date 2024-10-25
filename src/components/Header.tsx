import { Switch, Match, createSignal, For, Component, Show } from "solid-js";
import { faDownload, faFolderOpen } from "@fortawesome/free-solid-svg-icons";

const BAUD_RATES = [
  4800, 9600, 19200, 38400, 57600, 112500, 230400, 460800, 921600,
];

const ViewControls: Component = (props) => {
  function ToggleButton(button) {
    return (
      <li class="ms-3 form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          id={`${button.key}Checkbox`}
          onChange={(e) => props.setConfig(button.key, e.target.checked)}
          checked={props.config[button.key]}
        />
        <label class="form-check-label" for={`${button.key}Checkbox`}>
          {button.name}
        </label>
      </li>
    );
  }
  return (
    <ul class="navbar-nav me-auto ms-4 mb-lg-0">
      <ToggleButton key="showController" name="controller" />
      <ToggleButton key="showEditor" name="configurator" />
      <ToggleButton key="showSerialMonitor" name="monitor" />
      <ToggleButton key="showMetrics" name="metrics" />
    </ul>
  );
};

const SerialControls: Component = (props) => {
  return (
    <ul class="navbar-nav justify-content-end pe-5">
      <Switch>
        <Match when={props.isConnected()}>
          <li class="nav-item">
            <button class="btn btn-outline-danger" onClick={props.clearData}>
              Clear <i class="fas ms-2 fa-trash"></i>
            </button>
          </li>
          <li class="nav-itemm mx-4">
            <button
              class="btn btn-outline-primary"
              onClick={() => {
                if (props.pausedAt()) {
                  props.setPausedAt(null);
                } else {
                  props.setPausedAt(Date.now());
                }
              }}
            >
              <Show when={props.pausedAt()}>
                Play <i class="fas ms-2 fa-play"></i>
              </Show>
              <Show when={!props.pausedAt()}>
                Pause <i class="fas ms-2 fa-pause"></i>
              </Show>
            </button>
          </li>
          <li class="nav-item">
            <button class="btn  btn-outline-danger" onClick={props.disconnect}>
              Disconnect <i class="fas ms-2 fa-unlink"></i>
            </button>
          </li>
        </Match>
        <Match when={!props.isConnected()}>
          <li class="nav-item">
            <div class="dropdown mx-2">
              <button
                class="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Baudrate: {props.config.serial.baudRate}
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <For each={BAUD_RATES}>
                  {(rate) => (
                    <li>
                      <a
                        class="dropdown-item"
                        onClick={() => props.setSerialConfig("baudRate", rate)}
                      >
                        {rate}
                      </a>
                    </li>
                  )}
                </For>
              </ul>
            </div>
          </li>
          <li>
            <button class="btn btn-outline-success" onclick={props.connect}>
              Connect <i class="fas ms-2 fa-link"></i>
            </button>
          </li>
        </Match>
      </Switch>
    </ul>
  );
};

const Header: Component = (props) => {
  return (
    <nav class="navbar fixed-top d-flex navbar-expand-lg bg-body-tertiary">
      <a class="fw-bold navbar-brand" href="#">
        <h3 class="my-0 py-0 ms-3">Serial Dashboard</h3>
        <small
          class="text-danger fw-bold"
          style="font-size: .8em; position: absolute; top: 10px; left: 200px; transform: rotate(25deg);"
        >
          ALPHA
        </small>
      </a>
      <ViewControls {...props} />
      <SerialControls {...props} />
    </nav>
  );
};

export default Header;
