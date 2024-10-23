import { Component } from "solid-js";

const Button: Component = (props) => {
  return (
    <button
      class={`m-1 btn btn-primary ${props.class} `}
      onMouseUp={() => props.onMouseUp && props.sendSerial(props.onMouseUp)}
      onMouseDown={() =>
        props.onMouseDown && props.sendSerial(props.onMouseDown)
      }
      onClick={() => props.onMouseClick && props.sendSerial(props.onMouseClick)}
    >
      {props.name}
    </button>
  );
};

export default Button;
