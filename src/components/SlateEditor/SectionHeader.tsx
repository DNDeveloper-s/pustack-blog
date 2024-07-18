import { Popover } from "antd";
import { BiCaretDown } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import { IconExplorer } from "../AdminEditor/Sections/SectionEditor";
import { FaCaretDown } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import { Transforms } from "slate";
import { ReactEditor, useReadOnly, useSlate } from "slate-react";

export default function SectionHeader({ element }: { element: any }) {
  const [open, setOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(element.icon);
  const editor = useSlate();
  const titleInputRef = useRef<HTMLInputElement>(null);
  const readonly = useReadOnly();

  useEffect(() => {
    if (element.title && titleInputRef.current) {
      titleInputRef.current!.value = element.title;
    }
    if (element.icon) {
      setSelectedIcon(element.icon);
    }
  }, [element.title, element.icon]);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  const handleIconClick = (icon: string) => {
    setSelectedIcon(icon);
    Transforms.setNodes(
      editor,
      { icon },
      { at: ReactEditor.findPath(editor, element) }
    );
    setOpen(false);
  };

  if (readonly) {
    return (
      <div>
        <div className="styles_divider"></div>
        <div className="styles_title" id={element.id}>
          <p>
            <span className="inline-flex mr-2">
              <img
                style={{ height: "16px", width: "auto", display: "inline" }}
                src={element.icon}
                alt="Icon"
              />
            </span>
            {element.title}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <hr className="border border-dashed border-gray-[#1f1f1a1d] w-full my-3" />
      <div className="w-full flex ">
        {/* <div className="py-2 px-4 flex items-center gap-2 justify-center rounded-lg text-lg bg-gray-100">
          <MdEdit />
          <BiCaretDown className="text-gray-400" />
        </div> */}
        <Popover
          content={
            <IconExplorer
              defaultIcon={element.icon}
              onIconClick={handleIconClick}
            />
          }
          title="Choose Icon"
          trigger="click"
          open={open}
          onOpenChange={handleOpenChange}
          placement={"bottomLeft"}
          overlayClassName="overlayClassName_icon_list"
          overlayInnerStyle={{
            background: "var(--antd-arrow-background-color)",
          }}
        >
          <div
            className="border cursor-pointer border-r-0 pl-2 pr-1 border-[1px_solid_#e5e7eb] h-[34px] bg-lightPrimary flex items-center justify-center gap-1"
            style={{
              borderInlineEnd: 0,
            }}
          >
            <span>
              <img
                className="w-[16px] h-auto max-h-[16px]"
                src={selectedIcon}
                alt="Notable Image"
              />
            </span>
            <span>
              <FaCaretDown />
            </span>
          </div>
        </Popover>
        <div className="flex-1">
          <input
            // disabled={isPending}
            className="border text-[16px] w-full flex-shrink py-1 h-[34px] px-2 border-[1px_solid_#e5e7eb] bg-lightPrimary focus:outline-appBlack focus:outline-offset-[-2]"
            placeholder="Enter the Section Title"
            type="text"
            style={{
              fontVariationSettings: '"wght" 400,"opsz" 10',
            }}
            onBlur={(e) => {
              const titleVal = titleInputRef.current?.value;
              Transforms.setNodes(
                editor,
                { title: titleVal },
                { at: ReactEditor.findPath(editor, element) }
              );
            }}
            ref={titleInputRef}
            // onChange={(e) => section.updateTitle(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
