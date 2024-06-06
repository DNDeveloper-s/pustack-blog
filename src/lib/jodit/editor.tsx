import AppJoditEditor, { Jodit } from "jodit-react";

/**
 * @param {Jodit} jodit
 */
function preparePaste(jodit: any) {
  jodit.e.on(
    "paste",
    (e: any) => {
      console.log("Change pasted content? - ");

      if (confirm("Change pasted content?")) {
        jodit.e.stopPropagation("paste");
        jodit.s.insertHTML(
          // @ts-ignore
          Jodit.modules.Helpers.getDataTransfer(e)
            .getData(Jodit.constants.TEXT_HTML)
            .replace(/a/g, "b")
        );
        return false;
      }
    },
    { top: true }
  );
}
Jodit.plugins.add("preparePaste", preparePaste);

Jodit.defaultOptions.controls.insertTime = {
  // icon: require("./icon.svg"),
  //   text: "Insert Time",
  icon: require("/public/next.svg"),
  tooltip: "Insert Time",
  exec: (editor: any) => {
    editor.s.insertHTML(new Date().toTimeString());
  },
};

export class insertTimePlugin {
  buttons = [
    {
      name: "insertTime",
      group: "insert",
    },
  ];
}
Jodit.plugins.add("insertTimePlugin", insertTimePlugin);

export { AppJoditEditor, Jodit };
