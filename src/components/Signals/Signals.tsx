"use client";

import { arrowSignalBlue, emptyBox, twoCirclesBlack } from "@/assets";
import Image from "next/image";
import classes from "./Signals.module.css";
import { Signal } from "@/firebase/signal";
import { useQuerySignals } from "@/api/signal";
import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import parse from "html-react-parser";
import BlogPostCode from "../BlogPost/BlogPostCode";
import ScrollableContent from "../shared/ScrollableComponent";
import { BlogImageDefault } from "../shared/BlogImage";
import { Spinner } from "@nextui-org/spinner";
import useInView from "@/hooks/useInView";

function filterAndTrimStrings(arr: any[]) {
  return (
    arr?.map((c: any) => (typeof c === "string" ? c.trim() : "")).join(" ") ??
    ""
  );
}

function SignalComponent({ signal }: { signal: Signal }) {
  const [elements, setElements] = useState<
    string | JSX.Element | JSX.Element[]
  >([]);

  useEffect(() => {
    if (signal?.content) {
      let index = 0;
      const parser = new DOMParser();
      const doc = parser.parseFromString(signal?.content, "text/html");
      const body = doc.body;

      // const preElement = body.querySelector("pre");

      function trimArray(arr: ChildNode[]) {
        let index = 0;
        while (true) {
          const el = arr[index];
          if (el.textContent?.trim() !== "") {
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

      const content = parse(trimmedContent, {
        library: {
          createElement(type, props, ...children) {
            if (type === "pre") {
              return <BlogPostCode code={children[0]} />;
            }

            if (type === "table") {
              return <ScrollableContent>{children[0]}</ScrollableContent>;
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

              // console.log("title | |||| - ", title);

              const isFirstSection = index === 0;
              index++;
              return createElement(
                type,
                {
                  id: filterAndTrimStrings(title),
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
      setElements(content);
    }
  }, [signal?.content]);

  return (
    <div className={classes.body_block}>
      <div className={classes.connector}>
        <h3 className={classes.signal_title}>{signal.title}</h3>
        <div className={classes.signal_sources}>
          <div className="flex items-center">
            <div>
              <Image className="w-[14px]" src={arrowSignalBlue} alt="Sources" />
            </div>
            <span className="ml-[8px]">Sources: &nbsp;</span>
          </div>
          <span>{signal.source}</span>
        </div>
        <div className={classes.signal_para}>{elements}</div>
      </div>
    </div>
  );
}

export default function Signals({ signals: _serverSignals }: { signals: any }) {
  const {
    signals: _clientSignals,
    isFetching,
    isLoading,
    fetchStatus,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useQuerySignals({});

  const _serverFormedSignals = useMemo(() => {
    return _serverSignals.map(
      (data: any) =>
        new Signal(
          data.title,
          data.content,
          data.author,
          data.source,
          data.id,
          data.timestamp
        )
    );
  }, [_serverSignals]);

  const signals = _clientSignals || _serverFormedSignals;
  const hasSignals = signals?.length > 0;

  const { ref, isInView } = useInView();

  useEffect(() => {
    if (!isFetching && !isFetchingNextPage && isInView) fetchNextPage();
  }, [fetchNextPage, isFetching, isFetchingNextPage, isInView]);

  return (
    <div className="w-full max-w-[720px] mx-auto pt-[40px] pb-[80px]">
      {hasSignals && (
        <>
          <div className="flex items-center">
            <div>
              <Image alt="Signals" src={twoCirclesBlack} className="w-[20px]" />
            </div>
            <h3 className={classes.title}>SIGNALS</h3>
          </div>
          <div className={classes.label}>
            <strong>Minerva Sinals:</strong>
            {" Global insights on today's biggest stories."}
          </div>
          {signals.map((signal: Signal) => (
            <SignalComponent key={signal._id} signal={signal} />
          ))}
        </>
      )}
      {!hasSignals && (
        <div className="flex flex-col gap-5 items-center justify-center text-lg py-4 font-featureRegular text-gray-600">
          <Image alt="No Signals Found" src={emptyBox} className="w-[150px]" />
          <p>No Signals Found</p>
        </div>
      )}
      {hasNextPage && (
        <div ref={ref} className="w-full flex items-center justify-center py-4">
          <Spinner
            classNames={{
              circle1: "blue-border-b",
              circle2: "blue-border-b",
            }}
            color="warning"
            size="lg"
            label="Fetching more signals..."
          />
        </div>
      )}
    </div>
  );
}
