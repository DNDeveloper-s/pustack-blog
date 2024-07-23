import { Button } from "@nextui-org/button";
import { Input, Popover } from "antd";
import { ReactNode, useState } from "react";
import { RgbaStringColorPicker } from "react-colorful";
import { IoMdColorFill } from "react-icons/io";
import { IconType } from "react-icons/lib";
import { MdFormatColorText } from "react-icons/md";
import { Editor } from "slate";

function hexToRgbA(hex: string) {
  let c: any;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    return (
      "rgba(" + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") + ",1)"
    );
  }
  return hex;
}

export function SlateColorPicker({
  onApply,
}: {
  onApply?: (color: string) => void;
}) {
  const [color, setColor] = useState("#ff5e4c");
  return (
    <div>
      <RgbaStringColorPicker color={hexToRgbA(color)} onChange={setColor} />
      <div className="my-2">
        <Input value={color} onChange={(e) => setColor(e.target.value)} />
      </div>
      <div>
        <Button
          size="sm"
          className="w-full py-1.5 bg-appBlue text-white font-featureRegular"
          onClick={() => {
            onApply?.(color);
            // toggleFormat(editor, tool.id);
          }}
        >
          Apply
        </Button>
      </div>
    </div>
  );
}

interface SlateColorPopoverProps {
  icon: ReactNode;
  onApply?: (color: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function SlateColorPopover({
  icon,
  onApply,
  open: _open,
  onOpenChange,
}: SlateColorPopoverProps) {
  const [open, setOpen] = useState(false);
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };
  return (
    <Popover
      content={
        <SlateColorPicker
          onApply={(color: string) => {
            onApply?.(color);
            onOpenChange ? onOpenChange(false) : setOpen(false);
          }}
        />
      }
      title="Pick a color"
      trigger="click"
      open={_open ?? open}
      onOpenChange={onOpenChange ?? handleOpenChange}
      placement={"bottomLeft"}
      overlayClassName="overlayClassName_icon_list"
      overlayInnerStyle={{
        background: "var(--antd-arrow-background-color)",
      }}
    >
      <Button className="w-10 flex flex-shrink-0 p-0 min-w-[unset] justify-center items-center bg-[#f6f1c1] h-8 rounded-none">
        {icon}
      </Button>
    </Popover>
  );
}

export function SlateColorGroup({
  applyTextColor,
  applyBackgroundColor,
  editor,
}: {
  applyTextColor: (editor: Editor, color: string) => void;
  applyBackgroundColor: (editor: Editor, color: string) => void;
  editor: Editor;
}) {
  const [openTextColor, setOpenTextColor] = useState(false);
  const [openBackgroundColor, setOpenBackgroundColor] = useState(false);

  const handleOpenTextColorChange = (open: boolean) => {
    if (open) setOpenBackgroundColor(false);
    setOpenTextColor(open);
  };

  const handleOpenBackgroundColorChange = (open: boolean) => {
    if (open) setOpenTextColor(false);
    setOpenBackgroundColor(open);
  };

  return (
    <>
      <SlateColorPopover
        icon={<MdFormatColorText />}
        onApply={(color: string) => applyTextColor(editor, color)}
        open={openTextColor}
        onOpenChange={handleOpenTextColorChange}
      />
      <SlateColorPopover
        icon={<IoMdColorFill />}
        onApply={(color: string) => applyBackgroundColor(editor, color)}
        open={openBackgroundColor}
        onOpenChange={handleOpenBackgroundColorChange}
      />
    </>
  );
}
