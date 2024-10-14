import { createSignal } from "solid-js";

function Section(props) {
  const [isExpanded, setIsExpanded] = createSignal(props.isExpanded);

  const toggle = () => setIsExpanded(!isExpanded());

  return (
    <div class="">
      <div class="card-header" onClick={toggle} role="button">
        <h5 class="mb-0 d-flex align-items-center">
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
