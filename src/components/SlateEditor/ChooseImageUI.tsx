import { Input, Tabs, TabsProps } from "antd";
import { useMemo, useRef, useState } from "react";
import { BsUpload } from "react-icons/bs";
import { CiImageOn } from "react-icons/ci";
import { Editor, Element, Range, Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { CustomElement } from "../../../types/slate";
import { handleUpload } from "@/lib/firebase/upload";
import { Button } from "@nextui-org/button";
import { Progress } from "@nextui-org/progress";

function UploadUI({ element }: { element: any }) {
  const editor = useSlate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, setIsPending] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target?.files) return;
    const file = e.target?.files[0];
    handleUpload(file, {
      setIsPending,
      setProgress,
      handleComplete: (url: string) => {
        insertImage(editor, element, url);
      },
    });
  };

  return (
    <div className="w-full">
      <Progress
        size="sm"
        value={progress}
        color="success"
        className="max-w-full"
        style={{ opacity: progress === 0 ? 0 : 1 }}
      />
      <div className="w-full py-6 flex flex-col items-center justify-center border-dashed border-2">
        <CiImageOn className="text-4xl text-gray-400" />
        <p className="text-gray-500">Drag to upload an image</p>
        <div className="flex items-center gap-2 justify-center my-2 mb-3 text-gray-300">
          <span>-----</span>
          <span>or</span>
          <span>-----</span>
        </div>
        <Button
          className="cursor-pointer px-5"
          isLoading={isPending}
          isDisabled={isPending}
        >
          <label className="cursor-pointer w-full flex relative items-center justify-center py-2rounded-lg gap-4">
            <input
              type="file"
              hidden
              className="absolute top-0 left-0 w-full h-full"
              onChange={handleImageChange}
            />
            <BsUpload />
            <span>Choose a file</span>
          </label>
        </Button>
      </div>
    </div>
  );
}

function ImageURLUI({ element }: { element: any }) {
  const editor = useSlate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, setIsPending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleEmbedClick = async () => {
    const urlInput = inputRef.current;
    if (!urlInput) {
      return;
    }
    setIsPending(true);
    setError(null);
    // insertImage(editor, element, inputRef.current?.value ?? "");
    const response = await fetch(
      `/api/fetch-image?imageUrl=${encodeURIComponent(
        urlInput.value
      )}&original=true`
    );

    if (response.status !== 200) {
      setIsPending(false);
      setError("Invalid image URL");
      return;
    }

    const blob = await response.blob();
    const filename = `image_${Date.now()}.${blob.type.split("/")[1]}`;
    const file = new File([blob], filename, {
      type: blob.type,
    });

    handleUpload(file, {
      setIsPending,
      setProgress,
      handleComplete: (url: string) => {
        insertImage(editor, element, url);
      },
    });
  };

  return (
    <div className="w-full">
      <Progress
        size="sm"
        value={progress}
        color="success"
        className="max-w-full"
        style={{ opacity: progress === 0 ? 0 : 1 }}
      />
      <div className="w-full flex items-center gap-3">
        <input
          type="text"
          placeholder="Enter image URL"
          className="py-2 px-5 rounded-lg border-gray-300 bg-gray-100 flex-1"
          ref={inputRef}
          disabled={isPending}
          onChange={() => {
            setError(null);
          }}
        />
        <Button
          variant="flat"
          className="py-2 px-6 rounded-lg bg-appBlue text-gray-100"
          onClick={handleEmbedClick}
          isLoading={isPending}
          isDisabled={isPending}
        >
          Embed
        </Button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function insertImage(editor: Editor, element: Element, url: string) {
  const path = ReactEditor.findPath(editor, element);
  // Adjust the path to point to the root
  const rootPath = path;

  // Replace the current element with the custom element
  let customElement: CustomElement = {
    type: "image-block",
    src: url,
    children: [{ text: "" }], // Make sure to add children, as Slate expects all nodes to have children
  };

  Transforms.removeNodes(editor, { at: rootPath });

  Transforms.insertNodes(editor, customElement, { at: rootPath });

  // Hide the dropdown menu
  editor.hideDropdownMenu();
}

export default function ChooseImageUI({
  attributes,
  element,
  children,
}: {
  attributes: any;
  element: any;
  children: any;
}) {
  const items: TabsProps["items"] = useMemo(() => {
    return [
      {
        key: "1",
        label: "Upload",
        children: <UploadUI element={element} />,
      },
      {
        key: "2",
        label: "Image URL",
        children: <ImageURLUI element={element} />,
      },
    ];
  }, [element]);

  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <div>
      <Tabs
        defaultActiveKey="1"
        size={"large"}
        items={items}
        onChange={onChange}
      />
    </div>
  );
}
