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

function SignalJodit(props: any, ref: any) {
  const [content, setContent] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const sourceInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { user } = useUser();
  const { mutate: postCreateSignal, isPending } = useCreateSignal({
    onSuccess: () => {
      setContent("");
      if (inputRef.current) inputRef.current.value = "";
      if (sourceInputRef.current) sourceInputRef.current.value = "";
      window.localStorage.removeItem("signal_editor_state");
      router.push("/");
    },
  });

  useEffect(() => {
    const getContent = localStorage.getItem("signal_editor_state") ?? "{}";
    const storageContent = JSON.parse(getContent);

    if (storageContent) {
      setContent(storageContent.content);
      if (inputRef.current) inputRef.current.value = storageContent.title ?? "";
      if (sourceInputRef.current)
        sourceInputRef.current.value = storageContent.source ?? "";
    }
  }, []);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setContent("");
      if (inputRef.current) inputRef.current.value = "";
      if (sourceInputRef.current) sourceInputRef.current.value = "";
    },
  }));

  async function handleCreateSignal() {
    if (!user) return;

    const isValid =
      inputRef.current?.value && content && sourceInputRef.current?.value;

    if (!isValid) {
      setError("Please fill all fields");
      return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const body = doc.body;
    function trimArray(arr: ChildNode[]) {
      let index = 0;
      while (true) {
        const el = arr[index];
        if (
          el?.textContent?.trim() !== "" ||
          !Array.from(el.childNodes).every((c) => c.nodeName === "BR")
        ) {
          break;
        }
        index++;
      }
      return arr.slice(index);
    }
    function nodesToInnerHTMLString(nodes: any[]) {
      const container = document.createElement("div");
      nodes.forEach((node) => container.appendChild(node.cloneNode(true)));
      return container.innerHTML;
    }
    function trimEmptyElements(parentNode: HTMLElement) {
      const children = Array.from(parentNode.childNodes);
      const arr = trimArray(children);
      const finalArray = trimArray(arr.reverse());

      finalArray.reverse();

      return nodesToInnerHTMLString(finalArray);
    }
    const trimmedContent = trimEmptyElements(body);

    const signal = new Signal(
      inputRef.current?.value || "Untitled",
      trimmedContent,
      {
        name: user?.name || dummyAuthor.name,
        email: user?.email || dummyAuthor.email,
        photoURL: user?.image_url || dummyAuthor.photoURL,
      },
      sourceInputRef.current?.value || "Unknown"
    );

    // // postCreatePost(post);
    // handleContinue(post);
    console.log("trimmedContent - ", trimmedContent);
    // postCreateSignal(signal);
  }

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
      <div className="mt-5">
        <Button onClick={onOpen}>Create Maths Formula</Button>
      </div>
      <JoditEditor
        content={content}
        setContent={(_content) => {
          setContent(_content);
        }}
        updateLiveContent={(content) => {
          updateLocalStorage("content", content);
        }}
      />
      <div className="flex justify-end gap-4 mb-10">
        {/* <Button
          isDisabled={isPending}
          className="h-9 px-5 rounded bg-appBlue text-primary text-xs uppercase font-featureRegular"
          onClick={handleCreatePost}
          variant="flat"
          color="primary"
          isLoading={isPending}
        >
          Create Post
        </Button> */}
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
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          wrapper: "bg-black bg-opacity-50",
          base: "!max-w-[900px] !w-[90vw]",
        }}
      >
        <ModalContent>
          <ModalHeader>Mathematics Formula</ModalHeader>
          <ModalBody>
            <iframe
              src="https://www.imatheq.com/imatheq/com/imatheq/math-equation-editor-latex-mathml.html"
              style={{
                width: "100%",
                height: "80vh",
                maxHeight: "800px",
              }}
            ></iframe>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default forwardRef(SignalJodit);
