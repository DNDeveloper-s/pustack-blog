import React, { useEffect, useState } from "react";
import { FaAlignCenter, FaAlignLeft, FaAlignRight } from "react-icons/fa6";
import { addStyles, EditableMathField, StaticMathField } from "react-mathquill";
import { Editor, Node, Path, Transforms } from "slate";
import { ReactEditor, useReadOnly, useSlate } from "slate-react";
import { defaultElement } from "./DropdownMenu";

// inserts the required css to the <head> block.
// you can skip this, if you want to do that by yourself.
addStyles();

const mathQuillStyles = {
  border: "none",
  boxShadow: "none",
  background: "rgb(249 244 192)",
  padding: "4px 10px",
  borderRadius: "5px",
};

const MathQuill = ({
  attributes,
  element,
  children,
}: {
  attributes: any;
  element: any;
  children: any;
}) => {
  const [latex, setLatex] = useState(element.latex);
  const editor = useSlate();
  const readonly = useReadOnly();

  const handleAlignMent = (align: "center" | "left" | "right") => {
    Transforms.setNodes(
      editor,
      { align },
      { at: ReactEditor.findPath(editor, element) }
    );
  };

  return (
    <div
      className={
        "flex w-full px-2 relative group/formula " + (readonly ? "" : "py-4")
      }
      style={{
        justifyContent:
          element.align === "center"
            ? "center"
            : element.align === "right"
            ? "flex-end"
            : "flex-start",
      }}
    >
      {readonly ? (
        <StaticMathField style={mathQuillStyles}>{latex}</StaticMathField>
      ) : (
        <>
          <div className="group-hover/formula:opacity-100 opacity-0 transition-all absolute z-10 -top-2 left-1/2 transform -translate-x-1/2 flex items-center gap-3 text-sm bg-gray-600 p-1 rounded text-white">
            <div
              className={
                "p-1 hover:bg-gray-500 cursor-pointer rounded " +
                (element.align === "left" ? "!bg-gray-500" : "")
              }
              onClick={() => {
                handleAlignMent("left");
              }}
            >
              <FaAlignLeft />
            </div>
            <div
              className={
                "p-1 hover:bg-gray-500 cursor-pointer rounded " +
                (element.align === "center" ? "!bg-gray-500" : "")
              }
              onClick={() => {
                handleAlignMent("center");
              }}
            >
              <FaAlignCenter />
            </div>
            <div
              className={
                "p-1 hover:bg-gray-500 cursor-pointer rounded " +
                (element.align === "right" ? "!bg-gray-500" : "")
              }
              onClick={() => {
                handleAlignMent("right");
              }}
            >
              <FaAlignRight />
            </div>
          </div>
          <EditableMathField
            suppressContentEditableWarning
            contentEditable={!readonly}
            latex={latex}
            onChange={(mathField: any) => {
              setLatex(mathField.latex());
              Transforms.setNodes(
                editor,
                { latex: mathField.latex() },
                { at: ReactEditor.findPath(editor, element) }
              );
            }}
            onKeyDownCapture={(e: any) => {
              if (e.key === "Backspace" && latex === "") {
                const path = ReactEditor.findPath(editor, element);
                if (Path.isPath(path) && path.length > 0) {
                  // Calculate the previous path

                  // Remove the current node
                  Transforms.removeNodes(editor, { at: path });

                  if (path[0] == 0) {
                    // If the current node is the first node in the editor, return
                    Transforms.insertNodes(editor, defaultElement, { at: [0] });
                    Transforms.select(editor, [0]);
                    return;
                  }

                  const previousPath = Path.previous(path);
                  // Check if the previous path exists
                  if (Node.has(editor, previousPath)) {
                    // Move the cursor to the end of the previous node
                    const end = Editor.end(editor, previousPath);
                    Transforms.select(editor, end);
                  } else {
                    // If the previous path does not exist, move the cursor to the start of the editor
                    Transforms.select(editor, Editor.start(editor, []));
                  }

                  // Ensure the editor is focused
                  ReactEditor.focus(editor);
                }

                e.preventDefault();
              } else if (e.key === "Enter") {
                const path = ReactEditor.findPath(editor, element);
                const newPath = Path.next(path);
                Transforms.insertNodes(
                  editor,
                  { type: "paragraph", children: [{ text: "" }] },
                  { at: newPath }
                );
                Transforms.select(editor, Editor.start(editor, newPath));
                ReactEditor.focus(editor);
                e.preventDefault();
              }
            }}
            style={mathQuillStyles}
            mathquillDidMount={(mathField: any) => {
              mathField.focus();
            }}
          />
        </>
      )}
    </div>
  );
};

export default MathQuill;
