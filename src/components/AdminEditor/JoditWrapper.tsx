"use client";

import {
  RefObject,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Post, SubTextVariants } from "@/firebase/post-v2";
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
import { useNotification } from "@/context/NotificationContext";
import { SectionEditorRef } from "./Sections/SectionEditor";
import SlateEditor, { SlateEditorRef } from "../SlateEditor/SlateEditor";
import { Checkbox } from "../SignUpForNewsLetters/SignUpForNewsLetters";
import { CustomElement } from "../../../types/slate";
import { topics } from "@/constants";
import { toDashCase } from "@/firebase/signal";
import { useMutateOpenAIGenerate } from "@/api/post";
import SubTitleComponent from "./SubTitleComponent";
import EventEmitter from "@/lib/EventEmitter";
import Cropper from "react-easy-crop";
import { getFirstImage } from "../SlateEditor/utils/helpers";
import ImageCropper from "./ImageCropper";

const dummyAuthor = {
  name: "John Doe",
  email: "johndoe@gmail.com",
  photoURL:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwMtTVob9_kP89ahzHe8zbQLNio88s0UDBDqlDjbkpBQ&s",
};

const availableTopics = topics
  .filter((c) => c !== "Home")
  .map((topic) => ({
    key: toDashCase(topic),
    value: topic,
    disabled: false,
  }));

const TOPICS = [
  { key: "", value: "Select Topic", disabled: true },
  ...availableTopics,
];

function JoditWrapper(
  {
    handleContinue,
    handleSaveDraft,
    prePost,
    isDraftSaving,
    isDraft,
    onChange,
  }: {
    handleContinue: (post: Post) => void;
    prePost?: Post;
    handleSaveDraft: (post: Post) => void;
    isDraftSaving: boolean;
    isDraft: boolean;
    onChange: () => void;
  },
  ref: any
) {
  // const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const customTopicRef = useRef<HTMLInputElement | null>(null);
  const subTitleInputRef = useRef<HTMLInputElement | null>(null);
  const imageCropperRef = useRef<any>(null);
  const topicRef = useRef<HTMLSelectElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { user } = useUser();
  const disclosureOptions = useDisclosure();
  // const [initialContent, setInitialContent] = useState("");
  const currentContent = useRef<string>("");
  const postSectionsRef = useRef<PostSectionsRef>(null);
  const slateEditorRef = useRef<SlateEditorRef>(null);
  const [slateEditorKey, setSlateEditorKey] = useState(0);
  const { openNotification } = useNotification();
  const [titleValue, setTitleValue] = useState<string>("");
  const [customTopicValue, setCustomTopicValue] = useState<string>("");

  const subTextVariants = useRef<SubTextVariants>(
    prePost?.subTextVariants as any
  );

  useEffect(() => {
    const unsub = EventEmitter.addListener(
      "accept-variant",
      (data: { text: string; variant: keyof SubTextVariants }) => {
        console.log("data | 104 - ", data);
        if (subTextVariants.current) {
          subTextVariants.current[data.variant] = data.text;
        } else {
          // @ts-ignore
          subTextVariants.current = {
            [data.variant]: data.text,
          };
        }
      }
    );

    return () => {
      unsub.remove();
    };
  }, []);

  useEffect(() => {
    if (prePost) {
      setTopic(prePost.topic);
      if (prePost.title) {
        // inputRef.current.value = prePost.title ?? "";
        setTitleValue(prePost.title ?? "");
      }
      if (prePost.customTopic) {
        setCustomTopicValue(prePost.customTopic ?? "");
      }
      if (subTitleInputRef.current)
        subTitleInputRef.current.value = prePost.subTitle ?? "";
    }
  }, [prePost]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setTopic("");
      // setInitialContent("");
      setSlateEditorKey((prev) => prev + 1);
      currentContent.current = "";
      if (inputRef.current) {
        // inputRef.current.value = "";
        setTitleValue("");
      }
      if (subTitleInputRef.current) subTitleInputRef.current.value = "";
    },
    getSlateValue: () => {
      return slateEditorRef.current?.getValue();
    },
    getSubTextVariants: () => {
      return subTextVariants.current;
    },
    handleContinuePost: () => {
      handleContinuePost();
    },
    handleSaveAsDraft: () => {
      handleSaveAsDraft();
    },
    getTopicValue: () => topic,
    getCustomTopicValue: () => customTopicValue,
    getTitleValue: () => titleValue,
    getSubTitleValue: () => {
      console.log(
        "subTitleInputRef.current?.value",
        subTitleInputRef.current,
        subTitleInputRef.current?.value
      );
      return subTitleInputRef.current?.value ?? "";
    },
    getThumbnailData: () => {
      return imageCropperRef.current?.getThumbnail();
    },
    isValid: (
      titleValue: string,
      subTitleValue: string,
      topicValue: string,
      customTopicValue: string,
      silent: boolean
    ) =>
      isValid(titleValue, subTitleValue, topicValue, customTopicValue, silent),
  }));

  const isValid = (
    titleValue: string,
    subTitleValue: string,
    topicValue: string,
    customTopicValue: string,
    silent: boolean = false
  ) => {
    const sections = postSectionsRef.current?.getSections();
    sections?.forEach((section) => {
      section.updateContent(section.trimContent(section.content));
    });
    const _isValid = titleValue && topicValue;

    const field = titleValue
      ? subTitleValue
        ? topicValue
          ? (topicValue === "more" ? customTopicValue : true)
            ? sections && Section.mergedContent(sections).length > 0
              ? null
              : "sections"
            : "customTopic"
          : "topic"
        : "subTitle"
      : "title";

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

    if (field === "subTitle") {
      if (!silent) {
        subTitleInputRef.current?.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
        subTitleInputRef.current?.focus();
      }
      return {
        isValid: false,
        field,
        message: "Please enter the post sub-title",
      };
    }

    if (field === "topic") {
      if (!silent) {
        topicRef.current?.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
        topicRef.current?.focus();
      }
      return { isValid: false, field, message: "Please select a topic" };
    }

    if (field === "customTopic") {
      if (!silent) {
        customTopicRef.current?.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
        customTopicRef.current?.focus();
      }
      return {
        isValid: false,
        field,
        message: "Please enter the custom topic",
      };
    }

    // slateEditorRef.current?.getValue();
    if (slateEditorRef.current?.hasSomeContent() === false) {
      return { isValid: false, field, message: "Please enter some content" };
    }

    // return { isValid: _isValid, field, message: "Please fill all fields." };
    return { isValid: true, field: "", message: "" };
  };

  async function handleContinuePost() {
    if (!user) return;

    // const sections = postSectionsRef.current?.getSections();
    // sections?.forEach((section) => {
    //   section.updateContent(section.trimContent(section.content));
    // });

    const _isValid = isValid(
      titleValue ?? "",
      subTitleInputRef.current?.value ?? "",
      topic,
      customTopicValue ?? ""
    );

    if (!_isValid.isValid) {
      openNotification(
        "bottomRight",
        {
          message: _isValid.message,
          closable: true,
          duration: 2,
          closeIcon: (
            <p className="underline text-danger cursor-pointer whitespace-nowrap">
              Close
            </p>
          ),
          className: "drafts-notification",
        },
        "error"
      );
      return;
    }

    const thumbnail = imageCropperRef.current?.getThumbnail();

    let post = new Post(
      titleValue || "Untitled",
      subTitleInputRef.current?.value || "",
      subTextVariants.current,
      {
        name: user?.name || dummyAuthor.name,
        email: user?.email || dummyAuthor.email,
        photoURL: user?.image_url || dummyAuthor.photoURL,
        uid: user?.uid,
      },
      topic,
      customTopicValue,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      true,
      slateEditorRef.current?.getValue(),
      thumbnail
      // sections
    );

    if (prePost) {
      post = new Post(
        titleValue || "Untitled",
        subTitleInputRef.current?.value || "",
        subTextVariants.current ?? prePost.subTextVariants,
        {
          name: user?.name || dummyAuthor.name,
          email: user?.email || dummyAuthor.email,
          photoURL: user?.image_url || dummyAuthor.photoURL,
          uid: user?.uid,
        },
        topic,
        customTopicValue,
        [],
        prePost.status ?? "published",
        prePost.id,
        prePost.timestamp,
        prePost.snippetPosition,
        prePost.snippetDesign,
        prePost.displayTitle,
        prePost.displayContent,
        prePost.scheduledTime,
        true,
        slateEditorRef.current?.getValue(),
        thumbnail ?? prePost.thumbnail
      );
    }

    // postCreatePost(post);
    handleContinue(post);
  }

  async function handleSaveAsDraft() {
    if (!user) return router.push("/");

    if (!isDraft && prePost) return;

    const _isValid = isValid(
      titleValue ?? "",
      subTitleInputRef.current?.value ?? "",
      topic,
      customTopicValue
    );

    if (!_isValid.isValid) {
      openNotification(
        "bottomRight",
        {
          message: _isValid.message,
          closable: true,
          duration: 2,
          showProgress: true,
          closeIcon: (
            <p className="underline text-danger cursor-pointer whitespace-nowrap">
              Close
            </p>
          ),
          className: "drafts-notification",
        },
        "error"
      );
      return;
    }

    const thumbnail = imageCropperRef.current?.getThumbnail();

    let post = new Post(
      titleValue || "Untitled",
      subTitleInputRef.current?.value || "",
      subTextVariants.current,
      {
        name: user?.name || dummyAuthor.name,
        email: user?.email || dummyAuthor.email,
        photoURL: user?.image_url || dummyAuthor.photoURL,
        uid: user?.uid,
      },
      topic,
      customTopicValue,
      [],
      "draft",
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      true,
      slateEditorRef.current?.getValue(),
      thumbnail
    );

    if (isDraft && prePost) {
      post = new Post(
        titleValue || "Untitled",
        subTitleInputRef.current?.value || "",
        subTextVariants.current ?? prePost.subTextVariants,
        {
          name: user?.name || dummyAuthor.name,
          email: user?.email || dummyAuthor.email,
          photoURL: user?.image_url || dummyAuthor.photoURL,
          uid: user?.uid,
        },
        topic,
        customTopicValue,
        [],
        prePost?.status ?? "published",
        prePost?.id,
        prePost?.timestamp,
        prePost?.snippetPosition,
        prePost?.snippetDesign,
        prePost?.displayTitle,
        prePost?.displayContent,
        undefined,
        true,
        slateEditorRef.current?.getValue(),
        thumbnail ?? prePost.thumbnail
      );
    }

    handleSaveDraft(post);
  }

  const handlePreview = () => {
    console.log(
      "slateEditorRef.current?.getValue(); - ",
      slateEditorRef.current?.getValue()
    );
    slateEditorRef.current?.setReadonly(true);
    // disclosureOptions.onOpen();
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
    <div className="w-full max-w-[900px] mx-auto py-2">
      {/* <div>
        <h2 className="text-appBlack text-[30px] mt-8 font-larkenExtraBold">
          Create Post
        </h2>
      </div> */}
      {error && <p className="text-red-500 text-sm my-2">{error}</p>}
      <div className="mt-5">
        <div className="mb-1 flex items-center justify-between">
          <h4 className="text-[12px] font-helvetica uppercase ml-1 text-appBlack">
            Post Title
          </h4>
          <div>
            <span
              className={
                "text-[10px] " +
                (titleValue.length >= 100
                  ? "text-danger-500"
                  : "text-[#1f1d1a]")
              }
            >
              {titleValue.length}/100
            </span>
          </div>
        </div>
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
          value={titleValue}
          onChange={(e) => {
            if (e.target.value && e.target.value.length > 100) {
              setTitleValue(e.target.value.slice(0, 100));
              return;
            }
            onChange();
            setTitleValue(e.target.value);
          }}
        />
      </div>

      <div className="mt-5">
        <h4 className="text-[12px] font-helvetica uppercase ml-1 mb-1 text-appBlack">
          Topic
        </h4>
        <select
          // disabled={isPending}
          ref={topicRef}
          value={topic}
          onChange={(e) => {
            setTopic(e.target.value);
            onChange();
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

      {topic === "more" && (
        <div className="mt-2">
          <h4 className="text-[12px] font-helvetica uppercase ml-1 mb-1 text-appBlack">
            Enter Your Topic
          </h4>
          <input
            // disabled={isPending}
            className="border text-[16px] w-full flex-1 flex-shrink py-1 px-2 bg-lightPrimary focus:outline-appBlack focus:outline-offset-[-2]"
            placeholder="Enter the Topic here..."
            type="text"
            style={{
              fontVariationSettings: '"wght" 400,"opsz" 10',
              borderInlineEnd: 0,
            }}
            ref={customTopicRef}
            value={customTopicValue}
            onChange={(e) => {
              if (e.target.value && e.target.value.length > 30) {
                setCustomTopicValue(e.target.value.slice(0, 30));
                return;
              }
              onChange();
              setCustomTopicValue(e.target.value);
            }}
          />
        </div>
      )}
      <div className="mt-5">
        <div className="flex justify-between gap-2">
          <h4 className="text-[12px] font-helvetica uppercase ml-1 mb-1 text-appBlack">
            Content
          </h4>
        </div>
        <div key={slateEditorKey}>
          <SlateEditor
            onChange={onChange}
            key={JSON.stringify(prePost?.nodes)}
            value={prePost?.nodes as CustomElement[] | undefined}
            ref={slateEditorRef}
            showToolbar
          />
        </div>
      </div>
      <div className="mt-5">
        <ImageCropper ref={imageCropperRef} thumbnail={prePost?.thumbnail} />
      </div>
      <div className="mt-5">
        <SubTitleComponent ref={subTitleInputRef} onChange={onChange} />
      </div>
    </div>
  );
}

export default forwardRef(JoditWrapper);
