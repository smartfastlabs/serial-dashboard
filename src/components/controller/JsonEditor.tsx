import { Component, onMount } from "solid-js";
import { createJSONEditor } from "vanilla-jsoneditor";
import { faDownload, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { unwrap } from "solid-js/store";

const JsonEditor: Component = (props) => {
  const jsonIn = unwrap(props.config);
  console.log("JSON IN", jsonIn, props.config);
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
    const value = JSON.stringify(editor.json, null, 2);
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

  const options = {};
  let container;
  let editor;
  let fileInput;
  let content = { json: jsonIn };
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
            props.saveJSON(updatedContent.json || updatedContent.text);
          }
        },
        onRenderMenu: handleRenderMenu,
      },
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
