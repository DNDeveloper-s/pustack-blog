"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Post } from "@/firebase/post";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { MathJax } from "better-react-mathjax";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { useUser } from "@/context/UserContext";
import JoditEditor from "../AdminEditor/JoditEditor";
import { useCreateSignal } from "@/api/signal";
import { Signal } from "@/firebase/signal";
import SlateEditor, { SlateEditorRef } from "../SlateEditor/SlateEditor";
import { useNotification } from "@/context/NotificationContext";
import { CustomElement } from "../../../types/slate";

const dummyAuthor = {
  name: "John Doe",
  email: "johndoe@gmail.com",
  photoURL:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwMtTVob9_kP89ahzHe8zbQLNio88s0UDBDqlDjbkpBQ&s",
};

const TOPICS = [
  { key: "", value: "Select Topic", disabled: true },
  { key: "politics", value: "Politics" },
  { key: "business", value: "Business" },
  { key: "technology", value: "Technology" },
  { key: "africa", value: "Africa" },
  { key: "net-zero", value: "Net Zero" },
  { key: "security", value: "Security" },
  { key: "media", value: "Media" },
  { key: "others", value: "Others" },
];

interface SignalJoditProps {
  preSignal?: Signal;
}
function SignalJodit(props: SignalJoditProps, ref: any) {
  const { preSignal } = props;

  // Local State
  const [error, setError] = useState<string | null>(null);
  const [slateEditorKey, setSlateEditorKey] = useState(0);

  // Third-Party hooks
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Contexts
  const { user } = useUser();
  const { openNotification } = useNotification();

  // Refs
  const slateEditorRef = useRef<SlateEditorRef>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const sourceInputRef = useRef<HTMLInputElement | null>(null);

  // Imperative Handle
  useImperativeHandle(ref, () => ({
    reset: () => {
      setSlateEditorKey((prev) => prev + 1);
      if (inputRef.current) inputRef.current.value = "";
      if (sourceInputRef.current) sourceInputRef.current.value = "";
    },
    getSlateValue: () => {
      return slateEditorRef.current?.getValue();
    },
    getSourceValue: () => sourceInputRef.current?.value ?? "",
    getTitleValue: () => inputRef.current?.value ?? "",
    isValid: (titleValue: string, sourceValue: string, silent: boolean) =>
      isValid(titleValue, sourceValue, silent),
  }));

  // Use Effects
  useEffect(() => {
    if (preSignal) {
      if (sourceInputRef.current)
        sourceInputRef.current.value = preSignal.source ?? "";
      if (inputRef.current) inputRef.current.value = preSignal.title ?? "";
    }
  }, [preSignal]);

  // Functions
  const isValid = (
    titleValue: string,
    sourceValue: string,
    silent: boolean = false
  ) => {
    const _isValid = titleValue && sourceValue;

    const field = titleValue ? (sourceValue ? null : "source") : "title";

    if (field === "title") {
      if (!silent) {
        inputRef.current?.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
        inputRef.current?.focus();
      }
      return { isValid: false, field, message: "Please enter the post title" };
    }

    if (field === "source") {
      if (!silent) {
        sourceInputRef.current?.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
        sourceInputRef.current?.focus();
      }
      return { isValid: false, field, message: "Please fill in the source" };
    }

    // slateEditorRef.current?.getValue();
    if (slateEditorRef.current?.hasSomeContent() === false) {
      return { isValid: false, field, message: "Please enter some content" };
    }

    // return { isValid: _isValid, field, message: "Please fill all fields." };
    return { isValid: true, field: "", message: "" };
  };

  const updateLocalStorage = (key: string, value: any) => {
    const getContent = localStorage.getItem("signal_editor_state") ?? "{}";
    const storageContent = JSON.parse(getContent);

    localStorage.setItem(
      "signal_editor_state",
      JSON.stringify({
        ...storageContent,
        [key]: value,
      })
    );
  };

  return (
    <div className="w-full max-w-[1100px] mx-auto py-2">
      {/* <div>
      <h2 className="text-appBlack text-[30px] mt-8 font-larkenExtraBold">
          Create Post
        </h2>
      </div> */}
      {error && <p className="text-red-500 text-sm my-2">{error}</p>}
      <div className="mt-5">
        <h4 className="text-[12px] font-helvetica uppercase ml-1 mb-1 text-appBlack">
          Signal Title
        </h4>
        <input
          // disabled={isPending}
          className="border text-[16px] w-full flex-1 flex-shrink py-1 px-2 bg-lightPrimary focus:outline-appBlack focus:outline-offset-[-2]"
          placeholder="Enter the Signal Title"
          type="text"
          style={{
            fontVariationSettings: '"wght" 400,"opsz" 10',
            borderInlineEnd: 0,
          }}
          ref={inputRef}
          onChange={(e) => updateLocalStorage("title", e.target.value)}
        />
      </div>
      <div className="mt-5">
        <h4 className="text-[12px] font-helvetica uppercase ml-1 mb-1 text-appBlack">
          Source
        </h4>
        <input
          // disabled={isPending}
          className="border text-[16px] w-full flex-1 flex-shrink py-1 px-2 bg-lightPrimary focus:outline-appBlack focus:outline-offset-[-2]"
          placeholder="Enter Source"
          type="text"
          style={{
            fontVariationSettings: '"wght" 400,"opsz" 10',
            borderInlineEnd: 0,
          }}
          ref={sourceInputRef}
          onChange={(e) => updateLocalStorage("source", e.target.value)}
        />
      </div>
      {/* <JoditEditor
        content={content}
        setContent={(_content) => {
          setContent(_content);
        }}
        updateLiveContent={(content) => {
          updateLocalStorage("content", content);
        }}
      /> */}
      <div className="mt-5">
        <div className="flex justify-between gap-2">
          <h4 className="text-[12px] font-helvetica uppercase ml-1 mb-1 text-appBlack">
            Content
          </h4>
        </div>
        <div key={slateEditorKey}>
          <SlateEditor
            // onChange={onChange}
            // key={JSON.stringify(prePost?.nodes)}
            // value={prePost?.nodes as CustomElement[] | undefined}
            key={JSON.stringify(preSignal?.nodes)}
            value={preSignal?.nodes as CustomElement[] | undefined}
            ref={slateEditorRef}
            showToolbar
          />
        </div>
      </div>
      {/* <div className="flex justify-end gap-4 mb-10">
        <Button
          isDisabled={isPending}
          className="h-9 px-5 rounded bg-appBlue text-primary text-xs uppercase font-featureRegular"
          //   onClick={handleCreatePost}
          onClick={handleCreateSignal}
          variant="flat"
          color="primary"
          isLoading={isPending}
        >
          Create Signal
        </Button>
      </div> */}
    </div>
  );
}

export default forwardRef(SignalJodit);
