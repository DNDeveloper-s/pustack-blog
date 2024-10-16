"use client";

import { useDeletePost, useGetPostById } from "@/api/post";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { Highlight, themes } from "prism-react-renderer";
import dynamic from "next/dynamic";
import {
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
import { getDownloadURL, ref as storageRef } from "firebase/storage";
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
import { Post } from "@/firebase/post";
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
import { db, storage } from "@/lib/firebase";
import { FaRegStar } from "react-icons/fa";
import { FaCopy, FaStar } from "react-icons/fa6";
import BlogImage, { BlogImageDefault } from "../shared/BlogImage";
import { HiOutlineExternalLink } from "react-icons/hi";
import SignUpForNewsLettersButton from "../shared/SignUpForNewsLettersButton";
import { newsLettersList } from "../SignUpForNewsLetters/SignUpForNewsLetters";
import useScreenSize from "@/hooks/useScreenSize";
import Footer from "../shared/Footer";
import BlogPostShareLinks from "./BlogPostShareLinks";
import BlogPostStickyNavbar from "./BlogPostStickyNavbar";
import useInView from "@/hooks/useInView";
import MoreFromMinerva from "./MoreFromMinerva";
import BlogPostCode from "./BlogPostCode";
import ScrollableContent from "../shared/ScrollableComponent";
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
import AppImage from "../shared/AppImage";
const NavigatorShare = dynamic(() => import("./NavigatorShare"), {
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

  useEffect(() => {
    if (_post) {
      setPost(
        new Post(
          _post.title,
          _post.content,
          _post.author,
          _post.topic,
          _post.id,
          _post.timestamp,
          undefined,
          undefined,
          false,
          _post.displayTitle,
          _post.displayContent
        )
      );
    } else {
      setPost(undefined);
    }
  }, [_post]);

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
    if (!post?.content || !user || !post?.id || readDoc.current) return;
    const readingTimeInSeconds = readingTime(post.content).minutes * 60;
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
  }, [pageTimeSpent, post?.content, post?.id, user]);

  useEffect(() => {
    if (post?.content) {
      let index = 0;
      let firstContentEncountered = false;
      const parser = new DOMParser();
      const doc = parser.parseFromString(post?.content, "text/html");
      const body = doc.body;

      // const preElement = body.querySelector("pre");

      function trimArray(arr: ChildNode[]) {
        let index = 0;
        while (true) {
          const el = arr[index];
          if (
            el.textContent?.trim() !== "" ||
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

      const content = parse(trimmedContent, {
        library: {
          createElement(type, props, ...children) {
            if (type === "pre") {
              return <BlogPostCode code={children[0]} />;
            }

            if (type === "table") {
              return <ScrollableContent>{children[0]}</ScrollableContent>;
              // return createElement(
              //   "div",
              //   {
              //     className: "overflow-x-auto",
              //   },
              //   children[0]
              // );
            }

            if (
              type === "img" &&
              // @ts-ignore
              props?.className?.includes("blog-image")
            ) {
              return (
                <BlogImageDefault
                  className="max-w-full block"
                  // @ts-ignore
                  src={props.src}
                  imageProps={{
                    ...props,
                    // @ts-ignore
                    className: "max-w-full h-auto " + (props.className ?? ""),
                  }}
                />
              );
            }

            if (type === "section") {
              let title = children[0]
                .find((c: any) => c.props?.className?.includes("styles_title"))
                ?.props?.children.find((c: any) => c.type === "h2")
                .props.children;

              console.log("title - ", title);

              title &&
                title instanceof Array &&
                setTitles((prev) => [
                  ...prev,
                  { titleWithIcons: title, title: filterAndTrimStrings(title) },
                ]);

              const isFirstSection = index === 0;
              index++;
              return createElement(
                type,
                {
                  id:
                    title && title instanceof Array
                      ? filterAndTrimStrings(title)
                      : "others",
                  ...props,
                  style: { paddingTop: "10px" },
                  className: isFirstSection ? "first_section" : "",
                },
                ...children
              );
            }

            if (type === "iframe") {
              return (
                <iframe
                  {...props}
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                    // @ts-ignore
                    ...(props?.style ?? {}),
                  }}
                />
              );
            }

            if (type === "blockquote") {
              return createElement(
                type,
                {
                  ...props,
                  // @ts-ignore
                  className: "minerva-blockquote-1 " + (props?.className ?? ""),
                },
                ...children
              );
            }

            return createElement(type, props, ...children);
            // return <div>Create Element</div>;
          },
          cloneElement(element, props, ...children) {
            return <div>Clone Element</div>;
          },
          isValidElement(element) {
            return true;
          },
        },
      });
      setElements(content);
    }
  }, [post?.content]);

  function handleBookMark(bookmarked: boolean) {
    if (!post?.id || !user?.uid) return;
    const oldState = isBookMarked;
    setIsBookMarked(bookmarked);
    try {
      const docRef = doc(db, "users", user.uid, "bookmarks", post.id);
      if (bookmarked) {
        setDoc(docRef, {
          id: post.id,
          bookmarked_at: serverTimestamp(),
        });
      } else {
        deleteDoc(docRef);
      }
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
        url: "https://minerva.news/" + post?.id,
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
        <div className="absolute top-0 left-0 w-full h-full flex items-end justify-start pb-6 px-3">
          <p className="font-featureBold text-[25px] text-white line-clamp-3">
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
            <div className="pt-5 md:pt-0 md:pl-5 flex flex-col gap-6 justify-between">
              <div>
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
                  {/* <h2
                  className="text-[16px] font-bold font-featureHeadline"
                  style={{
                    fontVariationSettings: '"wght" 495,"opsz" 10',
                    fontWeight: 395,
                  }}
                >
                  Sign up for Minerva Principals:
                </h2>
                <p>What the White House is reading.</p>
                <Link href="#" className="underline">
                  Read it now.
                </Link> */}
                </div>
                {/* <div className="flex mt-1">
                <input
                  className="font-featureHeadline email_input"
                  placeholder="Your Email address"
                  type="text"
                  style={{
                    fontVariationSettings: '"wght" 400,"opsz" 10',
                    borderInlineEnd: 0,
                  }}
                />
                <button className="font-featureHeadline email_button">
                  Sign Up
                </button>
              </div> */}
                <SignUpForNewsLettersButton
                  containerClassName="flex mt-1"
                  checkedLetters={newsLettersList}
                />
              </div>
              {titles.length > 0 && (
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
                  {titles.map((titleMap, index) => (
                    <>
                      <hr className="border-dashed border-[#1f1d1a4d] my-2" />
                      <div
                        className="flex gap-2 items-center cursor-pointer"
                        onClick={() => {
                          router.push("#" + titleMap.title);
                        }}
                      >
                        {/* <Image
                        className="w-[20px] flex-shrink-0"
                        src={dotImage}
                        alt="i-image"
                      /> */}
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
                          {titleMap.titleWithIcons}
                        </h3>
                      </div>
                    </>
                  ))}
                  {/* <div className="flex gap-2 items-center">
                <Image
                  className="w-[20px] flex-shrink-0"
                  src={iImage}
                  alt="i-image"
                />
                <h3
                  className="text-[#1f1d1a] text-[16px] font-featureHeadline"
                  style={{
                    fontWeight: 400,
                    fontVariationSettings: '"wght" 500,"opsz" 10',
                  }}
                >
                  The News
                </h3>
              </div>
              <hr className="border-dashed border-[#1f1d1a4d] my-2" />
              <div className="flex gap-2 items-center">
                <Image
                  className="w-[20px] flex-shrink-0"
                  src={dotImage}
                  alt="i-image"
                />
                <h3
                  className="text-[#1f1d1a] text-[16px] font-featureHeadline"
                  style={{
                    fontWeight: 400,
                    fontVariationSettings: '"wght" 500,"opsz" 10',
                  }}
                >
                  Kadia&apos;s View
                </h3>
              </div>
              <hr className="border-dashed border-[#1f1d1a4d] my-2" />
              <div className="flex gap-2 items-center">
                <Image
                  className="w-[20px] flex-shrink-0"
                  src={notableImage}
                  alt="i-image"
                />
                <h3
                  className="text-[#1f1d1a] text-[16px] font-featureHeadline"
                  style={{
                    fontWeight: 400,
                    fontVariationSettings: '"wght" 500,"opsz" 10',
                  }}
                >
                  Notable
                </h3>
              </div> */}
                </div>
              )}
            </div>
          </div>
          <hr className="border-dashed border-[#1f1d1a4d] mt-[20px]" />
          <hr className="border-dashed border-[#1f1d1a4d] mt-[1px]" />
          <MathJaxContext>
            <div className="w-full py-2 mt-5 no-preflight blog-post-container jodit-table">
              <MathJax>{hasPost && elements}</MathJax>
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
          <div>
            <Image alt="Minerva" src={minervaMiniImage} className="w-[16px]" />
            <hr className="border-dashed border-[#1f1d1a4d] mt-[10px]" />
            <hr className="border-dashed border-[#1f1d1a4d] mt-[1px]" />
          </div>
          <MoreFromMinerva />
          <DeletePostModalRef post={post as Post} ref={deleteModalRef} />
        </div>
      </div>
    </main>
  );
}

const obj = {
  posts: [
    [
      { id: 1, content: "Hello" },
      { id: 2, content: "World" },
    ],
    [
      { id: 3, content: "Hello" },
      { id: 4, content: "World" },
    ],
    [
      { id: 5, content: "Hello" },
      { id: 6, content: "World" },
    ],
    [
      { id: 7, content: "Hello" },
      { id: 8, content: "World" },
    ],
  ],
};
