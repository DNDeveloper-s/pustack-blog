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

    if (selection && Range.isCollapsed(selection)) {
      {
        const [start] = Range.edges(selection);
        const { path, offset } = start;
        const node = Node.get(editor, path);

        // Get the text before the current cursor position
        // @ts-ignore
        const beforeText = node.text.slice(0, offset);
        const splitted = beforeText.split(" ");
        const textToCheck = splitted[splitted.length - 1];

        // Check if there is a slash before the current position
        const slashIndex = textToCheck.lastIndexOf("/");

        if (slashIndex !== -1) {
          // Delete the character
          deleteBackward(...args);

          // Calculate the query text as everything after the last slash
          const query = textToCheck.slice(slashIndex + 1, -1);

          console.log("slashIndex - ", slashIndex);
          if (slashIndex)
            // Show or update the dropdown menu at the initial slash position
            setTimeout(() => {
              if (query === "") {
                editor.showDropdownMenu({
                  ...dropdownPosition,
                  query: "",
                });
              } else {
                if (!dropdownPosition) {
                  const domSelection = window.getSelection();
                  if (!domSelection) return;
                  const domRange = domSelection.getRangeAt(0);
                  const rect = domRange.getBoundingClientRect();
                  console.log("setting dropdownPosition -");
                  dropdownPosition = {
                    top: rect.top + window.scrollY + 20,
                    left: rect.left + window.scrollX,
                  };
                }
                editor.showDropdownMenu({
                  ...dropdownPosition,
                  query,
                });
              }
            }, 0);

          return;
        }
      }

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

      deleteBackward(...args);
    }
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

  // editor.insertBreak = () => {
  //   const { selection } = editor;
  //   if (selection) {
  //     {
  //       const [match] = Array.from(
  //         Editor.nodes(editor, {
  //           match: (n) => Element.isElement(n) && n.type.includes("list-item"),
  //         })
  //       );

  //       if (match) {
  //         const [node, path] = match;
  //         const nodeString = Node.string(node);

  //         if (nodeString.length === 0) {
  //           // Get the parent path of the list item
  //           const parentPath = Path.parent(path);

  //           // Remove the empty list item
  //           Transforms.removeNodes(editor, { at: path });

  //           // Check if the parent list is now empty and should be removed
  //           const parentNode = Node.get(editor, parentPath);
  //           if (
  //             Element.isElement(parentNode) &&
  //             parentNode.children.length === 0
  //           ) {
  //             Transforms.removeNodes(editor, { at: parentPath });
  //           }

  //           // Insert a new paragraph at the correct position
  //           const insertPath = Path.next(parentPath);
  //           Transforms.insertNodes(
  //             editor,
  //             {
  //               type: "paragraph",
  //               children: [{ text: "" }],
  //             },
  //             { at: insertPath }
  //           );

  //           // Move the selection to the newly created paragraph
  //           Transforms.select(editor, Editor.start(editor, insertPath));

  //           return;
  //         }
  //       }
  //     }

  //     {
  //       // Reset the formatting to paragraph
  //       const { selection } = editor;
  //       // if (selection) {
  //       //   insertBreak();
  //       //   const [match] = Array.from(
  //       //     Editor.nodes(editor, {
  //       //       match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
  //       //     })
  //       //   );

  //       //   if (match) {
  //       //     const [, path] = match;
  //       //     Transforms.setNodes(editor, { type: "paragraph" }, { at: path });
  //       //   }
  //       //   return;
  //       // }
  //     }
  //   }

  //   insertBreak();
  // };

  return editor;
};

export default withShortcuts;
