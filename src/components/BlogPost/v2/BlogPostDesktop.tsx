"use client";

import { useDeletePost, useGetPostById, usePostBookmark } from "@/api/post";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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

export default function BlogPostDesktop({ _post }: { _post?: DocumentData }) {
  const params = useParams();
  const [elements, setElements] = useState<any>(null);
  const [post, setPost] = useState<Post | null | undefined>(null);
  const [copied, setCopied] = useState(false);
  const pageTimeSpent = usePageTime();
  const { user } = useUser();
  const readDoc = useRef(false);
  const [isBookMarked, setIsBookMarked] = useState(false);
  const { ref, isInView } = useInView();
  const deleteModalRef = useRef<any>();
  const [titles, setTitles] = useState<
    { titleWithIcons: any; title: string }[]
  >([]);
  const router = useRouter();
  const { isTabletScreen, isDesktopScreen, isMobileScreen } = useScreenSize();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const { mutate: postBookmark, isSuccess, error } = usePostBookmark();

  const { setOpen } = useJoinModal();

  useEffect(() => {
    const _storageRef = storageRef(storage, `static/minerva.png`);
    getDownloadURL(_storageRef)
      .then((url) => {
        console.log("url - ", url);
      })
      .catch((e) => {
        console.log("error - ", e);
      });
  }, []);

  useEffect(() => {
    if (_post) {
      setPost(
        new Post(
          _post.title,
          _post.subTitle,
          _post.subTextVariants,
          _post.author,
          _post.topic,
          _post.sections,
          _post.status ?? "published",
          _post.id,
          _post.timestamp,
          _post.position,
          _post.design,
          _post.displayTitle,
          _post.displayContent,
          _post.scheduledTime,
          _post.is_v2,
          _post.nodes
        )
      );
    } else {
      setPost(undefined);
    }
  }, [_post]);

  console.log("_post - ", post);

  const hasPost = !!post;
  const hasNoPost = !post;

  useEffect(() => {
    if (!user || !post?.id) return;
    const docRef = doc(db, "users", user.uid, "history", post.id);
    getDoc(docRef).then((doc) => {
      if (doc.exists()) {
        readDoc.current = true;
      }
    });
  }, [user, post?.id]);

  useEffect(() => {
    if (!post?.sections || !user || !post?.id || readDoc.current) return;
    const readingTimeInSeconds =
      readingTime(
        post.nodes
          ? extractTextFromEditor(post.nodes)
          : Section.mergedContent(post.sections)
      ).minutes * 60;
    // Check if the pageTimespent is 20% more than the reading time
    if (pageTimeSpent > readingTimeInSeconds * 0.2) {
      const docRef = doc(db, "users", user.uid, "history", post.id);
      setDoc(docRef, {
        id: post.id,
        read_at: serverTimestamp(),
        read: true,
      });
      readDoc.current = true;
    }
  }, [pageTimeSpent, post?.sections, post?.id, user]);

  function handleBookMark(bookmarked: boolean) {
    if (!user?.uid) {
      return setOpen(true);
    }
    if (!post?.id || !user?.uid) return;
    const qc = new QueryClient();
    const oldState = isBookMarked;
    setIsBookMarked(bookmarked);
    try {
      // const docRef = doc(db, "users", user.uid, "bookmarks", post.id);
      // if (bookmarked) {
      //   setDoc(docRef, {
      //     id: post.id,
      //     bookmarked_at: serverTimestamp(),
      //   });
      // } else {
      //   deleteDoc(docRef);
      // }
      // qc.invalidateQueries({
      //   queryKey: API_QUERY.QUERY_SAVED_POSTS(user?.uid),
      // });
      postBookmark({
        post,
        bookmarked,
      });
    } catch (e) {
      console.log("Error while bookmarking - ", e);
      setIsBookMarked(oldState);
    }
  }

  useEffect(() => {
    if (!post?.id || !user?.uid) return;
    const docRef = doc(db, "users", user.uid, "bookmarks", post.id);
    getDoc(docRef).then((doc) => {
      if (doc.exists()) {
        setIsBookMarked(true);
      }
    });
  }, [post?.id, user?.uid]);

  const sections = useMemo(() => {
    if (!post) return [];
    if (post.nodes) {
      return getSections(post.nodes as CustomElement[]);
    }
    return post.sections;
  }, [post?.sections, post?.nodes]);

  const renderElement = useCallback((element: any, index: number) => {
    if (element.tsx) {
      return element.tsx;
    } else {
      return (
        // <div
        //   key={`post.content_${element.id}`}
        //   className="w-full article-dynamic-container"
        //   // dangerouslySetInnerHTML={{ __html: element.content }}
        // >
        //   parse(element.content)
        // </div>
        element.content
      );
    }
  }, []);

  async function handleShare() {
    try {
      const shareData = {
        title: "Minerva",
        text: post?.snippetData?.title,
        url: "https://pustack-blog.vercel.app/" + post?.id,
      };
      await navigator.share(shareData);
      console.log("Successfully shared");
    } catch (err) {
      console.error("Error: " + err);
    }
  }

  if (post === null) {
    return null;
  }

  if (post === undefined) {
    router.push("/");
    return null;
  }

  return (
    <div className="max-w-[900px] mx-auto pb-10">
      <div
        ref={ref}
        className="grid divide-y md:divide-y-0 md:divide-x divide-dashed divide-[#1f1d1a4d] grid-cols-1 md:grid-cols-[auto_18.3125rem] my-6"
      >
        <div className="pb-5 md:pb-0 md:pr-5">
          <div className="flex items-end justify-between">
            <div className="mr-2">
              <img
                className="w-[38px] h-[38px]"
                src={post?.author?.photoURL ? post.author.photoURL : avatar.src}
                alt="avatar"
              />
            </div>
            <div className="flex-1">
              <h3 className="leading-[120%] text-[17px] group-hover:text-appBlue">
                {post?.author?.name}
              </h3>
              {/* <p
                  className="leading-[120%] text-[15px] text-tertiary group-hover:text-appBlue font-helvetica uppercase"
                  style={{
                    fontWeight: "300",
                    fontVariationSettings: '"wght" 400,"opsz" 10',
                  }}
                >
                  POLITICS
                </p> */}
            </div>
            <div className="flex items-center gap-3">
              {post?.sections && (
                <span className="text-[13px] text-[#53524c] font-helvetica leading-[14px]">
                  {
                    readingTime(
                      post.nodes
                        ? extractTextFromEditor(post.nodes)
                        : Section.mergedContent(post.sections)
                    ).text
                  }
                </span>
              )}
              {!isBookMarked ? (
                <FaRegStar
                  className="cursor-pointer"
                  onClick={() => handleBookMark(true)}
                />
              ) : (
                <FaStar
                  className="text-[#d9c503] cursor-pointer"
                  onClick={() => handleBookMark(false)}
                />
              )}
              {user?.uid === post?.author.uid && (
                <MdModeEdit
                  className="cursor-pointer"
                  onClick={() =>
                    // router.push("/posts/create?post_id=" + post?.id)
                    router.push("/me/publications")
                  }
                />
              )}
              {/* {user?.uid === post?.author.uid && (
                <MdDelete
                  className="cursor-pointer"
                  onClick={() => {
                    deleteModalRef.current?.handleChangeOpen(true);
                  }}
                />
              )} */}
            </div>
          </div>
          <hr className="border-dashed border-[#1f1d1a4d] my-2" />
          <div className="flex gap-5 items-center justify-between">
            <div className="flex gap-x-8 gap-y-2 items-center flex-wrap">
              <p className="text-[13px] text-[#53524c] font-helvetica leading-[14px]">
                Updated{" "}
                {dayjs(post?.timestamp).format("MMM DD, YYYY, H:mm a") +
                  " " +
                  " GMT " +
                  dayjs(post?.timestamp).format("Z")}
              </p>
              <p className="text-[13px] text-[#53524c] font-helvetica uppercase leading-[14px]">
                {post?.topic}
              </p>
            </div>
            <NavigatorShare handleShare={handleShare} />
          </div>
          <div className="mt-4">
            <h2
              className="font-featureHeadline line-clamp-4 leading-[120%] group-hover:text-appBlue bg-animation group-hover:bg-hover-animation"
              style={{
                fontSize: "32px",
                fontWeight: "395",
                fontVariationSettings: '"wght" 495,"opsz" 10',
              }}
            >
              {post?.snippetData?.title}
            </h2>
            {post?.snippetData?.image && (
              <BlogImage
                className="mt-4 w-[77%] cover-figure"
                src={
                  post?.snippetData?.image
                  // `https://pustack-blog.vercel.app/api/fetch-image?imageUrl=` +
                  // encodeURIComponent(post?.snippetData?.image)
                }
                style={{
                  aspectRatio: "auto 700 / 453",
                }}
              />
            )}
            {post && <BlogPostShareLinks post={post} appendClassName="mt-4" />}
          </div>
        </div>
        <div className="pt-5 md:pt-0 md:pl-5 flex flex-col gap-6 justify-between">
          <div>
            {!user && (
              <>
                <div className="py-1">
                  <p className="font-featureHeadline style_intro leading-[120%]">
                    <b className="style_bold">
                      Sign up for Minerva Principals:
                    </b>
                    {" What the White House is reading. "}
                    <Link href="#" className="underline whitespace-nowrap">
                      Read it now.
                    </Link>
                  </p>
                </div>
                <SignUpForNewsLettersButton
                  containerClassName="flex mt-1"
                  checkedLetters={newsLettersList}
                />
              </>
            )}
          </div>
          {sections?.length > 0 && (
            <div className="flex flex-col gap-1">
              <h3
                className="text-[#1f1d1a] text-[16px] font-featureHeadline"
                style={{
                  fontWeight: 400,
                  fontVariationSettings: '"wght" 500,"opsz" 10',
                }}
              >
                In this article:
              </h3>
              {sections?.map((section, index) => (
                <>
                  <hr className="border-dashed border-[#1f1d1a4d] my-2" />
                  <div
                    className="flex gap-2 items-center cursor-pointer"
                    onClick={() => {
                      router.push("#" + section.id);
                    }}
                  >
                    <h3
                      className="text-[#1f1d1a] text-[16px] font-featureHeadline capitalize"
                      style={{
                        fontWeight: 400,
                        fontVariationSettings: '"wght" 500,"opsz" 10',
                        alignItems: "center",
                        gap: "10px",
                        display: "grid",
                        gridTemplateColumns: "16px 1fr",
                      }}
                    >
                      <span className="inline-flex">
                        <img
                          src={section.icon}
                          alt="icon"
                          className="h-auto w-auto inline"
                        />
                      </span>
                      {section.title}
                    </h3>
                  </div>
                </>
              ))}
            </div>
          )}
        </div>
      </div>
      <hr className="border-dashed border-[#1f1d1a4d] mt-[20px]" />
      <hr className="border-dashed border-[#1f1d1a4d] mt-[1px]" />
      {post.nodes ? (
        <div className="my-8">
          <SlateEditor readonly value={post.nodes as CustomElement[]} />
        </div>
      ) : (
        <MathJaxContext>
          <div className="w-full py-2 mt-5 no-preflight blog-post-container jodit-table">
            {post?.sections?.map((section, index) => (
              <BlogPostSection key={section.id} section={section} />
            ))}
            {hasNoPost && (
              <div className="my-10 text-xl text-center text-red-500 uppercase">
                Post not found,{" "}
                <span className="underline text-appBlue">
                  <Link href="/">Go back</Link>
                </span>
              </div>
            )}
          </div>
        </MathJaxContext>
      )}
      <div>
        <Image alt="Minerva" src={minervaMiniImage} className="w-[16px]" />
        <hr className="border-dashed border-[#1f1d1a4d] mt-[10px]" />
        <hr className="border-dashed border-[#1f1d1a4d] mt-[1px]" />
      </div>
      <MoreFromMinerva />
      <DeletePostModalRef post={post as Post} ref={deleteModalRef} />
    </div>
  );
}
