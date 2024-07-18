import React, { useEffect } from "react";
import { FaAlignCenter, FaAlignLeft, FaAlignRight } from "react-icons/fa6";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css"; // Ensure you have the CSS for react-resizable
import { Editor, Element, Range, Transforms } from "slate";
import { ReactEditor, useReadOnly, useSlate } from "slate-react";
import { CustomElement } from "../../../types/slate";

function convertToEmbedLink(url: string) {
  const youtubeRegex =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const vimeoRegex =
    /(?:vimeo\.com\/(?:.*#|.*\/videos\/|.*\/|.*\/.*\/)?([0-9]+))/;
  const dailymotionRegex =
    /(?:dailymotion\.com\/video\/|dai\.ly\/)([a-zA-Z0-9]+)/;

  let match = url.match(youtubeRegex);
  if (match && match[1]) {
    const videoId = match[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  match = url.match(vimeoRegex);
  if (match && match[1]) {
    const videoId = match[1];
    return `https://player.vimeo.com/video/${videoId}`;
  }

  match = url.match(dailymotionRegex);
  if (match && match[1]) {
    const videoId = match[1];
    return `https://www.dailymotion.com/embed/video/${videoId}`;
  }

  return null; // Return null if the URL is invalid for YouTube, Vimeo, and Dailymotion
}

const MyHandle = React.forwardRef((props: any, ref) => {
  const { handleAxis, ...restProps } = props;
  return (
    <div
      ref={ref}
      className={`group-hover/resize:opacity-100 opacity-0 foo handle-${handleAxis} border-gray-600`}
      {...restProps}
    />
  );
});

const alignmentClass = {
  center: "mx-auto",
  left: "",
  right: "ml-auto",
};

const ResizableEmbedVideo = ({
  attributes,
  element,
  children,
}: {
  attributes: any;
  element: any;
  children: any;
}) => {
  const editor = useSlate();
  const [width, setWidth] = React.useState(element.width);
  const [height, setHeight] = React.useState(element.height);
  const readonly = useReadOnly();

  useEffect(() => {
    if (element.width) setWidth(element.width);
    if (element.height) setHeight(element.height);
  }, [element.width, element.height]);

  // const [alignment, setAlignment] = React.useState("center");

  useEffect(() => {
    // if (element.width && element.height) return;
    if (element.maxConstraints) return;
    const node = ReactEditor.toDOMNode(editor, element);
    const maxWidth = node.clientWidth;
    const path = ReactEditor.findPath(editor, element);

    Transforms.setNodes(
      editor,
      //@ts-ignore
      {
        maxConstraints: [maxWidth, 1000],
      },
      { at: path }
    );

    // getImageDimensions(element.src).then((dimensions: any) => {
    //   const node = ReactEditor.toDOMNode(editor, element);
    //   const ratio = dimensions.width / dimensions.height;

    //   const maxWidth = node.clientWidth;
    //   const maxHeight = ratio > 1 ? maxWidth / ratio : maxWidth * ratio;

    //   const path = ReactEditor.findPath(editor, element);
    //   Transforms.setNodes(
    //     editor,
    //     //@ts-ignore
    //     {
    //       width: dimensions.width > maxWidth ? maxWidth : dimensions.width,
    //       height: dimensions.height > maxHeight ? maxHeight : dimensions.height,
    //       maxConstraints: [maxWidth, maxHeight],
    //     },
    //     { at: path }
    //   );
    // });
  }, [element.src, element.width, element.height]);

  function handleAlignMent(align: "center" | "left" | "right") {
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(
      editor,
      //@ts-ignore
      { align },
      { at: path }
    );
  }

  const embeddedUrl = convertToEmbedLink(element.url);

  if (readonly) {
    return (
      <div
        {...attributes}
        className={(attributes.className ?? "") + " relative "}
      >
        <div
          /* @ts-ignore */
          className={alignmentClass[element.align]}
          style={{ width, height }}
        >
          <iframe
            src={embeddedUrl ?? ""}
            width={width}
            height={height}
            className="bg-black"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      {...attributes}
      className={(attributes.className ?? "") + " relative "}
    >
      <ResizableBox
        width={width}
        height={height}
        maxConstraints={element.maxConstraints}
        style={{ maxWidth: "100%" }}
        lockAspectRatio={false}
        handle={<MyHandle />}
        draggableOpts={{}}
        resizeHandles={["sw", "nw", "se", "ne"]}
        // @ts-ignore
        className={"group/resize " + alignmentClass[element.align]}
        onResize={(e: any, data: any) => {
          setWidth(data.size.width);
          setHeight(data.size.height);
          //   const path = ReactEditor.findPath(editor, element);
          //   Transforms.setNodes(
          //     editor,
          //     //@ts-ignore
          //     { width: data.size.width, height: data.size.height },
          //     { at: path }
          //   );
        }}
        onResizeStop={(e: any, data: any) => {
          const path = ReactEditor.findPath(editor, element);
          Transforms.setNodes(
            editor,
            //@ts-ignore
            { width: data.size.width, height: data.size.height },
            { at: path }
          );
          setWidth(data.size.width);
          setHeight(data.size.height);
        }}
      >
        <div className="group-hover/resize:opacity-100 opacity-0 transition-all absolute z-10 top-2 left-1/2 transform -translate-x-1/2 flex items-center gap-3 text-sm bg-gray-600 p-1 rounded text-white">
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
        <iframe
          src={embeddedUrl ?? ""}
          width={width}
          height={height}
          className="bg-black"
        />
      </ResizableBox>
    </div>
  );
};

export default ResizableEmbedVideo;
