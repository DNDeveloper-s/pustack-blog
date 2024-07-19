import { Button } from "@nextui-org/button";
import { Checkbox, Input, Popover } from "antd";
import { useState } from "react";
import { Editor, Path, Transforms } from "slate";
import { ReactEditor, useReadOnly, useSlate } from "slate-react";

export const applyLink = (
  editor: Editor,
  url: string,
  newTab: boolean = true
) => {
  if (!url) return;

  Editor.addMark(editor, "link", url);
  Editor.addMark(editor, "color", "blue");
  Editor.addMark(editor, "underline", true);
  if (newTab !== undefined) {
    Editor.addMark(editor, "new_tab", Boolean(newTab));
  }
};

export default function LinkUrlComponent({
  children,
  leaf,
  text,
}: {
  children: any;
  leaf: any;
  text: any;
}) {
  const readonly = useReadOnly();
  const [showPopover, setShowPopover] = useState(false);
  const [url, setUrl] = useState(leaf.link || "");
  const [newTab, setNewTab] = useState(leaf.new_tab || false);
  const editor = useSlate();

  const handleApplyLink = () => {
    const path = ReactEditor.findPath(editor, text);
    Transforms.select(editor, Editor.range(editor, path));
    applyLink(editor, url, newTab);
    setShowPopover(false);
    window.localStorage.setItem("finished_link_tutorial", "true");
  };

  if (readonly) {
    return (
      <a
        style={{ display: "inline" }}
        href={leaf.link ?? "#"}
        target={leaf.new_tab ? "_blank" : "_self"}
      >
        {children}
      </a>
    );
  }

  return (
    <Popover
      content={
        <div className="max-w-[90vw] w-[350px]">
          <Input
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
            }}
          />
          <div className="flex justify-end">
            <Checkbox
              className="mt-2"
              checked={newTab}
              onChange={(e) => setNewTab(e.target.checked)}
            >
              <span>Open in a new tab</span>
            </Checkbox>
          </div>
          <Button
            size="sm"
            className="mt-2 w-full py-1.5 bg-appBlue text-white font-featureRegular"
            onClick={handleApplyLink}
          >
            Apply
          </Button>
        </div>
      }
      open={showPopover}
      onOpenChange={(open) => setShowPopover(open)}
      title="Change Link URL"
      trigger="hover"
      placement={"bottomLeft"}
      overlayClassName="overlayClassName_icon_list"
      overlayInnerStyle={{
        background: "var(--antd-arrow-background-color)",
      }}
    >
      <a
        style={{ display: "inline" }}
        href={leaf.link ?? "#"}
        target={leaf.new_tab ? "_blank" : "_self"}
      >
        {children}
      </a>
    </Popover>
  );
}
