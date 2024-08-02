import { Descendant, Editor, Location, Path, Text, Transforms } from "slate";
import { SlateContextValue } from "slate-react/dist/hooks/use-slate";
import { CustomElement } from "../../../../types/slate";
import { Node } from "slate";
import { defaultElement } from "../DropdownMenu";

export const moveCursorto = (editor: Editor, target: Location) => {
  try {
    Transforms.select(editor, target);
  } catch (e) {
    console.error("Error moving cursor to target", e);
  }
};

export const exportSlateState = (value: CustomElement[]) => {
  // Filter out the elements that has type in ["choose-image-ui", "enter-embed-video-url-ui"]
  const arr = value.filter(
    (v) => !["choose-image-ui", "enter-embed-video-url-ui"].includes(v.type)
  );
  if (arr.length === 0) {
    return [defaultElement];
  }

  return arr;
};

const exceptionTypes = [
  "image-block",
  "code-block",
  "math-block",
  "embed-video",
];

/**
 * Check if the editor has any text content excluding custom image elements.
 * @param {Editor} editor - The Slate editor instance.
 * @param {string} customImageType - The type of the custom image element.
 * @returns {boolean} - True if the editor has text content excluding images, otherwise false.
 */
export const hasContent = (editor: Editor) => {
  for (const [node, path] of Node.descendants(editor)) {
    // @ts-ignore
    if (exceptionTypes.includes(node.type as string)) {
      // Skip custom image elements
      return true;
    }

    if (Node.string(node).trim().length > 0) {
      return true;
    }
  }
  return false;
};

// /**
//  * Extract the first existing text from the editor values.
//  * @param {Editor} editor - The Slate editor instance.
//  * @returns {string} - The first existing text found, or an empty string if no text is found.
//  */
// export const getFirstExistingText = (editor: Editor): string | null => {
//   for (const [node] of Node.texts(editor)) {
//     if (Text.isText(node) && node.text.trim().length > 0) {
//       return node.text.trim();
//     }
//   }
//   return null;
// };

/**
 *
 * @param nodes
 * @returns
 */
const findFirstText = (nodes: Node[]): any => {
  for (const node of nodes) {
    if (Text.isText(node) && node.text.trim().length > 0) {
      return node.text.trim();
      // @ts-ignore
    } else if (Node.isNode(node) && node.children) {
      // @ts-ignore
      const result = findFirstText(node.children);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

/**
 * Extract the first existing text from the editor values.
 * @param {Array} values - The Slate editor values array.
 * @returns {string} - The first existing text found, or an empty string if no text is found.
 */
export const getFirstExistingText = (values: Descendant[]) => {
  return findFirstText(values);
};

/**
 *
 * @param values
 * @returns
 */
export const getFirstImage = (values: Descendant[]) => {
  for (const node of values) {
    // @ts-ignore
    if (node.type === "image-block") {
      return node.src;
    }
  }
  return null;
};

/**
 *
 * @param values
 * @returns
 */
export const getSections = (values: Descendant[]) => {
  const sections: { icon: string; title: string; id: string }[] = [];
  for (const node of values) {
    // @ts-ignore
    if (node.type === "section-header") {
      sections.push({ icon: node.icon, title: node.title, id: node.id });
    }
  }
  return sections;
};

/**
 *
 * @param editor {Editor}
 * @param currentPath {Path}
 * @returns {boolean}
 */
export const hasNextPath = (editor: Editor, currentPath: Path) => {
  const nextPath = Path.next(currentPath);
  return Node.has(editor, nextPath);
};

/**
 *
 * @param editor
 * @returns
 */
export const extractTextFromEditor = (editor: Editor | any[]) => {
  if (editor instanceof Array) {
    return editor.map((node) => Node.string(node)).join(" ");
  }
  if (typeof editor === "object") {
    const { children } = editor;
    return children.map((node) => Node.string(node)).join(" ");
  }
  return "";
};
