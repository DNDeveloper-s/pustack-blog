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
import AppImage from "@/components/shared/AppImage";
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

export default function BlogPostMobile({ _post }: { _post?: DocumentData }) {
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
    if (_post instanceof Post) return setPost(_post);
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
          _post.nodes,
          _post.displayThumbnail
        )
      );
    } else {
      setPost(undefined);
    }
  }, [_post]);

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

  console.log("post - ", post, _post);

  if (post === null) {
    return null;
  }

  if (post === undefined) {
    router.push("/");
    return null;
  }

  return (
    <main
      className="max-w-[1440px] min-h-screen mx-auto"
      style={{
        overflow: isMobileScreen ? "auto" : "hidden",
      }}
    >
      <div
        className="h-[220px] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-black before:bg-opacity-50 relative"
        style={{
          backgroundImage: `url(${post.snippetData?.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* <Image
          width={500}
          className="w-full h-full object-cover"
          height={600}
          src={imageUrl}
          alt="event"
        /> */}
        <div className="absolute top-0 left-0 w-full h-full flex items-end justify-start pb-8 px-3">
          <p className="font-featureBold text-[25px] text-white leading-[28px]">
            {post.title}
          </p>
        </div>
      </div>
      <div className="w-full bg-primary mt-[-30px] relative rounded-t-[18px]">
        <div className="w-full h-auto pb-10 pt-2 px-3">
          <div ref={ref} className="grid grid-cols-1 mb-3 gap-1">
            <div className="flex justify-between items-center gap-2">
              <div>
                <p className="text-lg mb-0.5 font-featureHeadline line-clamp-2">
                  Jane Doe
                </p>
                <p className="text-gray-400 text-sm font-helvetica font-light">
                  August 22, 2024, 9:00 AM
                </p>
              </div>
              <div className="rounded-full overflow-hidden w-10 h-10 border border-appBlack flex-shrink-0">
                <AppImage
                  src={post.author.photoURL}
                  alt="Image Url"
                  className="w-full h-full object-cover"
                  width={100}
                  height={100}
                />
              </div>
            </div>
            {post && <BlogPostShareLinks post={post} appendClassName="mt-3" />}
            <hr className="border-dashed border-[#1f1d1a4d] my-2" />
            <div className="pt-3 flex flex-col gap-6 justify-between">
              {!user && (
                <div>
                  <SignUpForNewsLettersButton
                    containerClassName="flex mt-1"
                    checkedLetters={newsLettersList}
                  />
                </div>
              )}
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
        </div>
      </div>
    </main>
  );
}
