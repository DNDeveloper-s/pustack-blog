import React, { useEffect, useRef } from "react";
import { Editor, Element, Range, Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { CustomElement } from "../../../types/slate";

export function isYoutubeVideoLink(url: string) {
  const youtubeRegex =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  return youtubeRegex.test(url);
}

function insertEmbeddedVideo(editor: Editor, element: Element, url: string) {
  const path = ReactEditor.findPath(editor, element);
  // Adjust the path to point to the root
  const rootPath = [path[0]];

  // Replace the current element with the custom element
  let customElement: CustomElement = {
    type: "embed-video",
    url,
    width: 500,
    height: 350,
    children: [{ text: "" }], // Make sure to add children, as Slate expects all nodes to have children
  };

  Transforms.removeNodes(editor, { at: rootPath });

  Transforms.insertNodes(editor, customElement, { at: rootPath });

  // Hide the dropdown menu
  editor.hideDropdownMenu();
}

export default function EnterEmbdedVideoUrlUI({
  element,
}: {
  element: Element;
}) {
  const editor = useSlate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 10);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-full">
      <div className="w-full flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Enter Youtube Video URL"
          className="max-w-full py-2 px-5 rounded-lg border-gray-300 bg-gray-100 flex-1"
          ref={inputRef}
        />
        <button
          className="py-2 px-6 rounded-lg bg-gray-500 text-gray-100"
          onClick={() => {
            if (!inputRef.current || inputRef.current.value === "") return;

            if (!isYoutubeVideoLink(inputRef.current.value)) {
              return setError("We only support YouTube videos at the moment.");
            }

            insertEmbeddedVideo(editor, element, inputRef.current.value);
          }}
        >
          Embed
        </button>
      </div>
      {error && <p className="text-xs text-danger-400 mt-1 ml-2">{error}</p>}
    </div>
  );
}
