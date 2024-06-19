"use client";

import { useGetPostById } from "@/api/post";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { Highlight, themes } from "prism-react-renderer";
import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import Image from "next/image";
import { avatar, dotImage, iImage, imageOne, notableImage } from "@/assets";
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
import { db } from "@/lib/firebase";
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

function filterAndTrimStrings(arr: any[]) {
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

export default function BlogPost({ _post }: { _post?: DocumentData }) {
  const params = useParams();
  const [elements, setElements] = useState<any>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [copied, setCopied] = useState(false);
  const pageTimeSpent = usePageTime();
  const { user } = useUser();
  const readDoc = useRef(false);
  const [isBookMarked, setIsBookMarked] = useState(false);
  const { ref, isInView } = useInView();
  const [titles, setTitles] = useState<
    { titleWithIcons: any; title: string }[]
  >([]);
  const router = useRouter();
  const { isTabletScreen, isDesktopScreen, isMobileScreen } = useScreenSize();

  useEffect(() => {
    if (_post) {
      console.log("Reading time - ", readingTime(_post.content));
      setPost(
        new Post(
          _post.title,
          _post.content,
          _post.author,
          _post.topic,
          _post.id,
          _post.timestamp
        )
      );
    } else {
      setPost(null);
    }
  }, [_post]);

  const hasPost = post;
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
          if (el.textContent?.trim() !== "") {
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
                  className="mx-auto max-w-full max-h-[500px] flex items-center justify-center"
                  // @ts-ignore
                  src={props.src}
                  imageProps={{
                    className: "max-h-[500px] object-contain max-w-full",
                  }}
                />
              );
            }

            if (type === "section") {
              let title = children[0]
                .find((c: any) => c.props?.className?.includes("styles_title"))
                ?.props?.children.find((c: any) => c.type === "h2")
                .props.children;

              title &&
                setTitles((prev) => [
                  ...prev,
                  { titleWithIcons: title, title: filterAndTrimStrings(title) },
                ]);

              console.log("title | |||| - ", title);

              const isFirstSection = index === 0;
              index++;
              return createElement(
                type,
                {
                  id: filterAndTrimStrings(title),
                  ...props,
                  style: { paddingTop: "10px" },
                  className: isFirstSection ? "first_section" : "",
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
        url: "https://pustack-blog.vercel.app/" + post?.id,
      };
      await navigator.share(shareData);
      console.log("Successfully shared");
    } catch (err) {
      console.error("Error: " + err);
    }
  }

  return (
    <main className="max-w-[1440px] min-h-screen mx-auto md:px-2">
      <Navbar />
      {!isInView && post && !isMobileScreen && (
        <BlogPostStickyNavbar post={post} />
      )}
      <div className="px-3 pb-10">
        <div
          ref={ref}
          className="grid divide-y max-w-[900px] mx-auto md:divide-y-0 md:divide-x divide-dashed divide-[#1f1d1a4d] grid-cols-1 md:grid-cols-[2fr_1fr] my-6"
        >
          <div className="pb-5 md:pb-0 md:pr-5">
            <div className="flex items-end justify-between">
              <div className="mr-2">
                <img
                  className="w-[38px] h-[38px]"
                  src={
                    post?.author?.photoURL ? post.author.photoURL : avatar.src
                  }
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
                {post?.content && (
                  <span className="text-[13px] text-[#53524c] font-helvetica leading-[14px]">
                    {readingTime(post?.content).text}
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
              </div>
            </div>
            <hr className="border-dashed border-[#1f1d1a4d] my-2" />
            <div className="flex gap-5 items-center justify-between">
              <div className="flex gap-x-8 gap-y-2 items-center flex-wrap">
                <p className="text-[13px] text-[#53524c] font-helvetica leading-[14px]">
                  {/* Updated May 29, 2024, 3:10 am GMT+5:30 {''} */}
                  Updated{" "}
                  {dayjs(post?.timestamp).format("MMM DD, YYYY, H:mm a") +
                    " " +
                    " GMT " +
                    dayjs(post?.timestamp).format("Z")}
                </p>
                <p
                  className="text-[13px] text-[#53524c] font-helvetica uppercase leading-[14px]"
                  style={
                    {
                      // fontWeight: "300",
                      // fontVariationSettings: '"wght" 400,"opsz" 10',
                    }
                  }
                >
                  {post?.topic}
                </p>
              </div>
              {typeof navigator?.canShare === "function" &&
                navigator?.canShare() && (
                  <div
                    className="flex gap-2 items-center"
                    onClick={handleShare}
                  >
                    <button className="text-[13px] font-helvetica font-bold text-appBlue underline uppercase leading-[1px]">
                      Share
                    </button>
                    <HiOutlineExternalLink className="text-appBlue" />
                  </div>
                )}
            </div>
            <div className="mt-4">
              <h2
                className="font-featureHeadline line-clamp-2 leading-[120%] group-hover:text-appBlue bg-animation group-hover:bg-hover-animation"
                style={{
                  fontSize: "32px",
                  fontWeight: "395",
                  fontVariationSettings: '"wght" 495,"opsz" 10',
                }}
              >
                {post?.snippetData?.title}
              </h2>
              {/* <figure className="mt-4 w-[70%]">
              <img
                src={
                  post?.snippetData?.image
                    ? post?.snippetData?.image
                    : imageOne.src
                }
                alt="Image One"
              /> 
              </figure> */}
              <BlogImage
                className="mt-4 w-[70%]"
                src={
                  post?.snippetData?.image
                    ? post?.snippetData?.image
                    : imageOne.src
                }
              />
              {post && (
                <BlogPostShareLinks post={post} appendClassName="mt-4" />
              )}
            </div>
          </div>
          <div className="pt-5 md:pt-0 md:pl-5 flex flex-col gap-6 justify-between">
            <div>
              <div className="py-1">
                <p className="font-featureHeadline style_intro leading-[120%]">
                  <b className="style_bold">Sign up for Minerva Principals:</b>
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
                        className="text-[#1f1d1a] text-[16px] font-featureHeadline"
                        style={{
                          fontWeight: 400,
                          fontVariationSettings: '"wght" 500,"opsz" 10',
                          alignItems: "center",
                          gap: "4px",
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

        {/* <hr className="border-dashed border-[#1f1d1a4d] mt-2" />
        <hr className="border-dashed border-[#1f1d1a4d] mt-[1px]" /> */}

        <MathJaxContext>
          <div className="w-full max-w-[720px] mx-auto py-2 mt-5 no-preflight blog-post-container">
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
        {post?.topic && (
          <div className="max-w-[720px] w-full mx-auto">
            <MoreFromMinerva category={post?.topic} />
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
