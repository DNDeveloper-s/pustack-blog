"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import {
  Descendant,
  Editor,
  Element,
  Node,
  Path,
  Text,
  Transforms,
  createEditor,
} from "slate";
import { withHistory } from "slate-history";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import withShortcuts, { SHORTCUTS } from "./utils/withShortcuts";
import CustomSlateElement from "./CustomSlateElement";
import DropdownMenu, { StaticDropdownMenu } from "./DropdownMenu";
import {
  exportSlateState,
  getFirstExistingText,
  getFirstImage,
  hasContent,
} from "./utils/helpers";
import { CustomElement } from "../../../types/slate";
import Toolbar, { ToolType } from "./Toolbar";
import SlateColorPicker from "./SlateColorPicker";
import { Input, Popover } from "antd";
import { Button } from "@nextui-org/button";
import LinkUrlComponent from "./LinkUrlComponent";

const TEXT_COLOR_MARK = "color";

const initialValue: CustomElement[] = [
  {
    type: "paragraph",
    align: "left",
    children: [
      {
        text: "",
      },
    ],
  },
];

export interface SlateEditorRef {
  getValue: () => Descendant[];
  setReadonly: (readonly: boolean) => void;
  hasSomeContent: () => boolean;
  reset: () => void;
}

interface SlateEditorProps {
  readonly?: boolean;
  value?: CustomElement[];
}
const SlateEditor = (props: SlateEditorProps, ref: any) => {
  const editor = useMemo(
    () => withShortcuts(withReact(withHistory(createEditor()))),
    []
  );
  const [value, setValue] = useState(props.value ?? initialValue);
  const [readonly, setReadonly] = useState(props.readonly ?? false);
  const moveUp = useCallback(() => {
    if (editor.selection) {
      // @ts-ignore
      const isActive = isColorActive(editor, "#ff5e4c");
      // Transforms.setNodes(
      //   editor,
      //   // @ts-ignore
      //   { [TEXT_COLOR_MARK]: "#ff5e4c" },
      //   // @ts-ignore
      //   { match: Text.isText, split: true }
      // );
      Editor.addMark(editor, TEXT_COLOR_MARK, "#ff5e4c");
    }
  }, [editor, value]);

  // useEffect(() => {
  //   if (props.value) {
  //     setValue(props.value);
  //     setKey((prev) => prev + 1);
  //   }
  // }, [props.value]);

  const renderLeaf = (props: any) => {
    let { attributes, children, leaf } = props;

    console.log("props - ", props);

    if (leaf.bold) {
      children = <strong>{children}</strong>;
    }

    if (leaf.italic) {
      children = <em>{children}</em>;
    }

    if (leaf.underline) {
      children = <u>{children}</u>;
    }

    if (leaf["strike-through"]) {
      children = <del>{children}</del>;
    }

    if (leaf.link) {
      children = (
        <LinkUrlComponent key={leaf.link} {...props}>
          {children}
        </LinkUrlComponent>
      );
    }

    if (leaf.dropdown) {
      return (
        <span {...attributes} className="relative">
          <span>{children}</span>
          <DropdownMenu />
        </span>
      );
    }

    const style = {
      color: leaf.color,
      backgroundColor: leaf.backgroundColor,
      fontSize: leaf.fontSize,
    };

    return (
      <span {...attributes} style={style}>
        {children}
      </span>
    );
  };

  const renderElement = useCallback(
    (props: any) => <CustomSlateElement {...props} editor={editor} />,
    [editor]
  );

  const handleKeyDown = (event: any) => {
    if (event.key === "Tab") {
      event.preventDefault();
      const { selection } = editor;

      if (selection) {
        const [cellNode, cellPath] = Array.from(
          Editor.above(editor, {
            // @ts-ignore
            match: (n) => n.type === "table-cell",
          }) ?? []
        );

        if (cellNode) {
          // @ts-ignore
          const rowPath = Path.parent(cellPath);
          const tablePath = Path.parent(rowPath);
          // @ts-ignore
          const colIndex = cellPath[cellPath.length - 1];
          const rowIndex = rowPath[rowPath.length - 1];

          const tableNode = Editor.node(editor, tablePath)[0];

          if (event.shiftKey) {
            // Handle Shift + Tab (move to the previous cell)
            if (colIndex === 0) {
              if (rowIndex > 0) {
                const prevRowPath = Path.previous(rowPath);
                const prevCellPath = [
                  ...prevRowPath,
                  // @ts-ignore
                  tableNode.children[prevRowPath[prevRowPath.length - 1]]
                    .children.length - 1,
                ];
                Transforms.select(editor, Editor.end(editor, prevCellPath));
                ReactEditor.focus(editor);
              }
            } else {
              const prevCellPath = [...rowPath, colIndex - 1];
              Transforms.select(editor, Editor.end(editor, prevCellPath));
              ReactEditor.focus(editor);
            }
          } else {
            // Handle Tab (move to the next cell)
            const isLastCellInRow =
              // @ts-ignore
              colIndex === tableNode.children[rowIndex].children.length - 1;

            if (isLastCellInRow) {
              const isLastRowInTable =
                // @ts-ignore
                rowIndex === tableNode.children.length - 1;

              if (!isLastRowInTable) {
                const nextRowPath = Path.next(rowPath);
                const nextCellPath = [...nextRowPath, 0];
                Transforms.select(editor, Editor.end(editor, nextCellPath));
                ReactEditor.focus(editor);
              }
            } else {
              const nextCellPath = [...rowPath, colIndex + 1];
              Transforms.select(editor, Editor.end(editor, nextCellPath));
              ReactEditor.focus(editor);
            }
          }
        }
      }
    }
  };

  const handleDOMBeforeInput = useCallback(
    (e: InputEvent) => {
      queueMicrotask(() => {
        const pendingDiffs = ReactEditor.androidPendingDiffs(editor);

        const scheduleFlush = pendingDiffs?.some(({ diff, path }) => {
          if (!diff.text.endsWith(" ")) {
            return false;
          }

          const { text } = Node.leaf(editor, path);
          const beforeText = text.slice(0, diff.start) + diff.text.slice(0, -1);
          if (!(beforeText in SHORTCUTS)) {
            return;
          }

          const blockEntry = Editor.above(editor, {
            at: path,
            match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
          });
          if (!blockEntry) {
            return false;
          }

          const [, blockPath] = blockEntry;
          return Editor.isStart(editor, Editor.start(editor, path), blockPath);
        });

        if (scheduleFlush) {
          ReactEditor.androidScheduleFlush(editor);
        }
      });
    },
    [editor]
  );

  function handleSave() {
    // const _value = JSON.stringify(value);
    // window.localStorage.setItem("slate_content", _value);

    // const has = hasContent(editor);

    console.log("value - ", value);

    // const text = getFirstExistingText(value);
    // const src = getFirstImage(value);
    // console.log("text - ", text);
    // console.log("src - ", src);
  }

  const [key, setKey] = useState(0);

  function handleLoad() {
    const _value = window.localStorage.getItem("slate_content");
    if (_value) {
      setKey((prev) => prev + 1);
      setValue(JSON.parse(_value));
    }
  }

  useImperativeHandle(ref, () => ({
    getValue: () => value,
    setReadonly: (readonly: boolean) => {
      setKey((prev) => prev + 1);
      setReadonly(readonly);
    },
    hasSomeContent: () => {
      return hasContent(editor);
    },
  }));

  return (
    <div key={key} className="minerva-slate min-h-[150px]">
      <Slate
        editor={editor}
        initialValue={readonly ? exportSlateState(value) : value}
        // @ts-ignore
        onValueChange={setValue}
        // @ts-ignore
        onChange={setValue}
      >
        {!readonly && <Toolbar />}
        <Editable
          readOnly={readonly}
          onDOMBeforeInput={handleDOMBeforeInput}
          onKeyDown={handleKeyDown}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          spellCheck
          autoFocus
        />
      </Slate>
    </div>
  );
};

export default forwardRef(SlateEditor);
