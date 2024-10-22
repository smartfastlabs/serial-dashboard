import { createEffect, Component, onMount } from "solid-js";
import { trackDeep } from "@solid-primitives/deep";
import { createJSONEditor } from "vanilla-jsoneditor";
import { faDownload, faFolderOpen } from "@fortawesome/free-solid-svg-icons";

const JsonEditor: Component = (props) => {
  const options = {};
  let container;
  let editor;
  let fileInput;
  let content = { json: props.config };

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
    const value = JSON.stringify(editor.json, null, 2);
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
        props.saveJSON(value);
        editor.set({ json: value });
      } catch (e) {
        console.log(e);
      }
    };
    return reader.readAsText(file);
  }

  function handleRenderMenu(menuItems, context) {
    menuItems.push(
      {
        type: "button",
        icon: faDownload,
        onClick: saveFile,
      },
      {
        type: "button",
        onClick: () => fileInput.click(),
        icon: faFolderOpen,
      }
    );

    return menuItems;
  }

  onMount(() => {
    console.log("MOUNT JSON EDITOR", content);
    editor = createJSONEditor({
      target: container,
      props: {
        content: content,
        onChange: (updatedContent, previousContent, { contentErrors }) => {
          if (contentErrors) {
            console.error(contentErrors);
          } else if (updatedContent.json) {
            props.saveJSON(updatedContent.json);
          } else {
            console.error("No JSON");
          }
        },
        onRenderMenu: handleRenderMenu,
      },
    });
  });
  createEffect(() => {
    trackDeep(props.config);
    if (!editor) return;
    editor.set({
      json: props.config,
    });
  });
  return (
    <div
      class="text-start overflow-scroll"
      style="margin-top: 60px; height: calc(100% - 110px);"
    >
      <input ref={fileInput} class="d-none" type="file" onChange={openFile} />
      <div ref={container}></div>
    </div>
  );
};

export default JsonEditor;
