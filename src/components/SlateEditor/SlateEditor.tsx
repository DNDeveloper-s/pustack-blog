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
        text: 'The editor gives you full control over the logic you can add. For example, it\'s fairly common to want to add markdown-like shortcuts to editors. So that, when you start a line with "> " you get a blockquote that looks like this:',
      },
    ],
  },
  {
    type: "block-quote",
    align: "left",
    children: [{ text: "A wise quote." }],
  },
  {
    type: "paragraph",
    align: "left",
    children: [
      {
        text: 'Order when you start a line with "## " you get a level-two heading, like this:',
      },
    ],
  },
  {
    type: "heading-two",
    align: "left",
    children: [{ text: "Try it out!" }],
  },
  {
    type: "paragraph",
    align: "left",
    children: [
      {
        text: 'Try it out for yourself! Try starting a new line with ">", "-", or "#"s.',
      },
    ],
  },
];

export interface SlateEditorRef {
  getValue: () => Descendant[];
  setReadonly: (readonly: boolean) => void;
  hasSomeContent: () => boolean;
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
    <div key={key} className="minerva-slate min-h-[350px]">
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
          // onDOMBeforeInput={handleDOMBeforeInput}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          spellCheck
          autoFocus
        />
        <div className="mt-4 flex gap-4">
          <button onClick={handleSave}>Save</button>
          {/* <button onClick={handleLoad}>Load</button> */}
        </div>
        {/* {!readonly && <DropdownMenu />} */}
      </Slate>
    </div>
  );
};

export default forwardRef(SlateEditor);
