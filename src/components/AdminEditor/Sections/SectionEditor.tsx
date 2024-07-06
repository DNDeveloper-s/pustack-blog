import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Section } from "./Section";
import Image from "next/image";
import { notableImage } from "@/assets";
import { FaCaretDown } from "react-icons/fa";
import { Button } from "@nextui-org/button";
import { MathJaxContext } from "better-react-mathjax";
import JoditEditor from "../JoditEditor";
import { Popover } from "antd";
import { debounce, divide } from "lodash";
import { useFetchNounProjectIcon } from "@/api/misc";
import { TheNounProjectIcon } from "@/app/api/the-noun-project/route";
import { ScrollableVerticalContent } from "@/components/shared/ScrollableComponent";
import { Spinner } from "@nextui-org/spinner";

function getAvailableIcons() {
  const imageNames = [
    "youtube",
    "whatsapp",
    "Twitter",
    "reddit",
    "problem",
    "network",
    "maps",
    "linkedin",
    "ladder",
    "label",
    "handshake",
    "google",
    "github",
    "function",
    "formula",
    "discussion",
    "chemical",
    "chemical-bond",
    "bulb",
    "broken-bulb",
  ];

  const imageUrls = imageNames.map((name) => {
    return `https://pustack-blog.vercel.app/assets/images/svgs/${name}.svg`;
  });

  const pngImageNames = [
    "furtherreading",
    "github",
    "google-maps",
    "google",
    "link",
    "linkedin",
    "quiz",
    "reporterstake",
    "selection",
    "social",
    "thenews",
    "viewfrom",
    "youtube",
  ];

  const pngImageUrls = pngImageNames.map((name) => {
    return `https://pustack-blog.vercel.app/assets/images/${name}.png`;
  });

  return [...imageUrls, ...pngImageUrls];
}

function IconExplorer({
  onIconClick,
  defaultIcon,
}: {
  onIconClick: (icon: string) => void;
  defaultIcon: string;
}) {
  const [queryIcon, setQueryIcon] = useState("");
  const { data, isLoading } = useFetchNounProjectIcon({
    query: queryIcon,
  });
  const [selectedIcon, setSelectedIcon] = useState(defaultIcon);
  const icons = useMemo(() => getAvailableIcons(), []);

  // Debounced function
  const debouncedFetchIconData = useCallback(
    debounce((id) => {
      setQueryIcon(id);
    }, 300), // Adjust the delay as needed (300ms in this case)
    []
  );

  // Update the iconId state and call the debounced fetch function
  const handleInputChange = (e: any) => {
    const newIconId = e.target.value;
    debouncedFetchIconData(newIconId);
  };

  return (
    <div>
      <input
        className="w-full mb-2 py-1 px-2 text-gray-600 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        type="text"
        placeholder="Search Icon"
        onChange={handleInputChange}
      />
      {isLoading && (
        <div className="w-full flex items-center justify-center py-4">
          <Spinner color="secondary" size="sm" label="Fetching icons" />
        </div>
      )}
      {!isLoading && (
        <div className="max-h-[300px] relative overflow-hidden">
          <ScrollableVerticalContent className="max-h-[300px]">
            <div className="grid grid-cols-4 justify-items-center items-center max-w-[200px] gap-2">
              {data?.icons.map((icon: TheNounProjectIcon) => {
                return (
                  <div
                    key={icon.id}
                    className="w-[23px] h-[23px] p-[3px] cursor-pointer rounded flex items-center justify-center"
                    style={{
                      backgroundColor:
                        selectedIcon === icon.thumbnail_url
                          ? "#f8f5d7"
                          : "transparent",
                    }}
                    onClick={() => {
                      onIconClick(icon.thumbnail_url);
                      setSelectedIcon(icon.thumbnail_url);
                    }}
                  >
                    <img
                      className="w-full h-full object-contain"
                      src={icon.thumbnail_url}
                      alt="Icon"
                    />
                  </div>
                );
              })}
              {!data?.icons &&
                icons.map((icon, index) => {
                  return (
                    <div
                      key={index}
                      className="w-[23px] h-[23px] p-[3px] cursor-pointer rounded flex items-center justify-center"
                      style={{
                        backgroundColor:
                          selectedIcon === icon ? "#f8f5d7" : "transparent",
                      }}
                      onClick={() => {
                        onIconClick(icon);
                        setSelectedIcon(icon);
                      }}
                    >
                      <img
                        className="w-full h-full object-contain"
                        src={icon}
                        alt="Icon"
                      />
                    </div>
                  );
                })}
            </div>
          </ScrollableVerticalContent>
        </div>
      )}
    </div>
  );
}

interface SectionEditorProps {
  section: Section;
  onDelete?: () => void;
  handleViewMode: (viewMode: boolean) => void;
}
export default function SectionEditor({
  section,
  onDelete,
  handleViewMode,
}: SectionEditorProps) {
  const currentContent = useRef("");
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(section.icon);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  useEffect(() => {
    if (!titleInputRef.current) return;
    titleInputRef.current.value = section.title;
  }, [section]);

  const handleIconClick = (icon: string) => {
    section.updateIcon(icon);
    setSelectedIcon(icon);
    hide();
  };

  const [showIconTutorial, setShowIconTutorial] = useState(false);

  useEffect(() => {
    if (open) {
      setShowIconTutorial(false);
      window.localStorage.setItem("finished_icon_tutorial", "true");
    }
  }, [open]);

  useEffect(() => {
    if (!window.localStorage.getItem("finished_icon_tutorial")) {
      setShowIconTutorial(true);
    }
  }, []);

  const [openNotValidSection, setOpenNotValidSection] = useState(false);

  const handleDoneEditting = () => {
    if (section.title === "" || section.content === "") {
      setOpenNotValidSection(true);
      return;
    }
    handleViewMode(true);
  };

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between flex-wrap gap-5 mb-3">
        <div className="flex items-center">
          <Popover
            content={
              <IconExplorer
                defaultIcon={section.icon}
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
            <Popover
              content={<p className="text-white">Choose Icon</p>}
              trigger={"hover"}
              open={showIconTutorial}
              placement="bottom"
              className="className-dnd"
              overlayClassName="overlayClassName_choose_icon_animation"
              overlayInnerStyle={{
                padding: "4px 10px",
                fontSize: "13px",
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
          </Popover>
          <div className="w-[500px]">
            <input
              // disabled={isPending}
              className="border text-[16px] w-full flex-shrink py-1 h-[34px] px-2 border-[1px_solid_#e5e7eb] bg-lightPrimary focus:outline-appBlack focus:outline-offset-[-2]"
              placeholder="Enter the Section Title"
              type="text"
              style={{
                fontVariationSettings: '"wght" 400,"opsz" 10',
              }}
              ref={titleInputRef}
              onChange={(e) => section.updateTitle(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            className="h-9 px-3 rounded bg-danger-500 text-primary text-xs font-featureRegular"
            variant="flat"
            color="primary"
            onClick={() => onDelete && onDelete()}
          >
            Delete
          </Button>
          <Popover
            content={
              <p className="text-danger-500">
                {section.title === ""
                  ? "Please fill in the title of the section"
                  : section.content === ""
                  ? "Please fill in the content of the section using the editor below"
                  : null}
              </p>
            }
            trigger={"click"}
            open={openNotValidSection}
            onOpenChange={(open) => {
              if (open) {
                if (section.title === "" || section.content === "") {
                  setOpenNotValidSection(true);
                  return;
                }
              }
              setOpenNotValidSection(false);
            }}
            placement="bottom"
            overlayClassName="overlayClassName_section_not_valid"
            overlayInnerStyle={{
              padding: "4px 10px",
              fontSize: "13px",
              background: "var(--antd-arrow-background-color)",
            }}
          >
            <Button
              className="h-9 px-3 rounded bg-appBlue text-primary text-xs font-featureRegular"
              variant="flat"
              color="primary"
              onClick={handleDoneEditting}
            >
              Done Editting
            </Button>
          </Popover>
        </div>
      </div>
      <MathJaxContext>
        <JoditEditor
          //   content={""}
          content={section.content}
          setContent={(_content) => {
            // setContent(_content);
            currentContent.current = _content;
            section.updateContent(_content);
          }}
          updateLiveContent={(content) => {
            // updateLocalStorage("content", content);
          }}
        />
      </MathJaxContext>
    </div>
  );
}
