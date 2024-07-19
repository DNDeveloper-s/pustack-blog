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
import { Editor, Element, Text, Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import SlateColorPopover from "./SlateColorPicker";
import { MdFormatColorText } from "react-icons/md";
import { IoMdColorFill } from "react-icons/io";
import { applyLink } from "./LinkUrlComponent";
import FontSize from "./FontSize";
import { Popover } from "antd";
import { useEffect, useState } from "react";

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

type Tool = {
  id: ToolType;
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
  ],
  [
    {
      id: "strike-through",
      label: "Strike Through",
      icon: <FaStrikethrough />,
    },
  ],
  [
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
  ],
  [
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
        n.type === "heading" ||
        n.type === "heading-two" ||
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
  Editor.addMark(editor, "color", color);
};

const applyBackgroundColor = (editor: Editor, color: string) => {
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

interface ToolbarProps {}
export default function Toolbar(props: ToolbarProps) {
  const editor = useSlate();

  return (
    <div className="flex flex-wrap divide-x-1 gap-0 divide-gray-300 bg-primary sticky top-0 z-20">
      {tools.map((group, i) => (
        <div key={i} className="flex gap-0">
          <div className="mr-0"></div>
          {group.map((tool) => (
            <Button
              key={tool.id}
              className={
                "w-10 flex flex-shrink-0 p-0 min-w-[unset] justify-center items-center h-8 hover:bg-[#f6f1c1] rounded-none " +
                (activeTools.includes(tool.id) &&
                (isMarkActiveAcrossSelection(editor, tool.id) ||
                  isBlockActive(editor, tool.id))
                  ? "bg-[#fffcdb]"
                  : " bg-[#f6f1c1]")
              }
              onClick={() => {
                toggleFormat(editor, tool.id);
              }}
            >
              {tool.icon}
            </Button>
          ))}
        </div>
      ))}
      <div className="flex flex-wrap gap-0">
        <LinkTool />
        <SlateColorPopover
          icon={<MdFormatColorText />}
          onApply={(color: string) => applyTextColor(editor, color)}
        />
        <SlateColorPopover
          icon={<IoMdColorFill />}
          onApply={(color: string) => applyBackgroundColor(editor, color)}
        />
        <FontSize />
      </div>
    </div>
  );
}
