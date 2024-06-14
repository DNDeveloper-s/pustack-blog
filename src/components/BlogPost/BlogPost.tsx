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
import { FaStar } from "react-icons/fa6";
import BlogImage, { BlogImageDefault } from "../shared/BlogImage";
import { HiOutlineExternalLink } from "react-icons/hi";
import SignUpForNewsLettersButton from "../shared/SignUpForNewsLettersButton";
import { newsLettersList } from "../SignUpForNewsLetters/SignUpForNewsLetters";

export default function BlogPost({ _post }: { _post?: DocumentData }) {
  const isTabletScreen = useMediaQuery({ query: "(max-width: 1024px)" });
  const params = useParams();
  const [elements, setElements] = useState<any>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [copied, setCopied] = useState(false);
  const pageTimeSpent = usePageTime();
  const { user } = useUser();
  const readDoc = useRef(false);
  const [isBookMarked, setIsBookMarked] = useState(false);
  const [titles, setTitles] = useState<string[]>([]);
  const router = useRouter();

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
              console.log("Pre - ", props, children[0][0]);
              return (
                <Highlight
                  theme={themes.oneDark}
                  code={children[0][0]}
                  language="tsx"
                >
                  {({
                    className,
                    style,
                    tokens,
                    getLineProps,
                    getTokenProps,
                  }) => {
                    console.log("tokens - ", tokens);
                    return (
                      <pre
                        style={{
                          ...style,
                          width: "100%",
                          overflow: "auto",
                          padding: "10px",
                          borderRadius: "10px",
                        }}
                      >
                        <code style={{ fontSize: "14px" }}>
                          {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line })}>
                              {/* <span>{i + 1}</span> */}
                              {line.map((token, key) => (
                                <span key={key} {...getTokenProps({ token })} />
                              ))}
                            </div>
                          ))}
                        </code>
                      </pre>
                    );
                  }}
                </Highlight>
              );
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
              const title = children[0]
                .find((c: any) => c.props?.className?.includes("styles_title"))
                ?.props?.children.find((c: any) => c.type === "h2")
                .props.children;
              title && setTitles((prev) => [...prev, title]);

              const isFirstSection = index === 0;
              index++;
              return createElement(
                type,
                {
                  id: title,
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
      <div className="max-w-[900px] mx-auto px-3">
        <div className="grid divide-y md:divide-y-0 md:divide-x divide-dashed divide-[#1f1d1a4d] grid-cols-1 md:grid-cols-[2fr_1fr] my-6">
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
                  POLITICS
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
              <div className="mt-4 flex gap-6 items-center">
                <Link
                  href={`https://twitter.com/intent/tweet?url=${
                    "https://pustack-blog.vercel.app/" + post?.id
                  }&text=${post?.snippetData?.title}`}
                  target="_blank"
                >
                  <div className="flex gap-1 items-center">
                    <svg
                      width="20"
                      height="16"
                      viewBox="0 0 20 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      // style="width:1.25rem;height:0.9375rem;margin-bottom:0.125rem"
                    >
                      <path
                        d="M10.5119 7.1067L14.4715 2.16666H13.5332L10.0951 6.45603L7.34905 2.16666H4.18182L8.33437 8.65294L4.18182 13.8333H5.12018L8.75095 9.30362L11.651 13.8333H14.8182L10.5117 7.1067H10.5119ZM9.2267 8.71009L8.80596 8.0642L5.45828 2.92481H6.89955L9.60116 7.07246L10.0219 7.71835L13.5337 13.1097H12.0924L9.2267 8.71034V8.71009Z"
                        fill="#53524C"
                      ></path>
                    </svg>
                    <span className="text-[13px] font-helvetica">Post</span>
                  </div>
                </Link>
                <Link
                  href={`mailto:?subject=${post?.snippetData?.title}&body=${
                    "https://pustack-blog.vercel.app/" + post?.id
                  }`}
                  target="_blank"
                >
                  <div className="flex gap-1 items-center">
                    <svg
                      width="20"
                      height="15"
                      viewBox="0 0 20 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      // style="width:1.25rem;height:0.9375rem;margin-bottom:0.125rem"
                    >
                      <rect
                        width="20"
                        height="14"
                        transform="translate(0 0.740479)"
                        fill="none"
                      ></rect>
                      <path
                        d="M4 3.74048V11.7405H16V3.74048M4 3.74048H16M4 3.74048L10 8.74048L16 3.74048"
                        stroke="currentColor"
                        strokeWidth="0.75"
                      ></path>
                    </svg>
                    <span className="text-[13px] font-helvetica">Email</span>
                  </div>
                </Link>
                {/* https://wa.me/?text=The%20subtle%20reason%20why%20Donald%20Trump%E2%80%99s%20conviction%20might%20matter%20to%20voters%20https%3A%2F%2Fwww.semafor.com%2Farticle%2F05%2F30%2F2024%2Ftrump-guilty-verdict-election-impact */}
                <Link
                  href={`https://wa.me/?text=${post?.snippetData?.title} ${
                    "https://pustack-blog.vercel.app/" + post?.id
                  }`}
                  target="_blank"
                >
                  <div className="flex gap-1 items-center">
                    <svg
                      width="20"
                      height="15"
                      viewBox="0 0 20 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      // style="width:1.25rem;height:0.9375rem;margin-bottom:0.125rem"
                    >
                      <rect
                        width="20"
                        height="14"
                        transform="translate(0 0.740479)"
                        fill="none"
                      ></rect>
                      <path
                        d="M4 13.4868L4.84277 10.3559C4.1631 9.13632 3.94716 7.71313 4.23458 6.34752C4.522 4.98191 5.2935 3.76548 6.40751 2.92146C7.52151 2.07744 8.90331 1.66244 10.2993 1.7526C11.6953 1.84277 13.0119 2.43206 14.0075 3.41234C15.0031 4.39261 15.6109 5.69812 15.7193 7.0893C15.8278 8.48048 15.4296 9.86401 14.5979 10.986C13.7662 12.108 12.5568 12.8932 11.1915 13.1976C9.82628 13.5019 8.39679 13.3049 7.16536 12.6428L4 13.4868ZM7.31799 11.4713L7.51375 11.5871C8.4057 12.1144 9.44748 12.3326 10.4767 12.2077C11.506 12.0828 12.4649 11.6218 13.2041 10.8966C13.9433 10.1713 14.4212 9.22252 14.5633 8.19807C14.7054 7.17361 14.5038 6.13104 13.9898 5.23281C13.4759 4.33459 12.6785 3.63117 11.7219 3.23218C10.7653 2.83319 9.70327 2.76103 8.70128 3.02696C7.69929 3.29289 6.81363 3.88196 6.18232 4.70237C5.55102 5.52279 5.20953 6.52846 5.21107 7.56268C5.21023 8.42021 5.44799 9.26115 5.89789 9.99189L6.02066 10.1938L5.5495 11.9412L7.31799 11.4713Z"
                        fill="currentColor"
                      ></path>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.0693 8.3666C11.9545 8.27427 11.8201 8.20929 11.6764 8.1766C11.5326 8.14391 11.3833 8.14437 11.2398 8.17795C11.0241 8.26731 10.8847 8.60488 10.7454 8.77367C10.716 8.81413 10.6728 8.84251 10.6239 8.85348C10.5751 8.86445 10.5239 8.85725 10.4799 8.83324C9.69037 8.52478 9.02855 7.95911 8.60196 7.22811C8.56558 7.18249 8.54836 7.12457 8.55393 7.06655C8.5595 7.00852 8.58742 6.95491 8.63182 6.91701C8.78725 6.76354 8.90137 6.57344 8.96362 6.36432C8.97745 6.13365 8.92446 5.90388 8.811 5.70241C8.72327 5.41996 8.55633 5.16845 8.32989 4.97761C8.21309 4.92522 8.0836 4.90765 7.95702 4.92703C7.83044 4.94641 7.71218 5.00191 7.61652 5.08683C7.45044 5.22975 7.31862 5.40801 7.23077 5.60848C7.14291 5.80895 7.10125 6.02652 7.10887 6.24517C7.10938 6.36796 7.12498 6.49022 7.15532 6.60922C7.23236 6.89514 7.35085 7.1683 7.50702 7.42006C7.6197 7.61292 7.74264 7.79962 7.87532 7.97938C8.30651 8.5698 8.84852 9.07109 9.47128 9.45544C9.78378 9.65075 10.1178 9.80955 10.4667 9.9287C10.8291 10.0926 11.2293 10.1555 11.6247 10.1107C11.8499 10.0767 12.0634 9.988 12.2462 9.85238C12.429 9.71676 12.5756 9.5384 12.6731 9.33298C12.7304 9.2089 12.7478 9.07017 12.7229 8.93584C12.6632 8.66115 12.2949 8.49898 12.0693 8.3666Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    <span className="text-[13px] font-helvetica">Whatsapp</span>
                  </div>
                </Link>
                {!copied ? (
                  <div
                    className="flex gap-1 items-center cursor-pointer"
                    onClick={() => {
                      navigator.clipboard
                        .writeText(
                          "https://pustack-blog.vercel.app/" + post?.id
                        )
                        .then(
                          () => {
                            setCopied(true);
                            console.log(
                              "Async: Copying to clipboard was successful!"
                            );
                          },
                          (err) => {
                            console.error("Async: Could not copy text: ", err);
                          }
                        );
                    }}
                  >
                    <svg
                      width="20"
                      height="15"
                      viewBox="0 0 20 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      // style="width:1.25rem;height:0.9375rem;margin-bottom:0.125rem"
                    >
                      <rect
                        width="20"
                        height="14"
                        transform="translate(0 0.740479)"
                        fill="none"
                      ></rect>
                      <path
                        d="M7.51897 12.7405C7.05362 12.7405 6.62873 12.6277 6.24431 12.402C5.87001 12.1661 5.56651 11.8584 5.33384 11.4789C5.11128 11.0892 5 10.6584 5 10.1866C5 9.71484 5.11128 9.2892 5.33384 8.90971C5.56651 8.51997 5.87001 8.21227 6.24431 7.98663C6.62873 7.75074 7.05362 7.63279 7.51897 7.63279C7.77188 7.63279 8.01467 7.67381 8.24734 7.75586C8.49014 7.82766 8.72281 7.94048 8.94537 8.09432L10.3566 6.66356C10.2251 6.46868 10.1239 6.25843 10.0531 6.03279C9.99241 5.79689 9.96206 5.55074 9.96206 5.29432C9.96206 4.83279 10.0733 4.40715 10.2959 4.0174C10.5286 3.62766 10.8321 3.31997 11.2064 3.09432C11.5908 2.85843 12.0157 2.74048 12.481 2.74048C12.9464 2.74048 13.3662 2.85843 13.7405 3.09432C14.1249 3.31997 14.4284 3.62766 14.651 4.0174C14.8837 4.40715 15 4.83279 15 5.29432C15 5.75586 14.8837 6.1815 14.651 6.57125C14.4284 6.96099 14.1249 7.27381 13.7405 7.50971C13.3662 7.73535 12.9464 7.84817 12.481 7.84817C12.218 7.84817 11.9651 7.81227 11.7223 7.74048C11.4795 7.65843 11.2418 7.53535 11.0091 7.37125L9.61305 8.78663C9.75468 8.99176 9.8609 9.21227 9.93171 9.44817C10.0025 9.68407 10.0379 9.93022 10.0379 10.1866C10.0379 10.6482 9.9216 11.0738 9.68892 11.4636C9.46636 11.8533 9.16287 12.1661 8.77845 12.402C8.40415 12.6277 7.98432 12.7405 7.51897 12.7405ZM7.51897 11.7866C7.80223 11.7866 8.06019 11.7148 8.29287 11.5712C8.53566 11.4277 8.72787 11.2328 8.8695 10.9866C9.02124 10.7405 9.09712 10.4738 9.09712 10.1866C9.09712 9.8892 9.02124 9.62253 8.8695 9.38663C8.72787 9.14048 8.53566 8.94561 8.29287 8.80202C8.06019 8.65843 7.80223 8.58663 7.51897 8.58663C7.24583 8.58663 6.98786 8.65843 6.74507 8.80202C6.50228 8.94561 6.30501 9.14048 6.15326 9.38663C6.01163 9.62253 5.94082 9.8892 5.94082 10.1866C5.94082 10.4738 6.01163 10.7405 6.15326 10.9866C6.29489 11.2225 6.4871 11.4174 6.72989 11.5712C6.97269 11.7148 7.23571 11.7866 7.51897 11.7866ZM12.481 6.89432C12.7643 6.89432 13.0223 6.82253 13.2549 6.67894C13.4977 6.53535 13.6899 6.34048 13.8316 6.09432C13.9833 5.84817 14.0592 5.5815 14.0592 5.29432C14.0592 5.0174 13.9884 4.75586 13.8467 4.50971C13.7051 4.26356 13.5129 4.06868 13.2701 3.92509C13.0374 3.77125 12.7744 3.69433 12.481 3.69433C12.1978 3.69433 11.9347 3.77125 11.692 3.92509C11.4492 4.06868 11.257 4.26356 11.1153 4.50971C10.9737 4.74561 10.9029 5.00715 10.9029 5.29432C10.9029 5.5815 10.9737 5.84817 11.1153 6.09432C11.2671 6.34048 11.4593 6.53535 11.692 6.67894C11.9347 6.82253 12.1978 6.89432 12.481 6.89432Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    <span className="text-[13px] font-helvetica">
                      Copy link
                    </span>
                  </div>
                ) : (
                  <div className="flex gap-1 items-center cursor-default">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={14}
                      fill="none"
                      style={{
                        width: "1.25rem",
                        height: ".9375rem",
                        marginBottom: ".125rem",
                      }}
                    >
                      <path d="M0 0h20v14H0z" />
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="m14 4-6.21 6L5 7.304"
                      />
                    </svg>
                    <span className="text-[13px] font-helvetica">
                      Link Copied
                    </span>
                  </div>
                )}
              </div>
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
                {titles.map((title, index) => (
                  <>
                    <hr className="border-dashed border-[#1f1d1a4d] my-2" />
                    <div
                      className="flex gap-2 items-center cursor-pointer"
                      onClick={() => {
                        router.push("#" + title);
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
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {title}
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
          <div className="w-full max-w-[1440px] mx-auto py-2 mt-5 no-preflight blog-post-container">
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
      </div>
    </main>
  );
}

const str = `
<section class="">
                    <div class="styles_divider"><br></div>
                    <div class="styles_title">
                      <h2><span style="display: inline-flex;"><img src="https://pustack-blog.vercel.app/assets/images/svgs/network.svg" alt="icon" style="height: 16px; width: auto; display: inline;"></span> Scoop</h2>
                    </div>
                    <div class="styles_text">
                      <p>If you’ve ever read a blog post, you’ve consumed content from a thought leader that is an expert in their <span style="color: rgb(0, 0, 255);">industry</span>. Chances are if the blog post was written effectively, you came away with helpful knowledge and a positive opinion about the writer or brand that produced the content.&nbsp;</p><p>Anyone can connect with their audience through blogging and enjoy the myriad benefits that <span style="color: rgb(0, 0, 255);">blogging</span> provides: organic traffic from search engines, promotional content for social media, and recognition from a new audience you haven’t tapped into yet.</p><p>If you’ve heard about blogging but are a beginner and don’t know where to start, the time for excuses is over. Not only can you&nbsp;create an SEO-friendly blog, but I’ll cover <em><u>how to write and manage your business's blog</u></em> as well as provide helpful templates to simplify your blogging efforts.</p><p><br></p><p><img class="blog-image" src="https://firebasestorage.googleapis.com/v0/b/minerva-0000.appspot.com/o/images%2FScreenshot%202024-06-14%20at%201.22.47%E2%80%AFPM.png?alt=media&amp;token=c1847f19-db07-4ef1-ab6b-946e3cad0b58" alt="image" style="display: block; margin-left: auto; margin-right: auto;"></p>
                    </div>
                  </section><section class="">
                    <div class="styles_divider"><br></div>
                    <div class="styles_title">
                      <h2><span style="display: inline-flex;"><img src="https://pustack-blog.vercel.app/assets/images/svgs/bulb.svg" alt="icon" style="height: 16px; width: auto; display: inline;"></span> HOW TO write a blog post</h2>
                    </div>
                    <div class="styles_text">
                      <ol><li>Understand your audience.</li><li>Check out your competition.</li><li>Determine what topics you'll cover.</li><li>Identify your unique angle.</li><li>Name your blog.</li><li>Create your blog domain.</li><li>Choose a CMS and set up your blog.</li><li>Customize the look of your blog.</li><li>Write your first blog post.  </li></ol><p><br></p>
                    <br></div>
                  </section><section class="">
                    <div class="styles_divider"><br></div>
                    <div class="styles_title">
                      <h2><span style="display: inline-flex;"><img src="https://pustack-blog.vercel.app/assets/images/svgs/github.svg" alt="icon" style="height: 16px; width: auto; display: inline;"></span> CODE</h2>
                    </div>
                    <div class="styles_text">
                      <p>This is an example of useEffect.</p><pre>useEffect(() =&gt; {
    if (post?.content) {
      let index = 0;
      let firstContentEncountered = false;
      const parser = new DOMParser();
      const doc = parser.parseFromString(post?.content, "text/html");
      const body = doc.body;
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
        nodes.forEach((node) =&gt; container.appendChild(node.cloneNode(true)));
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
              console.log("Pre - ", props, children[0][0]);
              return (
                <highlight theme="{themes.oneDark}" code="{children[0][0]}" language="tsx">
                  {({
                    className,
                    style,
                    tokens,
                    getLineProps,
                    getTokenProps,
                  }) =&gt; {
                    console.log("tokens - ", tokens);
                    return (
                                              <code style="{{" fontsize:="" "14px"="" }}="">
                          {tokens.map((line, i) =&gt; (
                            <div key="{i}" {...getlineprops({="" line="" })}="">
                              {/* <span>{i + 1}</span> */}
                              {line.map((token, key) =&gt; (
                                <span key="{key}" {...gettokenprops({="" token="" })}="">
                              ))}
                            </span></div>
                          ))}
                        </code>
                      
                    );
                  }}
                </highlight>
              );
            }

            if (
              type === "img" &amp;&amp;
              // @ts-ignore
              props?.className?.includes("blog-image")
            ) {
              return (
                <blogimagedefault classname="mx-auto max-w-full max-h-[500px] flex items-center justify-center" @ts-ignore="" src="{props.src}" imageprops="{{" classname:="" "max-h-[500px]="" object-contain="" max-w-full",="" }}="">
              );
            }

            if (type === "section") {
              const title = children[0]
                .find((c: any) =&gt; c.props?.className?.includes("styles_title"))
                ?.props?.children.find((c: any) =&gt; c.type === "h2")
                .props.children;
              title &amp;&amp; setTitles((prev) =&gt; [...prev, title]);

              const isFirstSection = index === 0;
              index++;
              return createElement(
                type,
                {
                  id: title,
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
  }, [post?.content]);<br></blogimagedefault></pre><p><br></p><p><br></p><p><br></p><p><br></p>
                    </div>
                  </section><section class="">
                    <div class="styles_divider"><br></div>
                    <div class="styles_title">
                      <h2><span style="display: inline-flex;"><img src="https://pustack-blog.vercel.app/assets/images/svgs/youtube.svg" alt="icon" style="height: 16px; width: auto; display: inline;"></span> Detailed ViDEO</h2>
                    </div>
                    <div class="styles_text">
                      <p>PuStack provides answers to all the questions like what is maths? How is it solved? What are the general tips? and much more. For written PDF solutions, and lectures on all the topics of <span style="color: rgb(255, 0, 255);">Class 9 </span>and <span style="color: rgb(255, 0, 255);">Class 10,</span> download the PuStack app.</p><p><br></p><p><iframe width="567px" height="351px" src="https://www.youtube.com/embed/1SccVele8VA" frameborder="0" allowfullscreen="" style="display: block; margin-left: auto; margin-right: auto;"></iframe></p><p><br></p><p><br></p>
                    </div>
                  </section><section class="">
                    <div class="styles_divider"><br></div>
                    <div class="styles_title">
                      <h2><span style="display: inline-flex;"><img src="https://pustack-blog.vercel.app/assets/images/svgs/formula.svg" alt="icon" style="height: 16px; width: auto; display: inline;"></span> Maths Formula</h2>
                    </div>
                    <div class="styles_text">
                      <p>LaTeX is capable of displaying any mathematical notation. It’s possible to typeset integrals, fractions and more. Every command has a specific syntax to use. I will demonstrate some of the most common LaTeX math features:</p><p><br></p><p style="text-align: center;"><math xmlns="http://www.w3.org/1998/Math/MathML">
  <mtable columnalign="right left right left right left right left right left right left" rowspacing="3pt" columnspacing="0em 2em 0em 2em 0em 2em 0em 2em 0em 2em 0em" displaystyle="true">
    <mtr>
      <mtd>
        <mi>f</mi>
        <mo stretchy="false">(</mo>
        <mi>x</mi>
        <mo stretchy="false">)</mo>
      </mtd>
      <mtd>
        <mi></mi>
        <mo>=</mo>
        <msup>
          <mi>x</mi>
          <mn>2</mn>
        </msup>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi>g</mi>
        <mo stretchy="false">(</mo>
        <mi>x</mi>
        <mo stretchy="false">)</mo>
      </mtd>
      <mtd>
        <mi></mi>
        <mo>=</mo>
        <mfrac>
          <mn>1</mn>
          <mi>x</mi>
        </mfrac>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi>F</mi>
        <mo stretchy="false">(</mo>
        <mi>x</mi>
        <mo stretchy="false">)</mo>
      </mtd>
      <mtd>
        <mi></mi>
        <mo>=</mo>
        <msubsup>
          <mo>∫<!-- ∫ --></mo>
          <mi>b</mi>
          <mi>a</mi>
        </msubsup>
        <mfrac>
          <mn>1</mn>
          <mn>3</mn>
        </mfrac>
        <msup>
          <mi>x</mi>
          <mn>3</mn>
        </msup>
      </mtd>
    </mtr>
  </mtable>
</math></p><p><br></p><p><br></p><p><br></p>
                    </div>
                  </section><section class="">
                    <div class="styles_divider"><br></div>
                    <div class="styles_title">
                      <h2><span style="display: inline-flex;"><img src="https://pustack-blog.vercel.app/assets/images/svgs/network.svg" alt="icon" style="height: 16px; width: auto; display: inline;"></span> Table</h2>
                    </div>
                    <div class="styles_text">
                      <p>The&nbsp;align&nbsp;environment will align the equations at the&nbsp;ampersand &amp;. Single equations have to be&nbsp;seperated&nbsp;by a&nbsp;linebreak \\. There is no alignment when using the simple&nbsp;<span style="background-color: rgb(106, 168, 79); color: rgb(255, 255, 255);">equation&nbsp;environment</span>. Furthermore it is not even possible to enter two equations in that environment, it will result in a&nbsp;compilation error. The asterisk (e.g. equation*) only indicates, that I don’t want the equations to be numbered.</p><table style="border-collapse:collapse;width: 100%;"><tbody>
<tr>
	<td style="width: 12.4769%;">Column 1.1</td><td style="width: 12.4769%;">Column 1.2</td>
	<td style="width: 25%;">Column 2</td>
	<td style="width: 25%;">Column 3</td>
	<td style="width: 25%;">Column 4</td></tr>
<tr>
	<td style="width: 25%; background-color: rgb(152, 0, 0); color: rgb(255, 255, 255);" colspan="2">Row 2</td>
	<td style="width: 25%;">Random Text</td>
	<td style="width: 25%;">Random Text</td>
	<td style="width: 25%;">Random Text</td></tr>
<tr>
	<td style="width: 25%;" colspan="2">Random Text</td>
	<td style="width: 25%;">Random Text</td>
	<td style="width: 25%;">Random Text</td>
	<td style="width: 25%;">Random Text</td></tr></tbody></table><p><br></p><p><br></p><p><br></p>
                    </div>
                  </section>
`;
