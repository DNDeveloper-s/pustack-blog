import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { createElement, useEffect, useState } from "react";
import parse from "html-react-parser";
import BlogPostCode from "../BlogPost/BlogPostCode";
import ScrollableContent from "../shared/ScrollableComponent";
import { BlogImageDefault } from "../shared/BlogImage";
import { filterAndTrimStrings } from "../BlogPost/BlogPost";

export function RenderEditorContent({
  content,
  enabled,
}: {
  content: string;
  enabled: boolean;
}) {
  const [elements, setElements] = useState<any>(null);

  useEffect(() => {
    if (content && enabled) {
      let index = 0;
      let firstContentEncountered = false;
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      const body = doc.body;

      // const preElement = body.querySelector("pre");

      function trimArray(arr: ChildNode[]) {
        console.log("arr - ", arr);
        let index = 0;
        while (true) {
          const el = arr[index];
          if (
            el?.textContent?.trim() !== "" ||
            !Array.from(el.childNodes).every((c) => c.nodeName === "BR")
          ) {
            break;
          }
          index++;
        }
        return arr.slice(index);
      }
      function nodesToInnerHTMLString(nodes: any[]) {
        const container = document.createElement("div");
        nodes.forEach((node) => container.appendChild(node.cloneNode(true)));
        return container.innerHTML;
      }
      function trimEmptyElements(parentNode: HTMLElement) {
        const children = Array.from(parentNode.childNodes);
        const arr = trimArray(children);
        const finalArray = trimArray(arr.reverse());

        finalArray.reverse();

        return nodesToInnerHTMLString(finalArray);
      }
      const trimmedContent = trimEmptyElements(body);

      const _content = parse(trimmedContent, {
        library: {
          createElement(type, props, ...children) {
            if (type === "pre") {
              return <BlogPostCode code={children[0]} />;
            }

            if (type === "table") {
              console.log("children - ", children[0]);
              return (
                <ScrollableContent>
                  <table {...props}>{children[0]}</table>
                </ScrollableContent>
              );
              // return createElement(
              //   "div",
              //   {
              //     className: "overflow-x-auto",
              //   },
              //   children[0]
              // );
            }

            if (
              type === "img" &&
              // @ts-ignore
              props?.className?.includes("blog-image")
            ) {
              return (
                <BlogImageDefault
                  className="mx-auto max-w-full max-h-[500px] flex items-center justify-center"
                  // @ts-ignore
                  src={props.src}
                  imageProps={{
                    className: "max-h-[500px] object-contain max-w-full",
                  }}
                />
              );
            }

            if (type === "section") {
              let title = children[0]
                .find((c: any) => c.props?.className?.includes("styles_title"))
                ?.props?.children.find((c: any) => c.type === "h2")
                .props.children;

              // title &&
              //   setTitles((prev) => [
              //     ...prev,
              //     { titleWithIcons: title, title: filterAndTrimStrings(title) },
              //   ]);

              console.log("title | |||| - ", title);

              const isFirstSection = index === 0;
              index++;
              return createElement(
                type,
                {
                  ...props,
                  style: { paddingTop: "10px" },
                  className: isFirstSection ? "first_section" : "",
                },
                ...children
              );
            }

            return createElement(type, props, ...children);
            // return <div>Create Element</div>;
          },
          cloneElement(element, props, ...children) {
            return <div>Clone Element</div>;
          },
          isValidElement(element) {
            return true;
          },
        },
      });
      setElements(_content);
    }
  }, [content, enabled]);
  return (
    <MathJaxContext>
      <div className="w-full py-2 no-preflight blog-post-container">
        <MathJax>{elements}</MathJax>
      </div>
    </MathJaxContext>
  );
}

export default function JoditPreview({
  disclosureOptions,
  content,
}: {
  disclosureOptions: ReturnType<typeof useDisclosure>;
  content: string;
}) {
  return (
    <Modal
      isOpen={disclosureOptions.isOpen}
      onOpenChange={disclosureOptions.onOpenChange}
      classNames={{
        wrapper: "bg-black bg-opacity-50",
        base: "!max-w-[900px] !w-[90vw]",
      }}
    >
      <ModalContent className="h-auto min-h-[400px] max-h-[90vh] overflow-auto jodit-table bg-primary no-preflight">
        <ModalHeader style={{ borderBottom: "1px dashed #1f1f1f1d" }}>
          Preview
        </ModalHeader>
        <ModalBody>
          <RenderEditorContent
            content={content}
            enabled={disclosureOptions.isOpen}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
