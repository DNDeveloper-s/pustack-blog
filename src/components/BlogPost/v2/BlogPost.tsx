"use client";

import { useDeletePost, useGetPostById, usePostBookmark } from "@/api/post";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { getDownloadURL, ref as storageRef } from "firebase/storage";
import { Highlight, themes } from "prism-react-renderer";
import dynamic from "next/dynamic";
import {
  ReactNode,
  createElement,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import Image from "next/image";
import {
  avatar,
  dotImage,
  iImage,
  imageOne,
  minervaMiniImage,
  notableImage,
} from "@/assets";
import dayjs from "dayjs";
import { Post } from "@/firebase/post-v2";
import parse, { DOMNode, domToReact, htmlToDOM } from "html-react-parser";
import {
  DocumentData,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import readingTime from "reading-time";
import usePageTime from "@/hooks/usePageTime";
import { useUser } from "@/context/UserContext";
import { db, functions, storage } from "@/lib/firebase";
import { FaRegStar } from "react-icons/fa";
import { FaCopy, FaStar } from "react-icons/fa6";
import BlogImage, { BlogImageDefault } from "../../shared/BlogImage";
import { HiOutlineExternalLink } from "react-icons/hi";
import SignUpForNewsLettersButton from "../../shared/SignUpForNewsLettersButton";
import { newsLettersList } from "../../SignUpForNewsLetters/SignUpForNewsLetters";
import useScreenSize from "@/hooks/useScreenSize";
import Footer from "../../shared/Footer";
import BlogPostShareLinks from "../BlogPostShareLinks";
import BlogPostStickyNavbar from "../BlogPostStickyNavbar";
import useInView from "@/hooks/useInView";
import MoreFromMinerva from "../MoreFromMinerva";
import BlogPostCode from "../BlogPostCode";
import ScrollableContent from "../../shared/ScrollableComponent";
import { MdDelete, MdModeEdit } from "react-icons/md";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Section } from "../../AdminEditor/Sections/Section";
import BlogPostSection from "./BlogPostSection";
import {
  getFunctions,
  httpsCallable,
  httpsCallableFromURL,
} from "firebase/functions";
import SlateEditor from "@/components/SlateEditor/SlateEditor";
import { CustomElement } from "../../../../types/slate";
import {
  extractTextFromEditor,
  getSections,
} from "@/components/SlateEditor/utils/helpers";
import { useJoinModal } from "@/context/JoinModalContext";
import { QueryClient } from "@tanstack/react-query";
import { API_QUERY } from "@/config/api-query";
import BlogPostMobile from "./BlogPostMobile";
import BlogPostDesktop from "./BlogPostDesktop";
const NavigatorShare = dynamic(() => import("../NavigatorShare"), {
  ssr: false,
});

function transformObjectToCodeString(object: any) {
  // Initialize an array to hold the lines of code
  let codeLines = [];

  // Helper function to extract text from the object
  function extractText(node: any) {
    if (typeof node === "string") {
      return node;
    } else if (node?.props?.children) {
      return node.props.children.map(extractText).join("");
    } else if (node?.type === "br") {
      return "\n"; // Handle line breaks
    } else {
      return "";
    }
  }

  // Iterate over the object array
  for (let i = 0; i < object.length; i++) {
    const line = object[i];
    const text = extractText(line);
    codeLines.push(text);
  }

  // Join the lines of code into a single string
  const codeString = codeLines.join("");

  return codeString;
}

export function filterAndTrimStrings(arr: any[]) {
  if (!(arr instanceof Array)) return "";
  return (
    arr?.map((c: any) => (typeof c === "string" ? c.trim() : "")).join(" ") ??
    ""
  );
}

function calculatePreHeightByLineNumber(number: number) {
  const CODE_LINE_HEIGHT = 27;
  const VERTICAL_PADDING = 20;

  return CODE_LINE_HEIGHT * number + VERTICAL_PADDING;
}

function DeletePostModal({ post }: { post?: Post }, ref: any) {
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  useImperativeHandle(ref, () => ({
    handleChangeOpen: (open: boolean) => {
      console.log("open - ", open);
      if (open) onOpen();
      else onClose();
    },
  }));

  const {
    mutate: postDeletePost,
    isPending,
    isSuccess,
    error,
  } = useDeletePost({
    onSuccess(data, variables, context) {
      onClose();
      // @ts-ignore
      window.location = "/";
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        base: "!bg-primary",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Delete Post
            </ModalHeader>
            <ModalBody>
              <p>
                Are you sure you want to delete post &quot;
                <strong>{post?.displayTitle}</strong>&quot;
              </p>
              {error && (
                <p className="text-sm my-1 text-gray-500 bg-[#fffdf2] p-[4px_8px] rounded">
                  Deletion Error:{" "}
                  <span className="italic pl-1 text-danger-500 ">
                    {error.message}
                  </span>
                </p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={() => {
                  console.log("post.id - ", post?.id);
                  !!post?.id && postDeletePost(post.id);
                }}
                isLoading={isPending}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export function PostActionModalBase({
  disclosureOptions,
  error,
  isLoading,
  onConfirm,
  title,
  content,
  confirmButton,
  cancelButton,
}: {
  disclosureOptions: any;
  post?: Post;
  error?: Error | null;
  isLoading: boolean;
  onConfirm: () => void;
  title: string;
  content: ReactNode;
  confirmButton: ReactNode;
  cancelButton: ReactNode;
}) {
  const { isOpen, onOpenChange } = disclosureOptions;
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        base: "!bg-primary",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              {/* <p>
                Are you sure you want to unpublish the post &quot;
                <strong>{post?.displayTitle}</strong>&quot;
              </p> */}
              {content}
              {error && (
                <p className="text-sm my-1 text-gray-500 bg-[#fffdf2] p-[4px_8px] rounded">
                  Error:{" "}
                  <span className="italic pl-1 text-danger-500 ">
                    {error.message}
                  </span>
                </p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="light" onPress={onClose}>
                {cancelButton}
              </Button>
              <Button
                color="danger"
                onPress={() => {
                  onConfirm();
                }}
                isLoading={isLoading}
              >
                {confirmButton}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

const DeletePostModalRef = forwardRef(DeletePostModal);

export default function BlogPost({ _post }: { _post?: DocumentData }) {
  const { isMobileScreen, isTabletScreen, isDesktopScreen } = useScreenSize();
  const searchParams = useSearchParams();
  const router = useRouter();

  if (isMobileScreen) {
    if (!!searchParams.get("post_drawer_id"))
      return <BlogPostMobile _post={_post} />;
    else {
      router.replace("/?post_drawer_id=" + _post?.id);
      return null;
    }
  }

  return <BlogPostDesktop _post={_post} />;
}
