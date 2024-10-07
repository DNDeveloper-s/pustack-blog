import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { ReactEditor, useSlate } from "slate-react";
import { CustomElement, ParagraphElement } from "../../../types/slate";
import { Path, Range, Text, Transforms } from "slate";
import { Editor } from "slate";
import { TbMath } from "react-icons/tb";
import {
  LuCode2,
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
  LuHeading6,
  LuQuote,
} from "react-icons/lu";
import { IoGridOutline, IoImageOutline } from "react-icons/io5";
import { CiViewTable } from "react-icons/ci";
import { RxSection } from "react-icons/rx";
import { MdOutlineOndemandVideo, MdOutlineViewCarousel } from "react-icons/md";
import { hasNextPath } from "./utils/helpers";
import { useSlateConfig } from "@/context/SlateContext";

const DividerIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.5}
    className="tabler-icon tabler-icon-separator block"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M3 12v.01M7 12h10M21 12v.01" />
  </svg>
);

interface OptionItem {
  id: string;
  label: string;
  isMathBlock?: boolean;
  isMath?: boolean;
  isCode?: boolean;
  isImage?: boolean;
  isImageCaraousel?: boolean;
  isDivider?: boolean;
  isGrid?: boolean;
  isTable?: boolean;
  isSectionHeader?: boolean;
  isEmbedVideo?: boolean;
  isHeadingOne?: boolean;
  isHeadingTwo?: boolean;
  isHeadingThree?: boolean;
  isHeadingFour?: boolean;
  isHeadingFive?: boolean;
  isHeadingSix?: boolean;
  isBlockQuote?: boolean;
  icon: ReactNode;
}

export type DropdownItemType =
  | "grid"
  | "math-block"
  | "math-formula"
  | "code-snippet"
  | "image"
  | "image-carousel"
  | "divider"
  | "table"
  | "section-header"
  | "embed-video"
  | "heading-one"
  | "heading-two"
  | "heading-three"
  | "heading-four"
  | "heading-five"
  | "heading-six"
  | "block-quote";

const _options: OptionItem[] = [
  {
    id: "grid",
    label: "Grid",
    isGrid: true,
    icon: <IoGridOutline />,
  },
  {
    id: "math-block",
    label: "Math Block",
    isMathBlock: true,
    icon: <TbMath />,
  },
  { id: "math-formula", label: "Math Formula", isMath: true, icon: <TbMath /> },
  {
    id: "code-snippet",
    label: "Code Snippet",
    isCode: true,
    icon: <LuCode2 />,
  },
  {
    id: "image",
    label: "Image",
    isImage: true,
    icon: <IoImageOutline />,
  },
  {
    id: "image-carousel",
    label: "Image Carousel",
    isImageCaraousel: true,
    icon: <MdOutlineViewCarousel />,
  },
  { id: "divider", label: "Divider", isDivider: true, icon: <DividerIcon /> },
  { id: "table", label: "Table", isTable: true, icon: <CiViewTable /> },
  {
    id: "section-header",
    label: "Section Header",
    isSectionHeader: true,
    icon: <RxSection />,
  },
  {
    id: "embed-video",
    label: "Embed Youtube Video",
    isEmbedVideo: true,
    icon: <MdOutlineOndemandVideo />,
  },
  {
    id: "heading-one",
    label: "Heading One",
    isHeadingOne: true,
    icon: <LuHeading1 />,
  },
  {
    id: "heading-two",
    label: "Heading Two",
    isHeadingTwo: true,
    icon: <LuHeading2 />,
  },
  {
    id: "heading-three",
    label: "Heading Three",
    isHeadingThree: true,
    icon: <LuHeading3 />,
  },
  {
    id: "heading-four",
    label: "Heading Four",
    isHeadingFour: true,
    icon: <LuHeading4 />,
  },
  {
    id: "heading-five",
    label: "Heading Five",
    isHeadingFive: true,
    icon: <LuHeading5 />,
  },
  {
    id: "heading-six",
    label: "Heading Six",
    isHeadingSix: true,
    icon: <LuHeading6 />,
  },
  {
    id: "block-quote",
    label: "Block Quote",
    isBlockQuote: true,
    icon: <LuQuote />,
  },
];

// const options = [
//   "Math Formula",
//   "Code Snippet",
//   "Image",
//   "Horizontal Line",
//   "Table",
//   "Section Header",
//   "Embed Video",
// ];

export const defaultElement: ParagraphElement = {
  type: "paragraph",
  children: [{ text: "" }],
};

const DropdownMenu = () => {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const [show, setShow] = useState(true);
  const activeRef = useRef<HTMLDivElement | null>(null);
  const [filteredOptions, setFilteredOptions] = useState<OptionItem[]>([]);
  // const dropdownRef = useRef();
  const editor = useSlate();
  const { dropdowns } = useSlateConfig();

  const options = useMemo(() => {
    if (dropdowns?.enabledItems) {
      return _options.filter((option) =>
        dropdowns?.enabledItems?.includes(option.id as DropdownItemType)
      );
    }
    return _options;
  }, [dropdowns]);

  useEffect(() => {
    if (options) setFilteredOptions(options);
  }, [options]);

  useEffect(() => {
    if (!show) return;
    function handleMouseDown(e: MouseEvent) {
      console.log("handleMouseDOwn - ");
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as HTMLElement)
      ) {
        // Editor.removeMark(editor, "dropdown");
        setShow(false);
        Transforms.deselect(editor);
        ReactEditor.deselect(editor);
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      const [node] = Array.from(
        Editor.nodes(editor, {
          //@ts-ignore
          match: (n) => Text.isText(n) && n.dropdown === true,
          at: [],
          mode: "all",
        })
      );

      const [textNode] = node;

      setFilteredOptions(
        options.filter((option) =>
          option.label
            .toLowerCase()
            // @ts-ignore
            .includes(textNode.text.slice(1).toLowerCase())
        )
      );
    }

    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [show]);

  useEffect(() => {
    if (filteredOptions) {
      setActive((c) => {
        if (c >= filteredOptions.length) return 0;
        return c;
      });
    }
  }, [filteredOptions]);

  const onSelectOption = (option: OptionItem) => {
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection);
      const { path } = start;
      // Adjust the path to point to the root
      const rootPath = [path[0]];
      let shouldFocus = false;
      let shouldFocusNext = false;

      // Check if the current selection is inside a table cell
      const tableCellNode = Editor.above(editor, {
        // @ts-ignore
        match: (n) => n.type === "table-cell",
      });

      const gridItemNode = Editor.above(editor, {
        // @ts-ignore
        match: (n) => n.type === "grid-item",
      });

      // Replace the current element with the custom element
      let customElement: CustomElement = {
        type: "paragraph",
        children: [{ text: "" }], // Make sure to add children, as Slate expects all nodes to have children
      };

      if (option.isGrid) {
        customElement = {
          type: "grid-container",
          children: Array.from({ length: 4 }, () => ({
            type: "grid-item",
            children: [
              {
                type: "paragraph",
                children: [],
              },
            ],
          })),
        };
      } else if (option.isMathBlock) {
        customElement = {
          type: "math-block-container",
          align: "left",
          children: [
            {
              type: "math-block",
              latex: "",
              isInnerLevel: true,
              children: [{ text: "" }],
            },
          ], // Make sure to add children, as Slate expects all nodes to have children
        };
      } else if (option.isMath) {
        customElement = {
          type: "math-block",
          latex: "",
          isInnerLevel: false,
          children: [{ text: "" }], // Make sure to add children, as Slate expects all nodes to have children
        };
      } else if (option.isCode) {
        customElement = {
          type: "code-block",
          code: "",
          language: "javascript",
          children: [{ text: "" }], // Make sure to add children, as Slate expects all nodes to have children
        };
      } else if (option.isImage) {
        customElement = {
          type: "choose-image-ui",
          children: [{ text: "" }], // Make sure to add children, as Slate expects all nodes to have children
        };
      } else if (option.isImageCaraousel) {
        customElement = {
          type: "image-carousel",
          images: [],
          children: [{ text: "" }], // Make sure to add children, as Slate expects all nodes to have children
        };
      } else if (option.isDivider) {
        shouldFocusNext = true;
        customElement = {
          type: "horizontal-line",
          children: [{ text: "" }],
        };
      } else if (option.isSectionHeader) {
        customElement = {
          type: "section-header",
          title: "",
          id: Date.now().toString(),
          icon: "https://minerva.news/assets/images/furtherreading.png",
          children: [{ text: "" }],
        };
      } else if (option.isEmbedVideo) {
        customElement = {
          type: "enter-embed-video-url-ui",
          children: [{ text: "" }],
        };
      } else if (option.isTable) {
        customElement = {
          type: "table",
          children: Array.from({ length: 2 }, () => ({
            type: "table-row",
            children: Array.from({ length: 2 }, () => ({
              type: "table-cell",
              children: [{ text: "" }],
            })),
          })),
        };
      } else if (option.isHeadingOne) {
        shouldFocus = true;
        customElement = {
          type: "heading-one",
          children: [{ text: "" }],
        };
      } else if (option.isHeadingTwo) {
        shouldFocus = true;
        customElement = {
          type: "heading-two",
          children: [{ text: "" }],
        };
      } else if (option.isHeadingThree) {
        shouldFocus = true;
        customElement = {
          type: "heading-three",
          children: [{ text: "" }],
        };
      } else if (option.isHeadingFour) {
        shouldFocus = true;
        customElement = {
          type: "heading-four",
          children: [{ text: "" }],
        };
      } else if (option.isHeadingFive) {
        shouldFocus = true;
        customElement = {
          type: "heading-five",
          children: [{ text: "" }],
        };
      } else if (option.isHeadingSix) {
        shouldFocus = true;
        customElement = {
          type: "heading-six",
          children: [{ text: "" }],
        };
      } else if (option.isBlockQuote) {
        shouldFocus = true;
        customElement = {
          type: "block-quote",
          children: [{ text: "" }],
        };
      }

      const cursorPath = Editor.path(editor, selection.anchor);

      Transforms.deselect(editor);

      if (tableCellNode || gridItemNode) {
        // If inside a table cell, insert custom component into the table cell
        const cellPath = tableCellNode
          ? tableCellNode[1]
          : gridItemNode
          ? gridItemNode[1]
          : null; // The path to the current table cell

        if (cellPath) {
          Transforms.removeNodes(editor, {
            at: [...cellPath, cursorPath.at(-2) ?? 0],
          });
          Transforms.insertNodes(editor, customElement, {
            at: [...cellPath, cursorPath.at(-2) ?? 0],
          });
        }
      } else {
        // Default behavior, replace the root node
        const rootPath = [path[0]];
        Transforms.removeNodes(editor, { at: rootPath });
        Transforms.insertNodes(editor, customElement, { at: rootPath });
        if (!hasNextPath(editor, rootPath)) {
          Transforms.insertNodes(editor, defaultElement, {
            at: Path.next(rootPath),
          });
        }

        if (shouldFocus) {
          Transforms.select(editor, Editor.end(editor, rootPath));
        }
        if (shouldFocusNext && hasNextPath(editor, rootPath)) {
          Transforms.select(editor, Editor.start(editor, Path.next(rootPath)));
        }
      }

      // Transforms.removeNodes(editor, { at: rootPath });
      // Transforms.insertNodes(editor, customElement, { at: rootPath });
      // if (!hasNextPath(editor, rootPath)) {
      //   Transforms.insertNodes(editor, defaultElement, {
      //     at: Path.next(rootPath),
      //   });
      // }

      // if (shouldFocus) {
      //   Transforms.select(editor, Editor.end(editor, rootPath));
      // }
      // if (shouldFocusNext && hasNextPath(editor, rootPath)) {
      //   Transforms.select(editor, Editor.start(editor, Path.next(rootPath)));
      // }

      // Move the cursor to the newly created element
      // const newPath = [...rootPath, 0];
      // const point = Editor.end(editor, newPath);
      // Transforms.select(editor, point);

      // Hide the dropdown menu
      editor.hideDropdownMenu();
    }
  };

  useEffect(() => {
    if (!show) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();

        setActive((prev) => {
          if (e.key === "ArrowDown") {
            if (prev === filteredOptions.length - 1) return 0;
            return prev + 1;
          } else {
            if (prev === 0) return filteredOptions.length - 1;
            return prev - 1;
          }
        });
      }

      if (e.key === "Enter") {
        e.preventDefault();
        onSelectOption(filteredOptions[active]);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [filteredOptions, show, active]);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        block: "nearest",
        inline: "start",
      });
    }
  }, [active]);

  return !show ? null : (
    <span
      ref={containerRef}
      style={{
        zIndex: 1000,
      }}
      className="absolute shadow-2xl left-0 top-6 z-10 block max-h-64 max-w-56 w-[90vw] select-none overflow-y-auto rounded-md bg-base-100 bg-white p-2 overflow-auto"
    >
      {filteredOptions.map((item, index) => (
        <div
          key={item.id}
          onMouseEnter={() => setActive(index)}
          contentEditable={false}
          className={`p-2 cursor-pointer rounded text-base gap-2 grid justify-items-center grid-cols-[22px_1fr] items-center ${
            active === index ? "bg-gray-100" : ""
          }`}
          onClick={() => onSelectOption(item)}
          ref={(ref) => {
            if (active === index) {
              activeRef.current = ref;
            }
          }}
        >
          {item.icon}
          <div className="w-full">
            <span className="font-featureHeadline text-slate-600">
              {item.label}
            </span>
          </div>
        </div>
      ))}
      {filteredOptions.length === 0 && <div>No results found</div>}
    </span>
  );
};

export default DropdownMenu;

export function StaticDropdownMenu() {
  const dropdownRef = useRef<HTMLSpanElement>(null);
  const editor = useSlate();
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!show) return;
    function handleMouseDown(e: MouseEvent) {
      console.log("handleMouseDOwn - ");
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as HTMLElement)
      ) {
        // Editor.removeMark(editor, "dropdown");
        setShow(false);
        Transforms.deselect(editor);
        ReactEditor.deselect(editor);
      }
    }

    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [show]);

  function handleClickOnItem() {
    const nodes = Array.from(
      Editor.nodes(editor, {
        //@ts-ignore
        match: (n) => Text.isText(n) && n.dropdown === true,
        at: [],
        mode: "all",
      })
    );
  }

  return !show ? null : (
    <span ref={dropdownRef} className="absolute top-full left-0">
      <p onClick={handleClickOnItem}>Nice one</p>
      <p>Thanks to one</p>
    </span>
  );
}
