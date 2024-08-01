import {
  ReactEditor,
  useReadOnly,
  useSlate,
  useSlateStatic,
} from "slate-react";
import ChooseImageUI from "./ChooseImageUI";
import CodeSnippet from "./CodeSnippet";
import dynamic from "next/dynamic";
// import MathQuill from "./MathQuill";
const MathQuill = dynamic(() => import("./MathQuill"), { ssr: false });
import ResizableImage from "./ResizeableImage";
import SectionHeader from "./SectionHeader";
import { Editor, Element, Node, Path, Transforms } from "slate";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import ResizableEmbedVideo from "./EmbedVideo";
import EnterEmbdedVideoUrlUI from "./EnterEmbedVideoUrlUI";
import { IoMdAdd } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import { moveCursorto } from "./utils/helpers";
import { Range } from "slate";
import { TableCellElement, TableElement, TableRowElement } from "./SlateTable";
import { useState } from "react";
import MathBlockElement from "./MathBlockElement";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import ErrorComponent from "../shared/ErrorComponent";
import ImageCarouselEntry from "./ImageCarousel";

const allowedTypes = [
  "paragraph",
  "block-quote",
  "bulleted-list",
  "numbered-list",
  "alphabet-list",
  "heading-one",
  "heading-two",
  "heading-three",
  "heading-four",
  "heading-five",
  "heading-six",
  "list-item",
  "list-item-number",
  "list-item-alpha",
  // "code-block",
  // "choose-image-ui",
  // "image-block",
  // "math-block",
  // "embed-video",
  // "enter-embed-video-url-ui",
  // "hr",
  // "section-header",
];

const deleteElementAndFocusNext = (editor: Editor, path: Path) => {
  const nextPath = Path.next(path);

  // Check if there is only one node in the editor
  if (editor.children.length === 1 && Path.equals(path, [0])) {
    Transforms.removeNodes(editor, { at: path });
    Transforms.insertNodes(
      editor,
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
      { at: [0] }
    );
    Transforms.select(editor, [0, 0]);
    return;
  }

  // Check if the next path exists, otherwise move focus to the previous element
  if (Node.has(editor, nextPath)) {
    Transforms.removeNodes(editor, { at: path });
    // Move focus to the next element
    ReactEditor.focus(editor);
    const node = Node.get(editor, path);
    //@ts-ignore
    const targetNodeType = node.type;
    console.log("targetNodeType", allowedTypes.includes(targetNodeType));
    if (allowedTypes.includes(targetNodeType)) {
      const end = Editor.end(editor, path);
      moveCursorto(editor, end);
    } else {
      Transforms.deselect(editor);
    }
    // console.log("node - ", elNode, elNode.getAttribute("type"));
    // Transforms.select(editor, end);
    // moveCursorto(editor, end);
  } else {
    // If next path does not exist, try focusing on the previous element
    const previousPath = Path.previous(path);
    Transforms.removeNodes(editor, { at: path });

    if (Node.has(editor, previousPath)) {
      // Move focus to the previous element
      ReactEditor.focus(editor);
      // Transforms.select(editor, previousPath);
      const node = Node.get(editor, previousPath);
      //@ts-ignore
      const targetNodeType = node.type;
      if (allowedTypes.includes(targetNodeType)) {
        const end = Editor.end(editor, previousPath);
        moveCursorto(editor, end);
      } else {
        Transforms.deselect(editor);
      }
      // moveCursorto(editor, previousPath);
    } else {
      // If no previous element, focus the editor to prevent it from losing focus
      ReactEditor.focus(editor);
    }
  }
};

const insertNewElementNext = (editor: Editor, path: Path) => {
  const nextPath = Path.next(path);
  Transforms.insertNodes(
    editor,
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
    { at: nextPath }
  );
  Transforms.select(editor, nextPath);
};

/**
 * Check if the cursor is within the current element.
 * @param {Editor} editor - The Slate editor instance.
 * @param {Element} element - The current element to check.
 * @returns {boolean} - True if the cursor is within the current element, otherwise false.
 */
const isCursorInElement = (editor: Editor, element: Element) => {
  const { selection } = editor;

  if (!selection) {
    return false;
  }

  const elementPath = ReactEditor.findPath(editor, element);

  return Range.includes(selection, elementPath);
};

const swapNodes = (editor: Editor, path1: Path, path2: Path) => {
  const node1 = Node.get(editor, path1);
  const node2 = Node.get(editor, path2);

  if (!node1 || !node2) {
    console.error("One of the nodes to swap is not found.");
    return;
  }

  // Use JSON.stringify and JSON.parse to create deep copies of the nodes
  const tempNode1 = JSON.parse(JSON.stringify(node1));
  const tempNode2 = JSON.parse(JSON.stringify(node2));

  // Determine which path comes first to avoid path conflicts
  const isPath1BeforePath2 = Path.compare(path1, path2) < 0;
  const [firstPath, secondPath] = isPath1BeforePath2
    ? [path1, path2]
    : [path2, path1];
  const [firstNode, secondNode] = isPath1BeforePath2
    ? [tempNode1, tempNode2]
    : [tempNode2, tempNode1];

  // Batch the operations to avoid intermediate states
  Transforms.deselect(editor);

  // Remove nodes in reverse order of their paths to avoid path conflicts
  Transforms.removeNodes(editor, { at: secondPath });
  Transforms.removeNodes(editor, { at: firstPath });

  // Re-insert nodes at their new paths
  Transforms.insertNodes(editor, secondNode, { at: firstPath });
  Transforms.insertNodes(editor, firstNode, { at: secondPath });

  // Restore selection if needed
  ReactEditor.focus(editor);
};

const CustomSlateElement = (props: any) => {
  const { attributes, children, element } = props;

  const readonly = useReadOnly();
  const editor = useSlate();
  const path = ReactEditor.findPath(editor, element);
  const textContent = Node.string(element);

  const [hoveredCellPath, setHoveredCellPath] = useState(null);

  const style = { textAligh: element.align || "left" };

  // const selection = editor.selection;
  // if (selection) {
  //   chat;
  // }
  const isSelectionInThisElement = isCursorInElement(editor, element);

  let el = (
    <p {...attributes} {...element} style={style}>
      {children}
    </p>
  );

  const showPlaceholder =
    textContent === "" && !readonly && isSelectionInThisElement;

  switch (element.type) {
    case "block-quote":
      el = (
        <blockquote
          {...attributes}
          {...element}
          className="minerva-blockquote-1 relative"
          data-placeholder={
            showPlaceholder
              ? "Hit Backspace to remove the block quote formatting"
              : ""
          }
        >
          {children}
        </blockquote>
      );
      break;
    case "bulleted-list":
      el = (
        <ul {...attributes} {...element}>
          {children}
        </ul>
      );
      break;
    case "numbered-list":
      el = (
        <ol {...attributes} {...element}>
          {children}
        </ol>
      );
      break;
    case "alphabet-list":
      el = (
        <ol
          {...attributes}
          {...element}
          style={{ listStyleType: "lower-alpha" }}
        >
          {children}
        </ol>
      );
      break;
    case "heading-one":
      el = (
        <h1
          {...attributes}
          {...element}
          className="relative"
          data-placeholder={
            showPlaceholder
              ? "Hit Backspace to remove the header formatting"
              : ""
          }
        >
          {children}
        </h1>
      );
      break;
    case "heading-two":
      el = (
        <h2
          {...attributes}
          {...element}
          className="relative"
          data-placeholder={
            showPlaceholder
              ? "Hit Backspace to remove the header formatting"
              : ""
          }
        >
          {children}
        </h2>
      );
      break;
    case "heading-three":
      el = (
        <h3
          {...attributes}
          {...element}
          className="relative"
          data-placeholder={
            showPlaceholder
              ? "Hit Backspace to remove the header formatting"
              : ""
          }
        >
          {children}
        </h3>
      );
      break;
    case "heading-four":
      el = (
        <h4
          {...attributes}
          {...element}
          className="relative"
          data-placeholder={
            showPlaceholder
              ? "Hit Backspace to remove the header formatting"
              : ""
          }
        >
          {children}
        </h4>
      );
      break;
    case "heading-five":
      el = (
        <h5
          {...attributes}
          {...element}
          className="relative"
          data-placeholder={
            showPlaceholder
              ? "Hit Backspace to remove the header formatting"
              : ""
          }
        >
          {children}
        </h5>
      );
      break;
    case "heading-six":
      el = (
        <h6
          {...attributes}
          {...element}
          className="relative"
          data-placeholder={
            showPlaceholder
              ? "Hit Backspace to remove the header formatting"
              : ""
          }
        >
          {children}
        </h6>
      );
      break;
    case "table":
      el = <TableElement {...props} />;
      break;
    case "table-row":
      return <TableRowElement {...props} />;
    case "table-cell":
      const cellPath = ReactEditor.findPath(props.editor, element);
      const tablePath = Path.parent(Path.parent(cellPath));
      return (
        <TableCellElement
          {...props}
          cellPath={cellPath}
          tablePath={tablePath}
          key={hoveredCellPath}
          hoveredCellPath={hoveredCellPath}
          setHoveredCellPath={setHoveredCellPath}
        />
      );
    case "list-item":
    case "list-item-number":
    case "list-item-alpha":
      el = (
        <li
          {...attributes}
          {...element}
          className="relative"
          data-placeholder={
            showPlaceholder ? "Hit Backspace to remove the list item" : ""
          }
        >
          {children}
        </li>
      );
      break;
    case "code-block":
      el = <CodeSnippet {...props} />;
      break;
    case "choose-image-ui":
      el = <ChooseImageUI {...props} />;
      break;
    case "image-block":
      el = <ResizableImage {...props} />;
      // el = <ImageCarousel {...props} />;
      break;
    case "image-carousel":
      el = <ImageCarouselEntry {...props} />;
      break;
    case "math-block-container":
      el = (
        <ErrorBoundary errorComponent={ErrorComponent}>
          <MathBlockElement {...props} />
        </ErrorBoundary>
      );
      break;
    case "math-block":
      el = (
        <ErrorBoundary errorComponent={ErrorComponent}>
          <MathQuill {...props} />
        </ErrorBoundary>
      );
      break;
    case "embed-video":
      el = <ResizableEmbedVideo {...props} />;
      break;
    case "enter-embed-video-url-ui":
      el = <EnterEmbdedVideoUrlUI {...props} />;
      break;
    case "horizontal-line":
      el = (
        <div
          {...attributes}
          {...element}
          data-slate-void="true"
          contentEditable="false"
        >
          <hr className="border border-dashed border-gray-[#1f1f1a1d] w-full my-2" />
        </div>
      );
      break;
    case "section-header":
      el = <SectionHeader {...props} />;
      break;
    default:
      if (textContent === "" && !readonly && isSelectionInThisElement) {
        el = (
          <p
            {...attributes}
            {...element}
            style={style}
            className="relative"
            data-placeholder="Type here or use '/' to insert blocks"
          >
            {children}
          </p>
        );
      } else {
        el = (
          <p {...attributes} {...element} style={style}>
            {children}
          </p>
        );
      }
  }

  // Check if the element is a nested list item
  const isNestedListItem = path.length > 1 && path.some((p) => p !== 0);

  const showSideTools =
    !isNestedListItem &&
    !readonly &&
    !element.isInnerLevel &&
    !["table-row", "table-cell"].includes(element.type);

  const moveUp = () => {
    const previousPath = Path.previous(path);
    if (Node.has(editor, previousPath)) {
      Transforms.deselect(editor); // Avoid intermediate state issues
      swapNodes(editor, path, previousPath);
      ReactEditor.focus(editor); // Restore focus
    }
  };

  const moveDown = () => {
    const nextPath = Path.next(path);
    if (Node.has(editor, nextPath)) {
      Transforms.deselect(editor); // Avoid intermediate state issues
      swapNodes(editor, path, nextPath);
      ReactEditor.focus(editor); // Restore focus
    }
  };

  const handleDelete = () => {
    deleteElementAndFocusNext(editor, path);
  };

  const handleAdd = () => {
    insertNewElementNext(editor, path);
  };

  const wrapper = (
    <div
      className={
        "group/line relative mx-auto " +
        (readonly
          ? element.isInnerLevel
            ? "w-full my-1"
            : "w-full my-2"
          : element.isInnerLevel
          ? " w-full px-2 !my-1 "
          : " py-2 w-[90.2%] md:w-[95.25%] px-2")
      }
      contentEditable={
        element.type !== "code-block" &&
        element.type !== "image-block" &&
        element.type !== "math-block-container" &&
        element.type !== "math-block" &&
        element.type !== "choose-image-ui" &&
        element.type !== "section-header" &&
        element.type !== "hr" &&
        element.type !== "embed-video" &&
        element.type !== "enter-embed-video-url-ui" &&
        element.type !== "image-carousel" &&
        !readonly
      }
      // data-slate-void={element.type === "code-block"}
    >
      {showSideTools && (
        <div className="group-hover/line:opacity-100 opacity-0 absolute -left-4 top-1/2 transform -translate-y-1/2">
          <div className="flex flex-col text-sm text-gray-400">
            <div
              className="cursor-pointer px-0.5 py-1 transition-all hover:bg-gray-200 rounded"
              onClick={moveUp}
            >
              <FaArrowUp />
            </div>
            <div
              className="cursor-pointer px-0.5 py-1 transition-all hover:bg-gray-200 rounded"
              onClick={moveDown}
            >
              <FaArrowDown />
            </div>
          </div>
        </div>
      )}
      {showSideTools && (
        <div className="group-hover/line:opacity-100 opacity-0 absolute -right-4 top-1/2 transform -translate-y-1/2">
          <div className="flex flex-col text-base text-gray-400">
            <div
              className="cursor-pointer px-0.5 py-1 transition-all hover:bg-gray-200 rounded"
              onClick={handleAdd}
            >
              <IoMdAdd />
            </div>
            <div
              className="cursor-pointer px-0.5 py-1 transition-all hover:bg-gray-200 rounded"
              onClick={handleDelete}
            >
              <RiDeleteBinLine />
            </div>
          </div>
        </div>
      )}
      {el}
    </div>
  );

  return wrapper;
};

export default CustomSlateElement;
