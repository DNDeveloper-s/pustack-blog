import { Editor, Element, Node, Path, Point, Range, Transforms } from "slate";
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
    const { selection, path } = editor;

    // if (text.endsWith("/") && selection && Range.isCollapsed(selection)) {
    //   // Show the dropdown with few items
    //   console.log("Show the dropdown with few items - ", selection);
    //   const newProperties: Partial<SlateElement> = {
    //     type: "span",
    //     className: "menu",
    //   };
    //   Transforms.setNodes<SlateElement>(editor, newProperties, {
    //     match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
    //   });
    // }

    // if (text === "/" && selection && Range.isCollapsed(selection)) {
    //   // Show the dropdown menu
    //   const domSelection = window.getSelection();
    //   if (!domSelection) return insertText(text);
    //   const domRange = domSelection.getRangeAt(0);
    //   const rect = domRange.getBoundingClientRect();

    //   editor.showDropdownMenu({
    //     top: rect.top + window.scrollY + 20,
    //     left: rect.left + window.scrollX,
    //   });
    // } else {
    //   if (text === " " || text === "\n") {
    //     editor.hideDropdownMenu();
    //   }
    // }

    // Commented
    if (selection && Range.isCollapsed(selection)) {
      if ((text === " " || text === "\n") && dropdownPosition) {
        editor.hideDropdownMenu();
        dropdownPosition = null;
        insertText(text);
        console.log(" - - ");
        return;
      }

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
        // Insert the new character
        insertText(text);

        // Calculate the query text as everything after the last slash
        const query = textToCheck.slice(slashIndex + 1) + text;

        // Show or update the dropdown menu
        setTimeout(() => {
          if (!dropdownPosition) {
            const domSelection = window.getSelection();
            if (!domSelection) return insertText(text);
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
        }, 0);

        return;
      } else if (text === "/") {
        insertText(text);

        setTimeout(() => {
          const domSelection = window.getSelection();
          if (!domSelection) return insertText(text);
          const domRange = domSelection.getRangeAt(0);
          const rect = domRange.getBoundingClientRect();
          console.log("setting dropdownPosition -");
          dropdownPosition = {
            top: rect.top + window.scrollY + 20,
            left: rect.left + window.scrollX,
          };
          editor.showDropdownMenu({
            ...dropdownPosition,
            query: "",
          });
        }, 0);

        return;
      }

      // const [start] = Range.edges(selection);
      // const { path, offset } = start;
      // const node = Node.get(editor, path);

      // // Check the text before the cursor
      // const before = Editor.before(editor, selection, { unit: "character" });
      // const beforeRange = before && Editor.range(editor, before, selection);
      // const beforeText =
      //   (beforeRange && Editor.string(editor, beforeRange)) || "";

      // console.log("beforeTexty - ", before);

      // if (beforeText.endsWith("/") || beforeText.includes("/")) {
      //   // Insert the new character
      //   insertText(text);

      //   // Calculate the query text
      //   const query = beforeText.split("/").pop() + text;

      //   // Show or update the dropdown menu
      //   setTimeout(() => {
      //     const domSelection = window.getSelection();
      //     if (!domSelection) return insertText(text);
      //     const domRange = domSelection.getRangeAt(0);
      //     const rect = domRange.getBoundingClientRect();
      //     editor.showDropdownMenu({
      //       top: rect.top + window.scrollY + 20,
      //       left: rect.left + window.scrollX,
      //       query,
      //     });
      //   }, 0);

      //   return;
      // }

      // if (
      //   text === "/" ||
      //   (beforeText.startsWith("/") && beforeText.length > 1)
      // ) {
      //   // Show the dropdown menu and filter options
      //   const query = beforeText.slice(1) + text;
      //   const domSelection = window.getSelection();
      //   if (!domSelection) return insertText(text);
      //   const domRange = domSelection.getRangeAt(0);
      //   const rect = domRange.getBoundingClientRect();

      //   editor.showDropdownMenu({
      //     top: rect.top + window.scrollY + 20,
      //     left: rect.left + window.scrollX,
      //     query,
      //   });
      // } else {
      //   // Hide the dropdown menu on space or enter
      //   if (text === " " || text === "\n") {
      //     editor.hideDropdownMenu();
      //   }
      // }
    }

    if (text.endsWith(" ") && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      const block = Editor.above(editor, {
        match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
      });
      const path = block ? block[1] : [];
      const start = Editor.start(editor, path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(editor, range) + text.slice(0, -1);
      // @ts-ignore
      const type = SHORTCUTS[beforeText];

      if (type) {
        Transforms.select(editor, range);

        if (!Range.isCollapsed(range)) {
          Transforms.delete(editor);
        }

        const newProperties: Partial<Element> = {
          type,
        };

        Transforms.setNodes<Element>(editor, newProperties, {
          match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
        });

        console.log("type - ", type);

        if (type === "list-item") {
          const list: BulletedListElement = {
            type: "bulleted-list",
            children: [],
          };
          console.log("wrappiong - ");
          // @ts-ignore
          Transforms.wrapNodes(editor, list, {
            match: (n) =>
              !Editor.isEditor(n) &&
              Element.isElement(n) &&
              // @ts-ignore
              n.type === "list-item",
          });
        } else if (type === "list-item-number") {
          const list = {
            type: "numbered-list",
            children: [],
          };
          // @ts-ignore
          Transforms.wrapNodes(editor, list, {
            match: (n) =>
              !Editor.isEditor(n) &&
              Element.isElement(n) &&
              // @ts-ignore
              n.type === "list-item-number",
          });
        } else if (type === "list-item-alpha") {
          const list = {
            type: "alphabet-list",
            children: [],
          };
          // @ts-ignore
          Transforms.wrapNodes(editor, list, {
            match: (n) =>
              !Editor.isEditor(n) &&
              Element.isElement(n) &&
              // @ts-ignore
              n.type === "list-item-alpha",
          });
        }

        return;
      }
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
    console.log("block - ", block);

    if (block) {
      const [, path] = block;
      const start = Editor.start(editor, path);

      const before = Editor.before(editor, anchor, { unit: "character" });
      const charBefore = before
        ? Editor.string(editor, { anchor: before, focus: anchor })
        : null;

      // Hide the dropdown menu if the "/" is deleted
      if (charBefore === "/") {
        editor.hideDropdownMenu();
        deleteBackward(...args);
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
