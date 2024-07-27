import { FaAlignCenter, FaAlignLeft, FaAlignRight } from "react-icons/fa6";
import { Transforms } from "slate";
import { ReactEditor, useReadOnly, useSlate } from "slate-react";

export default function MathBlockElement({
  attributes,
  children,
  element,
}: any) {
  const readonly = useReadOnly();
  const editor = useSlate();
  const handleAlignMent = (align: "center" | "left" | "right") => {
    Transforms.setNodes(
      editor,
      { align },
      { at: ReactEditor.findPath(editor, element) }
    );
  };
  return (
    <div
      {...attributes}
      className="group/formula flex w-full py-2 px-3"
      style={{
        justifyContent:
          element.align === "center"
            ? "center"
            : element.align === "right"
            ? "flex-end"
            : "flex-start",
      }}
    >
      {!readonly && (
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
      )}
      <div
        className={
          "inline-flex flex-col w-auto px-2 relative group/formula " +
          (readonly ? " readonly" : "py-1 my-2")
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
        {children}
      </div>
    </div>
  );
}
