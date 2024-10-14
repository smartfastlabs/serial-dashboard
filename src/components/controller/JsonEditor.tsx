import { Component, onMount } from "solid-js";
import { createJSONEditor } from "vanilla-jsoneditor";

const JsonEditor: Component = (props) => {
  async function saveFile() {
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: "serial-dashboard.json",
      types: [
        {
          description: "JSON Files",
          accept: {
            "text/plain": [".json"],
            "application/json": [".json"],
          },
        },
      ],
    });

    const writable = await fileHandle.createWritable();
    console.log(editor.json);
    const value = JSON.stringify(props.config(), null, 2);
    console.log("SAVE", value);
    await writable.write(value);
    await writable.close();
  }
  function openFile(e) {
    var file = e.target.files[0];
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      try {
        let value = JSON.parse(e.target.result);
        props.setConfig(value);
        editor.set({ json: value });
      } catch (e) {
        console.log(e);
      }
    };
    return reader.readAsText(file);
  }

  const options = {};
  let container;
  let editor;
  let fileInput;
  let content = { json: props.config() };
  onMount(() => {
    editor = createJSONEditor({
      target: container,
      props: {
        content: content,
        onChange: (
          updatedContent,
          previousContent,
          { contentErrors, patchResult }
        ) => {
          if (contentErrors) {
            console.error(contentErrors);
          } else {
            props.setConfig(updatedContent.json);
          }
        },
      },
    });
  });
  return (
    <div class="text-start vh-100">
      <div class="row">
        <div class="col">
          <input
            ref={fileInput}
            class="d-none"
            type="file"
            onChange={openFile}
          />
          <button
            class="w-100 btn btn-primary"
            onClick={() => fileInput.click()}
          >
            Open
          </button>
        </div>
        <div class="col">
          <button class="w-100 btn btn-primary" onClick={saveFile}>
            Save
          </button>
        </div>
      </div>
      <div ref={container}></div>
    </div>
  );
};

export default JsonEditor;
