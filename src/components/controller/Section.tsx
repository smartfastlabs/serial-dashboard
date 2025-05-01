import { Show, createSignal } from "solid-js";

function Section(props) {
  const [isExpanded, setIsExpanded] = createSignal(props.isExpanded);

  const toggle = () => {
    console.log("toggle", isExpanded());
    setIsExpanded(!isExpanded());
  };

  return (
    <div class="">
      <div class="card-header" onClick={toggle} role="button">
        <h5 class="mb-0 d-flex align-items-center">
          <Show when={isExpanded()}>
            <i class="fas me-2 fa-minus-square"></i>
          </Show>
          <Show when={!isExpanded()}>
            <i class="fas me-2 fa-plus-square"></i>
          </Show>
          {props.header || "Section Header"}
          <span
            class={`ms-auto ${
              isExpanded() ? "bi-chevron-up" : "bi-chevron-down"
            }`}
          ></span>
        </h5>
      </div>
      <div class={`collapse ${isExpanded() ? "show" : ""}`}>
        <div class="card-body">{props.children || "Section Body Content"}</div>
      </div>
    </div>
  );
}

export default Section;
