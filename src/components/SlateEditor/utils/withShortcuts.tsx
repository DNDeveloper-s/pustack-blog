import {
  Editor,
  Element,
  Node,
  Path,
  Point,
  Range,
  Text,
  Transforms,
} from "slate";
import {
  // AlphabetListElement,
  BulletedListElement,
  // NumberListElement,
} from "../../../../types/slate";
import { ReactEditor } from "slate-react";

let dropdownPosition: any = null;

export const SHORTCUTS = {
  "*": "list-item",
  "-": "list-item-number",
  "+": "list-item-alpha",
  ">": "block-quote",
  "#": "heading-one",
  "##": "heading-two",
  "###": "heading-three",
  "####": "heading-four",
  "#####": "heading-five",
  "######": "heading-six",
};

const getNonZeroPath = (path: Path) => {
  const returnedPath = Array.from(path);
  while (returnedPath.at(-1) === 0) {
    returnedPath.pop();
  }
  return returnedPath;
  // for (let i = 0; i < path.length; i++) {
  //   if (path[i] !== 0) {
  //     break;
  //   }
  //   returnedPath.pop();
  // }
};

const withShortcuts = (editor: Editor) => {
  const { deleteBackward, insertText, insertBreak } = editor;

  editor.insertText = (text) => {
    const { selection } = editor;

    if (text === " " && selection && Range.isCollapsed(selection)) {
      // @ts-ignore
      if (Editor.marks(editor)?.dropdown) {
        Transforms.setNodes(
          editor,
          // @ts-ignore
          { dropdown: false },
          { match: Text.isText }
        );
      }
    }

    if (text === "/" && selection && Range.isCollapsed(selection)) {
      const [tableCell] = Editor.nodes(editor, {
        // @ts-ignore
        match: (n) => n.type === "paragraph",
      });

      if (!tableCell) {
        // Prevent default behavior when inside a table cell
        insertText(text);
        return;
      }

      // @ts-ignore
      if (Editor.marks(editor)?.dropdown) {
        Transforms.setNodes(
          editor,
          // @ts-ignore
          { dropdown: false },
          { match: Text.isText }
        );
      }
      Editor.addMark(editor, "dropdown", true);
      insertText(text);

      return;
    }

    insertText(text);
  };

  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    console.log("selection - ", selection);

    // if (selection) {
    //   const [currentNode, currentPath] = Editor.node(
    //     editor,
    //     selection.anchor.path
    //   );

    //   console.log("currentNode - ", currentNode, selection.anchor);

    //   // Check if we're at the start of a block and need to handle a custom block (math-block or container)
    //   if (selection.anchor.offset === 0 && selection.anchor.path.at(-1) === 0) {
    //     const currentPathForPrev = getNonZeroPath(selection.anchor.path);

    //     if (currentPathForPrev.length === 0) {
    //       deleteBackward(...args);
    //       return;
    //     }

    //     const prevPath = Path.previous(currentPathForPrev);
    //     const [prevNode] = Editor.node(editor, prevPath);

    //     // Handle the case where the previous node is a math-block-container or math-block
    //     if (
    //       // @ts-ignore
    //       prevNode.type === "math-block-container" ||
    //       // @ts-ignore
    //       prevNode.type === "math-block"
    //     ) {
    //       ReactEditor.blur(editor);
    //       // Prevent default delete action
    //       Transforms.removeNodes(editor, { at: currentPathForPrev });

    //       // Manually handle focusing the math quill element after deletion
    //       setTimeout(() => {
    //         // Find the math quill textarea in the previous node
    //         const previousEl = ReactEditor.toDOMNode(editor, prevNode);
    //         const mathQuillTextarea = previousEl?.querySelector(
    //           ".mq-textarea textarea"
    //         );

    //         // Focus the math quill element manually
    //         if (mathQuillTextarea) {
    //           // @ts-ignore
    //           mathQuillTextarea.focus();
    //         }
    //       }, 10);

    //       return;
    //     }
    //   }
    // }

    // Get the element on the selection
    if (selection) {
      const [currentNode, currentPath] = Editor.node(
        editor,
        selection.anchor.path
      );
      // @ts-ignore
      if (selection.anchor.offset === 0 && selection.anchor.path.at(-1) === 0) {
        const currentPathForPrev = getNonZeroPath(selection.anchor.path);

        if (currentPathForPrev.length === 0) {
          deleteBackward(...args);
          return;
        }
        const prevPath = Path.previous(currentPathForPrev);
        const [prevNode] = Editor.node(editor, prevPath);
        // console.log("Current node:", currentNode, prevNode);

        // @ts-ignore
        if (prevNode.type === "math-block-container") {
          // Transforms.deselect(editor);

          ReactEditor.blur(editor);
          Transforms.removeNodes(editor, { at: currentPathForPrev });
          // Transforms.select(editor, [0]);
          // console.log("currentPath - ", currentPath);
          // // Transforms.removeNodes(editor, { at: [5] });
          setTimeout(() => {
            const previousEl = ReactEditor.toDOMNode(editor, prevNode);
            // // @ts-ignore
            // //
            const el3 = previousEl?.querySelectorAll(".mq-textarea textarea");
            const lastEl = el3[el3.length - 1];
            ReactEditor.focus(editor);
            // @ts-ignore
            lastEl?.focus();
          }, 10);
          // deleteBackward("block");
          //
          return;
        }

        // @ts-ignore
        if (prevNode.type === "math-block") {
          // Transforms.deselect(editor);

          ReactEditor.blur(editor);
          Transforms.removeNodes(editor, { at: currentPathForPrev });
          // Transforms.select(editor, [0]);
          // console.log("currentPath - ", currentPath);
          // // Transforms.removeNodes(editor, { at: [5] });
          setTimeout(() => {
            const previousEl = ReactEditor.toDOMNode(editor, prevNode);
            // // @ts-ignore
            // //
            const el3 = previousEl?.querySelector(".mq-textarea textarea");
            // ReactEditor.focus(editor);
            // @ts-ignore
            el3?.focus();
          }, 10);
          // deleteBackward("block");
          //
          return;
        }
      }
    }

    // deleteBackward(...args);

    // @ts-ignore
    const { anchor } = selection;
    const block = Editor.above(editor, {
      match: (n: any) => Editor.isBlock(editor, n),
    });

    if (block) {
      const [, path] = block;
      const start = Editor.start(editor, path);

      const before = Editor.before(editor, anchor, { unit: "character" });
      const charBefore = before
        ? Editor.string(editor, { anchor: before, focus: anchor })
        : null;

      // Hide the dropdown menu if the "/" is deleted
      if (charBefore === "/") {
        // editor.hideDropdownMenu();
        deleteBackward(...args);
        // @ts-ignore
        if (Editor.marks(editor)?.dropdown) {
          Transforms.setNodes(
            editor,
            // @ts-ignore
            { dropdown: false },
            { match: Text.isText }
          );
        }
        return;
      }
    }

    if (selection) {
      const match = Editor.above(editor, {
        match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
      });

      if (match) {
        const [block, path] = match;
        const start = Editor.start(editor, path);

        if (
          !Editor.isEditor(block) &&
          Element.isElement(block) &&
          block.type !== "paragraph" &&
          Point.equals(selection.anchor, start)
        ) {
          const newProperties: Partial<Element> = {
            type: "paragraph",
          };
          Transforms.setNodes(editor, newProperties);

          if (block.type === "list-item") {
            Transforms.unwrapNodes(editor, {
              match: (n) =>
                !Editor.isEditor(n) &&
                Element.isElement(n) &&
                // @ts-ignore
                n.type === "bulleted-list",
              split: true,
            });
          }

          return;
        }
      }
    }

    deleteBackward(...args);
    // }
  };

  editor.showDropdownMenu = (position) => {
    const event = new CustomEvent("show-dropdown-menu", { detail: position });
    window.dispatchEvent(event);
  };

  editor.hideDropdownMenu = () => {
    const event = new CustomEvent("hide-dropdown-menu");
    dropdownPosition = null;
    window.dispatchEvent(event);
  };

  editor.insertBreak = () => {
    const { selection } = editor;
    if (selection) {
      const [tableCell] = Editor.nodes(editor, {
        // @ts-ignore
        match: (n) => n.type === "table-cell",
      });

      if (tableCell) {
        // Prevent default behavior when inside a table cell
        return;
      }

      const [match] = Array.from(
        Editor.nodes(editor, {
          match: (n) => Element.isElement(n) && n.type === "list-item",
        })
      );

      if (match) {
        const [node, path] = match;
        const nodeString = Node.string(node);

        if (nodeString.length === 0) {
          // Get the parent path of the list item
          const parentPath = Path.parent(path);
          const grandparentPath = Path.parent(parentPath);

          // Remove the empty list item
          Transforms.removeNodes(editor, { at: path });

          // Check if the parent list is now empty and should be removed
          const parentNode = Node.get(editor, parentPath);
          if (
            Element.isElement(parentNode) &&
            parentNode.children.length === 0
          ) {
            Transforms.removeNodes(editor, { at: parentPath });
          }

          // Check if the grandparent is a list (bulleted-list or numbered-list)
          const grandparentNode = Node.get(editor, grandparentPath);
          if (
            Element.isElement(grandparentNode) &&
            (grandparentNode.type === "bulleted-list" ||
              grandparentNode.type === "numbered-list" ||
              grandparentNode.type === "alphabet-list")
          ) {
            // Insert a new list item at the correct position
            const insertPath = Path.next(parentPath);
            Transforms.insertNodes(
              editor,
              {
                type: "list-item",
                children: [{ text: "" }],
              },
              { at: insertPath }
            );

            // Move the selection to the newly created list item
            Transforms.select(editor, Editor.start(editor, insertPath));
          } else {
            // Insert a new paragraph at the correct position
            const insertPath = Path.next(parentPath);
            Transforms.insertNodes(
              editor,
              {
                type: "paragraph",
                children: [{ text: "" }],
              },
              { at: insertPath }
            );

            // Move the selection to the newly created paragraph
            Transforms.select(editor, Editor.start(editor, insertPath));
          }

          return;
        }

        // Insert a new list item if the current one is not empty
        const insertPath = Path.next(path);
        Transforms.insertNodes(
          editor,
          {
            type: "list-item",
            children: [{ text: "" }],
          },
          { at: insertPath }
        );

        // Move the selection to the newly created list item
        Transforms.select(editor, Editor.start(editor, insertPath));
        return;
      }
    }

    // Default break behavior
    insertBreak();
  };

  return editor;
};

export default withShortcuts;
