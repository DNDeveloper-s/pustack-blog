import React, { useEffect, useState } from "react";
import { addStyles, EditableMathField, StaticMathField } from "react-mathquill";
import { Editor, Node, Path, Transforms } from "slate";
import { ReactEditor, useReadOnly, useSlate } from "slate-react";

// inserts the required css to the <head> block.
// you can skip this, if you want to do that by yourself.
addStyles();

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

  return (
    <div className="w-full">
      {readonly ? (
        <StaticMathField
          style={{ border: "none", boxShadow: "none", background: "#eee" }}
        >
          {latex}
        </StaticMathField>
      ) : (
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
                const previousPath = Path.previous(path);

                // Remove the current node
                Transforms.removeNodes(editor, { at: path });

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
          style={{ border: "none", boxShadow: "none", background: "#eee" }}
          mathquillDidMount={(mathField: any) => {
            mathField.focus();
          }}
        />
      )}
    </div>
  );
};

export default MathQuill;
