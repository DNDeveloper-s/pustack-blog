import React, { useEffect, useRef, useState } from "react";
import { useSlate } from "slate-react";
import { CustomElement } from "../../../types/slate";
import { Range, Transforms } from "slate";

const options = [
  "Math Formula",
  "Code Snippet",
  "Image",
  "Horizontal Line",
  "Section Header",
  "Embed Video",
];

const DropdownMenu = () => {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const activeRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  // const dropdownRef = useRef();
  const editor = useSlate();

  useEffect(() => {
    const handleShowDropdownMenu = (event: any) => {
      setPosition(event.detail);
      setActive(0);
      setFilteredOptions(
        options.filter((option) =>
          option.toLowerCase().startsWith(event.detail.query?.toLowerCase?.())
        )
      );
    };

    const handleHideDropdownMenu = () => {
      setPosition(null);
      setFilteredOptions([]);
    };

    window.addEventListener("show-dropdown-menu", handleShowDropdownMenu);
    window.addEventListener("hide-dropdown-menu", handleHideDropdownMenu);

    return () => {
      window.removeEventListener("show-dropdown-menu", handleShowDropdownMenu);
      window.removeEventListener("hide-dropdown-menu", handleHideDropdownMenu);
    };
  }, [position]);

  // Handle Outside Click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as HTMLElement)
      ) {
        setPosition(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef]);

  const onSelectOption = (option: string) => {
    // Code Block
    // const { selection } = editor;
    // if (selection && Range.isCollapsed(selection)) {
    //   const [start] = Range.edges(selection);
    //   const { path } = start;
    //   // Replace the current element with the custom element
    //   const customElement = {
    //     type: "code-block",
    //     language: "javascript",
    //     children: [{ text: option }],
    //   };
    //   Transforms.removeNodes(editor, { at: path });
    //   // @ts-ignore
    //   Transforms.insertNodes(editor, customElement, { at: path });
    //   // Hide the dropdown menu
    //   editor.hideDropdownMenu();
    // }

    //Image Block
    // const { selection } = editor;
    // if (selection && Range.isCollapsed(selection)) {
    //   const [start] = Range.edges(selection);
    //   const { path } = start;
    //   // Replace the current element with the custom element
    //   const customElement = {
    //     type: "image-block",
    //     src: "https://images.pexels.com/photos/1107717/pexels-photo-1107717.jpeg?cs=srgb&dl=pexels-fotios-photos-1107717.jpg&fm=jpg",
    //     children: [{ text: "" }], // Make sure to add children, as Slate expects all nodes to have children
    //   };
    //   Transforms.removeNodes(editor, { at: path });
    //   // @ts-ignore
    //   Transforms.insertNodes(editor, customElement, { at: path });
    //   // Hide the dropdown menu
    //   editor.hideDropdownMenu();
    // }

    // Math Block
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection);
      const { path } = start;
      // Adjust the path to point to the root
      const rootPath = [path[0]];

      // Replace the current element with the custom element
      let customElement: CustomElement = {
        type: "paragraph",
        children: [{ text: "" }], // Make sure to add children, as Slate expects all nodes to have children
      };

      if (option === "Math Formula") {
        customElement = {
          type: "math-block",
          latex: "",
          children: [{ text: "" }], // Make sure to add children, as Slate expects all nodes to have children
        };
      } else if (option === "Code Snippet") {
        customElement = {
          type: "code-block",
          code: "",
          language: "javascript",
          children: [{ text: "" }], // Make sure to add children, as Slate expects all nodes to have children
        };
      } else if (option === "Image") {
        customElement = {
          type: "choose-image-ui",
          children: [{ text: "" }], // Make sure to add children, as Slate expects all nodes to have children
        };
      } else if (option === "Horizontal Line") {
        customElement = {
          type: "horizontal-line",
          children: [{ text: "" }],
        };
      } else if (option === "Section Header") {
        customElement = {
          type: "section-header",
          title: "",
          id: Date.now().toString(),
          icon: "https://pustack-blog.vercel.app/assets/images/furtherreading.png",
          children: [{ text: "" }],
        };
      } else if (option === "Embed Video") {
        customElement = {
          type: "enter-embed-video-url-ui",
          children: [{ text: "" }],
        };
      }

      Transforms.deselect(editor);

      Transforms.removeNodes(editor, { at: rootPath });
      Transforms.insertNodes(editor, customElement, { at: rootPath });

      // Move the cursor to the newly created element
      // const newPath = [...rootPath, 0];
      // const point = Editor.end(editor, newPath);
      // Transforms.select(editor, point);

      // Hide the dropdown menu
      editor.hideDropdownMenu();
    }
  };

  useEffect(() => {
    if (!position) return;
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
  }, [filteredOptions, position, active]);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        block: "nearest",
        inline: "start",
      });
    }
  }, [active]);

  if (!position) return null;

  return (
    <span
      ref={containerRef}
      style={{
        top: position.top,
        left: position.left,
        zIndex: 1000,
      }}
      className="absolute shadow-2xl left-0 top-6 z-10 block max-h-64 w-64 select-none overflow-y-auto rounded-md bg-base-100 bg-white p-2 overflow-auto"
    >
      {filteredOptions.map((item, index) => (
        <div
          key={item}
          onMouseEnter={() => setActive(index)}
          contentEditable={false}
          className={`p-2 cursor-pointer rounded ${
            active === index ? "bg-gray-100" : ""
          }`}
          onClick={() => onSelectOption(item)}
          ref={(ref) => {
            if (active === index) {
              activeRef.current = ref;
            }
          }}
        >
          {item}
        </div>
      ))}
      {filteredOptions.length === 0 && <div>No results found</div>}
    </span>
  );
};

export default DropdownMenu;
