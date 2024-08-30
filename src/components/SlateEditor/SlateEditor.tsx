"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
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
import EventEmitter from "@/lib/EventEmitter";

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

function isValidSlateValue(value: any): value is CustomElement[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (v) =>
        typeof v === "object" &&
        "type" in v &&
        "children" in v &&
        Array.isArray(v.children)
    )
  );
}

interface SlateEditorProps {
  readonly?: boolean;
  value?: CustomElement[];
  onChange?: () => void;
  showToolbar?: boolean;
}
const SlateEditor = (props: SlateEditorProps, ref: any) => {
  const editor = useMemo(
    () => withShortcuts(withReact(withHistory(createEditor()))),
    []
  );
  const [value, setValue] = useState(
    isValidSlateValue(props.value) ? props.value : initialValue
  );
  const [readonly, setReadonly] = useState(props.readonly ?? false);

  useEffect(() => {
    const unsub = EventEmitter.addListener("get-slate-value", () => {
      EventEmitter.emit("slate-value-change", {
        value,
        editor,
      });
    });

    return () => {
      unsub.remove();
    };
  }, [value, editor]);

  const renderLeaf = (props: any) => {
    let { attributes, children, leaf } = props;

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

    if (leaf.dropdown && !readonly) {
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

  const [key, setKey] = useState(0);

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
    <div
      key={key}
      className={
        "minerva-slate min-h-[150px] text-[16px] w-full flex-1 flex-shrink " +
        (readonly ? " bg-transparent" : " border bg-lightPrimary")
      }
    >
      <Slate
        editor={editor}
        initialValue={readonly && !!value ? exportSlateState(value) : value}
        // @ts-ignore
        onValueChange={(val) => {
          props.onChange?.();
          setValue(val as any);
          if (!readonly)
            EventEmitter.emit("slate-value-change", {
              value: val,
              editor,
            });
        }}
        // @ts-ignore
        onChange={setValue}
      >
        {props.showToolbar && (
          <Toolbar readonly={readonly} setReadonly={setReadonly} />
        )}
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
