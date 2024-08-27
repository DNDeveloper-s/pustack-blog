import { Button } from "@nextui-org/button";
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaUnderline,
  FaAlignCenter,
  FaAlignLeft,
  FaAlignRight,
} from "react-icons/fa6";
import { PiListBulletsDuotone, PiListNumbersDuotone } from "react-icons/pi";
import { RiLinkUnlinkM } from "react-icons/ri";
import { Editor, Element, Path, Text, Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import SlateColorPopover, { SlateColorGroup } from "./SlateColorPicker";
import { MdFormatColorText } from "react-icons/md";
import { IoMdColorFill } from "react-icons/io";
import { applyLink } from "./LinkUrlComponent";
import FontSize from "./FontSize";
import { Popover } from "antd";
import { useEffect, useState } from "react";
import { Range } from "slate";
import { Checkbox } from "../SignUpForNewsLetters/SignUpForNewsLetters";
import { Node } from "slate";
import { useSlateConfig } from "@/context/SlateContext";
import useScreenSize from "@/hooks/useScreenSize";

export type ToolType =
  | "bold"
  | "italic"
  | "underline"
  | "strike-through"
  | "bulleted-list"
  | "numbered-list"
  | "alphabet-list"
  | "left"
  | "center"
  | "size"
  | "right"
  | "link";

export type ToolWithIconType =
  | "bold"
  | "italic"
  | "underline"
  | "strike-through"
  | "bulleted-list"
  | "numbered-list"
  | "alphabet-list"
  | "left"
  | "center"
  | "right"
  | "link";

type Tool = {
  id: ToolWithIconType;
  label: string;
  icon: JSX.Element;
};

const tools: Tool[][] = [
  [
    { id: "bold", label: "Bold", icon: <FaBold /> },
    {
      id: "italic",
      label: "Italic",
      icon: <FaItalic />,
    },
    {
      id: "underline",
      label: "Underline",
      icon: <FaUnderline />,
    },
    {
      id: "strike-through",
      label: "Strike Through",
      icon: <FaStrikethrough />,
    },
    {
      id: "bulleted-list",
      label: "Bullet List",
      icon: <PiListBulletsDuotone />,
    },
    {
      id: "numbered-list",
      label: "Numbered List",
      icon: <PiListNumbersDuotone />,
    },
    {
      id: "alphabet-list",
      label: "Numbered List",
      icon: <PiListNumbersDuotone />,
    },
    {
      id: "left",
      label: "Left Align",
      icon: <FaAlignLeft />,
    },
    {
      id: "center",
      label: "Center Align",
      icon: <FaAlignCenter />,
    },
    {
      id: "right",
      label: "Right Align",
      icon: <FaAlignRight />,
    },
  ],
];

export const isMarkActiveAcrossSelection = (editor: Editor, format: any) => {
  const { selection } = editor;
  if (!selection) return false;

  const [start, end] = Editor.edges(editor, selection);
  let isActive = true;

  Array.from(
    Editor.nodes(editor, {
      at: { anchor: start, focus: end },
      match: (n) => Text.isText(n),
      mode: "all",
    })
  ).forEach(([node]) => {
    // @ts-ignore
    if (!node[format]) {
      isActive = false;
    }
  });

  return isActive;
};

const isBlockActive = (editor: Editor, format: any) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Editor.nodes(editor, {
    at: Editor.unhangRange(editor, selection),
    match: (n) =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      (n.type === "paragraph" ||
        n.type === "heading-one" ||
        n.type === "heading-two" ||
        n.type === "heading-three" ||
        n.type === "heading-four" ||
        n.type === "heading-five" ||
        n.type === "heading-six" ||
        n.type === "block-quote") &&
      n.align === format,
  });

  return !!match;
};

const toggleAlignment = (
  editor: Editor,
  alignment: "center" | "left" | "right"
) => {
  const isActive = isBlockActive(editor, alignment);

  ReactEditor.focus(editor);

  Transforms.setNodes(
    editor,
    { align: isActive ? undefined : alignment },
    {
      // @ts-ignore
      match: (n) => Editor.isBlock(editor, n),
      mode: "all",
    }
  );
};

const insertListItem = (
  editor: Editor,
  type: "bulleted-list" | "numbered-list" | "alphabet-list" = "bulleted-list"
) => {
  const { selection } = editor;
  if (!selection) return;

  // Insert a new list item after the current selection
  Transforms.insertNodes(
    editor,
    {
      type,
      children: [
        {
          type: "list-item",
          children: [{ text: "" }],
        },
      ],
    },
    { at: Editor.end(editor, selection.focus.path) }
  );

  // Move the selection to the new list item
  const point = Editor.after(editor, selection.focus.path);
  if (point) {
    Transforms.select(editor, Editor.end(editor, point));
  }
};

export const toggleFormat = (editor: Editor, format: string) => {
  ReactEditor.focus(editor);

  if (["left", "center", "right"].includes(format)) {
    toggleAlignment(editor, format as any);
    return;
  }

  if (["bulleted-list", "numbered-list", "alphabet-list"].includes(format)) {
    insertListItem(editor, format as any);
    return;
  }

  if (["link"].includes(format)) {
    const url = "#";
    applyLink(editor, url);
    return;
  }

  const isActive = isMarkActiveAcrossSelection(editor, format);
  Transforms.setNodes(
    editor,
    { [format]: isActive ? null : true },
    { match: (n) => Text.isText(n), split: true }
  );
};

const applyTextColor = (editor: Editor, color: string) => {
  if (!getTopmostElement(editor)) return;
  Editor.addMark(editor, "color", color);
};

const applyBackgroundColor = (editor: Editor, color: string) => {
  if (!getTopmostElement(editor)) return;
  const { selection } = editor;

  if (selection && Range.isCollapsed(selection)) {
    const [tableCell] = Array.from(
      Editor.nodes(editor, {
        // @ts-ignore
        match: (n) => n.type === "table-cell",
      })
    );

    if (tableCell && tableCell[0]) {
      const cellPath = ReactEditor.findPath(editor, tableCell[0]);
      // @ts-ignore
      Transforms.setNodes(editor, { backgroundColor: color }, { at: cellPath });
      Transforms.select(editor, Editor.end(editor, cellPath));
      return;
    }
  }

  Editor.addMark(editor, "backgroundColor", color);
};

const activeTools = [
  "bold",
  "italic",
  "underline",
  "strike-through",
  "left",
  "center",
  "right",
  "link",
];

function LinkTool() {
  const editor = useSlate();

  const [showIconTutorial, setShowIconTutorial] = useState(false);

  // useEffect(() => {
  //   if (open) {
  //     setShowIconTutorial(false);
  //     window.localStorage.setItem("finished_link_tutorial", "true");
  //   }
  // }, [open]);

  // useEffect(() => {
  //   if (!window.localStorage.getItem("finished_link_tutorial")) {
  //     setShowIconTutorial(true);
  //   }
  // }, []);

  return (
    <Popover
      content={
        <p className="text-white">Hover over the links to see the magic.</p>
      }
      open={showIconTutorial}
      placement="top"
      overlayClassName="overlayClassName_choose_icon_animation"
      overlayInnerStyle={{
        padding: "4px 10px",
        fontSize: "13px",
        background: "var(--antd-arrow-background-color)",
      }}
    >
      <Button
        className={
          "!w-10 flex !flex-shrink-0 !p-0 !min-w-[unset] justify-center items-center !h-8 hover:bg-[#f6f1c1] !rounded-none " +
          (isMarkActiveAcrossSelection(editor, "link")
            ? "bg-[#fffcdb]"
            : " bg-[#f6f1c1]")
        }
        onClick={() => {
          if (!getTopmostElement(editor)) return;
          toggleFormat(editor, "link");
          if (!window.localStorage.getItem("finished_link_tutorial")) {
            setShowIconTutorial(true);
            setTimeout(() => {
              setShowIconTutorial(false);
            }, 2500);
          }
        }}
      >
        <RiLinkUnlinkM />
      </Button>
    </Popover>
  );
}

export const getTopmostElement = (editor: Editor) => {
  const { selection } = editor;

  if (!selection) {
    return null;
  }

  const [start, end] = Range.edges(selection);

  // Find the common ancestor path
  const commonAncestorPath = Path.common(start.path, end.path);

  // Get the node at the common ancestor path
  const topmostElement = Node.get(editor, commonAncestorPath);

  return topmostElement;
};

interface ToolbarProps {
  readonly?: boolean;
  setReadonly?: (readonly: boolean) => void;
}
export default function Toolbar(props: ToolbarProps) {
  const editor = useSlate();
  const { toolbars } = useSlateConfig();
  const { isTabletScreen, isMobileScreen } = useScreenSize();

  return (
    <div
      className={
        "flex flex-wrap divide-x-1 gap-0 divide-gray-300 bg-primary sticky z-20 " +
        (isTabletScreen
          ? "top-[220px]"
          : isMobileScreen
          ? "top-[80px]"
          : "top-[150px]")
      }
    >
      {!props.readonly &&
        tools.map((group, i) => (
          <div key={i} className="flex gap-0 h-8 flex-wrap">
            <div className="mr-0"></div>
            {group.map((tool) => (
              <Button
                key={tool.id}
                className={
                  "!w-10 flex flex-shrink-0 p-0 min-w-[unset] justify-center items-center h-8 hover:bg-[#f6f1c1] rounded-none " +
                  (activeTools.includes(tool.id) &&
                  (isMarkActiveAcrossSelection(editor, tool.id) ||
                    isBlockActive(editor, tool.id))
                    ? "bg-[#fffcdb]"
                    : " bg-[#f6f1c1]")
                }
                onClick={() => {
                  if (!getTopmostElement(editor)) return;
                  toggleFormat(editor, tool.id);
                }}
                isDisabled={toolbars?.[tool.id]?.disabled}
              >
                {tool.icon}
              </Button>
            ))}
          </div>
        ))}
      <div className="flex flex-1 flex-wrap gap-0 h-8">
        {!props.readonly && (
          <>
            <LinkTool />
            {/* <SlateColorPopover
          icon={<MdFormatColorText />}
          onApply={(color: string) => applyTextColor(editor, color)}
        />
        <SlateColorPopover
          icon={<IoMdColorFill />}
          onApply={(color: string) => applyBackgroundColor(editor, color)}
        /> */}
            <SlateColorGroup
              applyTextColor={applyTextColor}
              applyBackgroundColor={applyBackgroundColor}
              editor={editor}
            />
            <FontSize />
          </>
        )}
        <div className="flex-1"></div>
        <label
          htmlFor="1"
          className="flex cursor-pointer items-center justify-end gap-2 px-2"
        >
          <Checkbox
            onChange={(checked: boolean) => {
              // console.log(
              //   "slateEditorRef.current?.getValue(); - ",
              //   slateEditorRef.current?.getValue()
              // );
              props.setReadonly?.(checked);
            }}
            defaultValue={false}
            id="1"
            style={{ zoom: 0.74 }}
          />
          <span className="text-[12px]">Preview Mode</span>
        </label>
      </div>
    </div>
  );
}
