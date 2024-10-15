import { Component, onMount } from "solid-js";
import { createJSONEditor } from "vanilla-jsoneditor";
import { faDownload, faFolderOpen } from "@fortawesome/free-solid-svg-icons";

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
        onRenderMenu: handleRenderMenu,
      },
    });
  });
  return (
    <div class="text-start vh-100" style="margin-top: 60px">
      <input ref={fileInput} class="d-none" type="file" onChange={openFile} />
      <div ref={container}></div>
    </div>
  );
};

export default JsonEditor;
