"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import JoditEditor from "./JoditEditor";
import { Post } from "@/firebase/post-v2";
import { useCreatePost } from "@/api/post";
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
import JoditPreview from "./JoditPreview";
import { Spinner } from "@nextui-org/spinner";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PostSections, { PostSectionsRef } from "./PostSections";
import { Section } from "./Sections/Section";

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

function MathsFormulaIframe() {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  return (
    <>
      {!iframeLoaded && (
        <div className="flex items-center justify-center py-5">
          <Spinner size="sm" label="Loading Maths Editor" />
        </div>
      )}
      {iframeLoaded && (
        <p className="mb-3 text-appBlue">
          Copy <strong>Math ML</strong> code and paste it in the editor using
          the <strong>Keep</strong> option.
        </p>
      )}
      <iframe
        src="https://www.imatheq.com/imatheq/com/imatheq/math-equation-editor-latex-mathml.html"
        style={{
          width: "100%",
          height: "80vh",
          maxHeight: "800px",
          opacity: iframeLoaded ? 1 : 0,
        }}
        onLoad={(e: any) => {
          console.log("iframe loaded", e);
          setIframeLoaded(true);
        }}
      ></iframe>
    </>
  );
}

function JoditWrapper(
  {
    handleContinue,
    prePost,
  }: {
    handleContinue: (post: Post) => void;
    prePost?: Post;
  },
  ref: any
) {
  // const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { user } = useUser();
  const disclosureOptions = useDisclosure();
  // const [initialContent, setInitialContent] = useState("");
  const currentContent = useRef<string>("");
  const postSectionsRef = useRef<PostSectionsRef>(null);

  useEffect(() => {
    const getContent = localStorage.getItem("editor_state") ?? "{}";
    const storageContent = JSON.parse(getContent);

    if (prePost) {
      // setInitialContent(prePost.content);
      // currentContent.current = prePost.content;
      setTopic(prePost.topic);
      if (inputRef.current) inputRef.current.value = prePost.title ?? "";
    } else if (storageContent) {
      // setInitialContent(storageContent.content);
      // currentContent.current = storageContent.content;
      setTopic(storageContent.topic);
      if (inputRef.current) inputRef.current.value = storageContent.title ?? "";
    }
  }, [prePost]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setTopic("");
      // setInitialContent("");
      currentContent.current = "";
      if (inputRef.current) inputRef.current.value = "";
    },
  }));

  async function handleContinuePost() {
    if (!user) return;

    const sections = postSectionsRef.current?.getSections();
    sections?.forEach((section) => {
      section.updateContent(section.trimContent(section.content));
    });

    const isValid =
      inputRef.current?.value &&
      sections &&
      Section.mergedContent(sections).length > 0 &&
      topic;

    if (!isValid) {
      setError("Please fill all fields");
      return;
    }

    let post = new Post(
      inputRef.current?.value || "Untitled",
      {
        name: user?.name || dummyAuthor.name,
        email: user?.email || dummyAuthor.email,
        photoURL: user?.image_url || dummyAuthor.photoURL,
      },
      topic,
      sections
    );

    if (prePost) {
      post = new Post(
        inputRef.current?.value || "Untitled",
        {
          name: user?.name || dummyAuthor.name,
          email: user?.email || dummyAuthor.email,
          photoURL: user?.image_url || dummyAuthor.photoURL,
        },
        topic,
        sections,
        prePost.id,
        prePost.timestamp,
        prePost.snippetPosition,
        prePost.snippetDesign,
        prePost.displayTitle,
        prePost.displayContent,
        true
      );
    }

    // postCreatePost(post);
    handleContinue(post);
  }

  const handlePreview = () => {
    disclosureOptions.onOpen();
  };

  const updateLocalStorage = (key: string, value: any) => {
    if (prePost) return;
    const getContent = localStorage.getItem("editor_state") ?? "{}";
    const storageContent = JSON.parse(getContent);

    localStorage.setItem(
      "editor_state",
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
          Post Title
        </h4>
        <input
          // disabled={isPending}
          className="border text-[16px] w-full flex-1 flex-shrink py-1 px-2 bg-lightPrimary focus:outline-appBlack focus:outline-offset-[-2]"
          placeholder="Enter the Post Title"
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
          Topic
        </h4>
        <select
          // disabled={isPending}
          value={topic}
          onChange={(e) => {
            setTopic(e.target.value);
            updateLocalStorage("topic", e.target.value);
          }}
          className="border text-[16px] w-full flex-1 flex-shrink py-2 px-2 bg-lightPrimary focus:outline-appBlack focus:outline-offset-[-2]"
        >
          {TOPICS.map((_topic) => (
            <option
              selected={topic === _topic.value}
              key={_topic.key}
              value={_topic.key}
              disabled={_topic.disabled}
            >
              {_topic.value}
            </option>
          ))}
        </select>
      </div>
      <div className="my-5">
        <Button
          className="h-9 px-5 rounded text-xs font-featureRegular create-maths-formula-button"
          variant="flat"
          color="default"
          onClick={onOpen}
        >
          Create Maths Formula
        </Button>
      </div>
      <DndProvider backend={HTML5Backend}>
        <h4 className="text-[12px] font-helvetica uppercase ml-1 mb-1 text-appBlack">
          Sections
        </h4>
        <PostSections sections={prePost?.sections} ref={postSectionsRef} />
      </DndProvider>
      {!postSectionsRef.current?.isResizing() && (
        <div className="flex justify-end gap-4 mb-10">
          <Button
            // isDisabled={isPending}
            className="h-9 px-5 rounded bg-warning-500 text-primary text-xs uppercase font-featureRegular preview-editor-button"
            onClick={handlePreview}
            variant="flat"
            color="primary"
            // isLoading={isPending}
          >
            Preview
          </Button>
          <Button
            // isDisabled={isPending}
            className="h-9 px-5 rounded bg-appBlue text-primary text-xs uppercase font-featureRegular"
            // onClick={handleCreatePost}
            onClick={handleContinuePost}
            variant="flat"
            color="primary"
            // isLoading={isPending}
          >
            Continue
          </Button>
        </div>
      )}
      <JoditPreview
        disclosureOptions={disclosureOptions}
        sections={postSectionsRef.current?.getSections()}
      />
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
            <MathsFormulaIframe />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default forwardRef(JoditWrapper);
