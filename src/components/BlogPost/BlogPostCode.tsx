"use client";

import useScreenSize from "@/hooks/useScreenSize";
import { Highlight, themes } from "prism-react-renderer";
import { Prism } from "prism-react-renderer";
import { useEffect, useMemo, useState } from "react";
import { FaCopy } from "react-icons/fa6";
import { MdOutlineDone } from "react-icons/md";
import hljs from "highlight.js";

function transformObjectToCodeString(object: any) {
  // Initialize an array to hold the lines of code
  let codeLines = [];

  // Helper function to extract text from the object
  function extractText(node: any): string {
    console.log("node.props.children - ", node.props);
    if (typeof node === "string") {
      return node;
    } else if (node?.props?.children) {
      return node.props.children instanceof Array
        ? node.props.children.map(extractText).join("")
        : extractText(node.props.children);
    } else if (node?.type === "br") {
      return "\n"; // Handle line breaks
    } else if (node?.props?.code?.length > 0) {
      return transformObjectToCodeString(node.props.code);
    } else {
      return "";
    }
  }

  if (object instanceof Array) {
    // Iterate over the object array
    for (let i = 0; i < object.length; i++) {
      const line = object[i];
      const text = extractText(line);
      codeLines.push(text);
    }
  } else if (object instanceof Object) {
    // Extract text from the object
    const text = extractText(object);
    codeLines.push(text);
  }

  // Join the lines of code into a single string
  const codeString = codeLines.join("");

  return codeString;
}

function filterAndTrimStrings(arr: any[]) {
  return (
    arr?.map((c: any) => (typeof c === "string" ? c.trim() : "")).join(" ") ??
    ""
  );
}

function calculatePreHeightByLineNumber(number: number) {
  const CODE_LINE_HEIGHT = 27;
  const VERTICAL_PADDING = 20;

  return CODE_LINE_HEIGHT * number + VERTICAL_PADDING;
}

export default function BlogPostCode({ code }: { code: any }) {
  const { isDesktopScreen, isTabletScreen, isMobileScreen } = useScreenSize();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (copied) return;
    navigator.clipboard.writeText(transformObjectToCodeString(code));
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const codeString = useMemo(() => transformObjectToCodeString(code), [code]);

  // const language = detect(codeString);

  console.log(
    "hljs.highlightAuto(codeString).language - ",
    hljs.highlightAuto(codeString).language
  );

  return (
    <Highlight
      theme={themes.oneDark}
      code={codeString}
      language={
        hljs.highlightAuto(codeString, [
          "python",
          "javascript",
          "typescript",
          "java",
          "dart",
          "c",
          "c++",
          "c#",
        ]).language ?? "tsx"
      }
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => {
        console.log("tokens - ", tokens);
        return (
          <div
            style={{
              border: "1px solid #2e2e2e",
              borderRadius: "10px",
              margin: "10px 0",
              overflow: "hidden",
              position: "relative",
            }}
            className="blog-post-code-container"
          >
            {/* <div
              style={{
                display: "flex",
                padding: "4px 10px",
                alignItems: "center",
                justifyContent: "flex-end",
                backgroundColor: "#2e2e2e",
                borderBottom: "1px dashed #535353",
              }}
            >
              
            </div> */}
            <div
              style={{
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "2px",
                cursor: copied ? "default" : "pointer",
                padding: "2px 4px",
                borderRadius: "5px",
                color: "#f8f5d7",
                position: "absolute",
                right: "8px",
                top: "5px",
                backgroundColor: copied ? "#2e2e2e" : "#3e3e3e",
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
            <pre
              style={{
                ...style,
                margin: 0,
                width: "100%",
                overflow: "auto",
                padding: "10px",
                borderRadius: 0,
                display: "flex",
                justifyContent: "flex-start",
                height: "auto",
                maxHeight:
                  calculatePreHeightByLineNumber(
                    isDesktopScreen
                      ? 20
                      : isTabletScreen
                      ? 10
                      : isMobileScreen
                      ? 5
                      : 10
                  ) + "px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  display: "flex",
                  flexDirection: "column",
                  borderRight: "1px dashed #4b4b4b",
                  height: "max-content",
                  paddingRight: "10px",
                  marginRight: "8px",
                }}
              >
                {tokens.map((line, i) => (
                  <span
                    key={i}
                    {...getLineProps({ line })}
                    style={{
                      color: "#9d9d9d",
                    }}
                  >
                    {i + 1}
                  </span>
                ))}
              </div>
              <code
                style={{
                  fontSize: "14px",
                  flex: "1",
                  overflowX: "auto",
                  overflowY: "initial",
                  height: "min-content",
                }}
              >
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })} style={{}}>
                    {/* <span
                                style={{
                                  color: "#9d9d9d",
                                  marginRight: "15px",
                                }}
                              >
                                {i + 1}
                              </span> */}
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </code>
            </pre>
          </div>
        );
      }}
    </Highlight>
  );
}
