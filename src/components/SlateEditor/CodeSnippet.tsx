import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { markdown } from "@codemirror/lang-markdown";
import { go } from "@codemirror/lang-go";
import { php } from "@codemirror/lang-php";
import { sql } from "@codemirror/lang-sql";
import React from "react";
import { Transforms } from "slate";
import { ReactEditor, useReadOnly, useSlate } from "slate-react";
import { FaCopy } from "react-icons/fa";
import { MdOutlineDone } from "react-icons/md";
import { Select, SelectItem } from "@nextui-org/select";

const languages = [
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "cpp", label: "C++" },
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "markdown", label: "Markdown" },
  { id: "go", label: "Go" },
  { id: "php", label: "PHP" },
  { id: "sql", label: "SQL" },
];

const getLanguageExtension = (language: string) => {
  switch (language) {
    case "javascript":
      return javascript({ jsx: true });
    case "python":
      return python();
    case "java":
      return java();
    case "cpp":
      return cpp();
    case "html":
      return html();
    case "css":
      return css();
    case "markdown":
      return markdown();
    case "go":
      return go();
    case "php":
      return php();
    case "sql":
      return sql();
    default:
      return javascript({ jsx: true }); // Default to JavaScript
  }
};

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
  const [value, setValue] = React.useState(element.language);

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

  const languageExtension = getLanguageExtension(element.language);

  const handleCopyCode = () => {
    if (copied) return;
    navigator.clipboard.writeText(element.code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleLanguageChange = (language: string) => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(
      editor,
      //@ts-ignore
      {
        language,
      },
      { at: path }
    );
    setValue(language ?? "javascript");
  };

  return (
    <div>
      <div className="h-8 font-featureRegular flex items-center justify-between bg-[#282c34] w-full px-4">
        <div className="ul-m-0 ul-p-0">
          {readonly ? (
            <span className="text-xs text-gray-400">
              {languages.find((c) => c.id === element.language)?.label ??
                "JavaScript"}
            </span>
          ) : (
            <Select
              size={"sm"}
              label="Select an animal"
              className="max-w-xs"
              selectionMode="single"
              selectedKeys={[element.language]}
              onSelectionChange={(selectedKeys) => {
                handleLanguageChange(selectedKeys.currentKey ?? "javascript");
              }}
              classNames={{
                base: "w-[200px]",
                popoverContent: "!rounded-none !bg-lightPrimary ul-m-0 ul-p-0",
                listbox: "!m-0 !p-0",
                label: "hidden",
                trigger:
                  "!min-h-[unset] !h-[25px] !p-[3px_10px] !bg-[rgb(65,68,72)] !text-white",
                value: "!text-white !text-[12px]",
                innerWrapper: "!pt-0",
              }}
            >
              {languages.map((language) => (
                <SelectItem value={language.id} key={language.id}>
                  {language.label}
                </SelectItem>
              ))}
            </Select>
          )}
        </div>
        {element.code?.trim().length > 0 && (
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
        )}
      </div>
      <CodeMirror
        value={element.code}
        height="200px"
        theme="dark"
        extensions={[languageExtension]}
        onChange={onChange}
        editable={!readonly}
      />
    </div>
  );
}
