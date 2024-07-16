import { createElement, useEffect, useState } from "react";
import parse from "html-react-parser";
import BlogPostCode from "@/components/BlogPost/BlogPostCode";
import ScrollableContent from "@/components/shared/ScrollableComponent";
import { BlogImageDefault } from "@/components/shared/BlogImage";

export default function useRenderHtml(content: string, enabled: boolean) {
  const [elements, setElements] = useState<any>(null);

  useEffect(() => {
    if (content && enabled) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      const body = doc.body;

      // const preElement = body.querySelector("pre");

      function trimArray(arr: ChildNode[]) {
        let index = 0;
        while (true) {
          const el = arr[index];
          if (
            el?.nodeName === "IFRAME" ||
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

        const iFrames = parentNode.querySelectorAll("iframe");
        iFrames.forEach((iFrameItem) => {
          iFrameItem.classList.add("iframe");
        }, []);

        const mathElements = parentNode.querySelectorAll("math");
        mathElements.forEach((mathEl) => {
          mathEl.parentElement?.classList.add("math_container");
        }, []);

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
                  className="max-w-full block"
                  // @ts-ignore
                  src={props.src}
                  imageProps={{
                    ...props,
                    // @ts-ignore
                    className: "max-w-full h-auto " + (props.className ?? ""),
                  }}
                />
              );
            }

            if (type === "iframe") {
              return (
                <iframe
                  {...props}
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                    // @ts-ignore
                    ...(props?.style ?? {}),
                  }}
                />
              );
            }

            if (type === "blockquote") {
              return createElement(
                type,
                {
                  ...props,
                  // @ts-ignore
                  className: "minerva-blockquote-1 " + (props?.className ?? ""),
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

  return elements;
}
