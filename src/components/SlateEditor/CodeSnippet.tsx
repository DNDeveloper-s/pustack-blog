import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import React, { useEffect } from "react";
import { Transforms } from "slate";
import { ReactEditor, useReadOnly, useSlate } from "slate-react";
import { FaCopy } from "react-icons/fa";
import { MdOutlineDone } from "react-icons/md";

export default function CodeSnippet({
  attributes,
  element,
  children,
}: {
  attributes: any;
  element: any;
  children: any;
}) {
  const editor = useSlate();
  const readonly = useReadOnly();

  const [copied, setCopied] = React.useState(false);

  const onChange = (value: string) => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(
      editor,
      //@ts-ignore
      {
        code: value,
      },
      { at: path }
    );
  };

  const handleCopyCode = () => {
    if (copied) return;
    navigator.clipboard.writeText(element.code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div>
      <div className="h-8 font-featureRegular flex items-center justify-between bg-[#282c34] w-full px-4">
        <div>
          <span className="text-xs text-gray-400">Java Script</span>
        </div>
        <div
          style={{
            fontSize: "11px",
            display: "flex",
            alignItems: "center",
            gap: "2px",
            cursor: copied ? "default" : "pointer",
            padding: "2px 4px",
            borderRadius: "5px",
            color: "#f8f5d7",
            // position: "absolute",
            // right: "8px",
            // top: "5px",
            // backgroundColor: copied ? "#2e2e2e" : "#3e3e3e",
          }}
          onClick={handleCopyCode}
          className="blog-post-code-copy-button"
        >
          {!copied ? (
            <>
              <FaCopy />
              <span>Copy Code</span>
            </>
          ) : (
            <>
              <MdOutlineDone />
              <span>Copied!</span>
            </>
          )}
        </div>
      </div>
      <CodeMirror
        value={element.code}
        height="200px"
        theme="dark"
        extensions={[javascript({ jsx: true })]}
        onChange={onChange}
        editable={!readonly}
      />
    </div>
  );
}
