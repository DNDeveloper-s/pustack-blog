import React, { useEffect } from "react";
import { FaAlignCenter, FaAlignLeft, FaAlignRight } from "react-icons/fa6";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css"; // Ensure you have the CSS for react-resizable
import { Transforms } from "slate";
import { ReactEditor, useReadOnly, useSlate } from "slate-react";
import { BlogImageDefault } from "../shared/BlogImage";

const getImageDimensions = (url: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        ratio: img.naturalWidth / img.naturalHeight,
      });
    };
    img.onerror = reject;
    img.src = url;
  });
};

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

const ResizableImage = ({
  attributes,
  element,
  children,
}: {
  attributes: any;
  element: any;
  children: any;
}) => {
  const editor = useSlate();
  const readonly = useReadOnly();

  // const [alignment, setAlignment] = React.useState("center");
  const [width, setWidth] = React.useState(element.width);
  const [height, setHeight] = React.useState(element.height);

  useEffect(() => {
    if (element.width) setWidth(element.width);
    if (element.height) setHeight(element.height);
  }, [element.width, element.height]);

  useEffect(() => {
    if (element.width && element.height) return;
    getImageDimensions(element.src).then((dimensions: any) => {
      const node = ReactEditor.toDOMNode(editor, element);
      const ratio = dimensions.width / dimensions.height;

      const maxWidth = node.clientWidth;
      const maxHeight = maxWidth / ratio;

      // minWidth and minHeight are set to 100
      const minWidth = 150;
      const minHeight = minWidth / ratio;

      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(
        editor,
        //@ts-ignore
        {
          width: dimensions.width > maxWidth ? maxWidth : dimensions.width,
          height: dimensions.height > maxHeight ? maxHeight : dimensions.height,
          maxConstraints: [maxWidth, maxHeight],
          minConstraints: [minWidth, minHeight],
        },
        { at: path }
      );

      setWidth(dimensions.width > maxWidth ? maxWidth : dimensions.width);
      setHeight(dimensions.height > maxHeight ? maxHeight : dimensions.height);
    });
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
          <BlogImageDefault
            className="max-w-full block"
            // @ts-ignore
            src={element.src}
            imageProps={{
              width,
              height,
              // @ts-ignore
              className: "max-w-full h-auto ",
            }}
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
        lockAspectRatio={true}
        handle={<MyHandle />}
        minConstraints={element.minConstraints}
        draggableOpts={{}}
        resizeHandles={["sw", "nw", "se", "ne"]}
        // @ts-ignore
        className={"group/resize " + alignmentClass[element.align]}
        onResize={(e: any, data: any) => {
          setWidth(data.size.width);
          setHeight(data.size.height);
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
        <img src={element.src} width={width} height={height} alt="" />
      </ResizableBox>
    </div>
  );
};

export default ResizableImage;
