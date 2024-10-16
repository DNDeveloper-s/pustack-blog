import { Button } from "@nextui-org/button";
import { Popover } from "antd";
import { useEffect, useMemo, useState } from "react";
import { FaCaretDown } from "react-icons/fa6";
import { useSlate } from "slate-react";
import { getTopmostElement, isMarkActiveAcrossSelection } from "./Toolbar";
import { Editor, Text, Transforms } from "slate";
import { useSlateConfig } from "@/context/SlateContext";

const fontSizes = [
  "8px",
  "10px",
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "22px",
  "24px",
  "26px",
  "28px",
  "30px",
  "32px",
  "34px",
  "36px",
  "38px",
  "40px",
  "42px",
  "44px",
  "46px",
  "48px",
  "50px",
  "52px",
  "54px",
  "56px",
  "58px",
  "60px",
  "62px",
  "64px",
  "66px",
  "68px",
  "70px",
  "72px",
  "74px",
  "76px",
  "78px",
  "80px",
  "82px",
  "84px",
  "86px",
  "88px",
  "90px",
  "92px",
  "94px",
  "96px",
  "98px",
  "100px",
];

function parseFontSize(size: string): number {
  return parseInt(size.replace("px", ""));
}

function isValidFontSize(size?: string): boolean {
  if (!size) return false;
  return !isNaN(parseFontSize(size));
}

function isSizeDisabled(
  size: string,
  disabledSizes?: number[] | { min: number; max: number }
) {
  if (!disabledSizes) return false;
  if (Array.isArray(disabledSizes)) {
    return disabledSizes.includes(parseFontSize(size));
  }

  const fontSize = parseFontSize(size);
  return fontSize < disabledSizes.min || fontSize > disabledSizes.max;
}

function FontSizePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { fontSize } = useSlateConfig();

  const enabledFontSizes = useMemo(() => {
    if (!fontSize?.shouldHideDisabled) return fontSizes;
    return fontSizes.filter(
      (size) => !isSizeDisabled(size, fontSize?.disabledSizes)
    );
  }, [fontSize]);

  return (
    <div className="max-h-[300px] overflow-y-scroll pr-[8px]">
      {enabledFontSizes.map((size) => (
        <Button
          key={size}
          onClick={() => onChange(size)}
          isDisabled={isSizeDisabled(size, fontSize?.disabledSizes)}
          className={
            "h-8 w-full min-w-[unset] p-0 px-2 flex-shrink-0 flex items-center justify-start  rounded-none hover:bg-primary active:bg-primary " +
            (value === size ? "bg-primary" : " bg-transparent")
          }
        >
          {size}
        </Button>
      ))}
    </div>
  );
}

export const getFontSizeInSelection = (
  editor: Editor,
  defaultSize: string = "16px"
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [start, end] = Editor.edges(editor, selection);
  let isActive = true;

  const nodes = Array.from(
    Editor.nodes(editor, {
      at: { anchor: start, focus: end },
      match: (n) => Text.isText(n),
      mode: "all",
    })
  );

  if (nodes.length === 0 || nodes.length > 1) return false;

  const [node] = nodes;
  const [leafNode] = node;

  // @ts-ignore
  return leafNode?.fontSize ?? defaultSize;
};

export default function FontSize() {
  const { fontSize: fontSizeConfig } = useSlateConfig();
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState(
    fontSizeConfig?.defaultFontSize ?? "16px"
  );
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };
  const editor = useSlate();

  useEffect(() => {
    setFontSize(
      getFontSizeInSelection(editor, fontSizeConfig?.defaultFontSize)
    );
  }, [editor, editor.selection, fontSizeConfig?.defaultFontSize]);

  function handleChangeSize(size: string) {
    if (!getTopmostElement(editor)) return;
    Transforms.setNodes(
      editor,
      // @ts-ignore
      { fontSize: size },
      { match: Text.isText, split: true }
    );
    setFontSize(size as any);
    setOpen(false);
  }

  return (
    <Popover
      content={<FontSizePicker value={fontSize} onChange={handleChangeSize} />}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
      placement={"bottomRight"}
      overlayClassName="overlayClassName_icon_list fontSize_overlayClassName"
      overlayInnerStyle={{
        background: "var(--antd-arrow-background-color)",
      }}
    >
      <Button className="px-2 py-0 flex flex-shrink-0 min-w-[unset] justify-center items-center bg-[#f6f1c1] h-8 rounded-none text-sm gap-2">
        <span className="min-w-[14px]">{fontSize}</span>
        <FaCaretDown />
      </Button>
    </Popover>
  );
}
