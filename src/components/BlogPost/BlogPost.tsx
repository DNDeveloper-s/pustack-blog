"use client";

import { useGetPostById } from "@/api/post";
import Navbar, { NavbarMobile } from "@/components/Navbar/Navbar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { Highlight, themes } from "prism-react-renderer";
import { useEffect, useMemo, useRef, useState } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import Image from "next/image";
import { avatar, dotImage, iImage, imageOne, notableImage } from "@/assets";
import dayjs from "dayjs";
import { Post } from "@/firebase/post";
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
import BlogImage from "../shared/BlogImage";

export default function BlogPost({ _post }: { _post?: DocumentData }) {
  const isTabletScreen = useMediaQuery({ query: "(max-width: 1024px)" });
  const params = useParams();
  const [elements, setElements] = useState<any[]>([]);
  const [post, setPost] = useState<Post | null>(null);
  const [copied, setCopied] = useState(false);
  const pageTimeSpent = usePageTime();
  const { user } = useUser();
  const readDoc = useRef(false);
  const [isBookMarked, setIsBookMarked] = useState(false);

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
    console.log("post- content changed");
    if (post?.content) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(post.content, "text/html");
      const arr = Array.from(doc.body.childNodes);
      const _elements = arr.reduce((acc: any, node) => {
        if (node.nodeName === "PRE") {
          // @ts-ignore
          const htmlContent = node.innerHTML.replace(/<br\s*\/?>/gi, "\n");
          const doc1 = document.createElement("div");
          doc1.innerHTML = htmlContent.trim();
          const code = doc1.textContent || doc1.innerText;

          acc.push({
            tsx: (
              <Highlight theme={themes.vsDark} code={code} language="tsx">
                {({
                  className,
                  style,
                  tokens,
                  getLineProps,
                  getTokenProps,
                }) => {
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
                      <code>
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
            ),
          });
        } else {
          // @ts-ignore
          acc.push(node.outerHTML);
        }
        return acc;
      }, []);

      setElements(_elements);
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

  return (
    <main className="max-w-[1440px] mx-auto md:px-2 px-3">
      {isTabletScreen ? <NavbarMobile /> : <Navbar />}
      <div className="max-w-[900px] mx-auto px-3">
        <div className="grid divide-y md:divide-y-0 md:divide-x divide-dashed divide-[#1f1d1a4d] grid-cols-1 md:grid-cols-[2fr_1fr] my-6">
          <div className="pb-5 md:pb-0 md:pr-5">
            <div className="flex items-center justify-between">
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
            <div className="flex gap-8 items-center">
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
                      setCopied(true);
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
          <div className="pt-5 md:pt-0 md:pl-5 flex flex-col justify-between">
            <div>
              <div className="py-1">
                <h2
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
                </Link>
              </div>
              <div className="flex mt-1">
                <input
                  className="border text-[16px] outline-black border-black flex-1 flex-shrink py-1 px-2 bg-lightPrimary focus:outline-appBlack focus:outline-offset-[-2]"
                  placeholder="Your Email address"
                  type="text"
                  style={{
                    fontVariationSettings: '"wght" 400,"opsz" 10',
                    borderInlineEnd: 0,
                  }}
                />
                <button className="outline-black border-black border text-[16px] py-1 px-3 whitespace-nowrap">
                  Sign Up
                </button>
              </div>
            </div>
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
              <hr className="border-dashed border-[#1f1d1a4d] my-2" />
              <div className="flex gap-2 items-center">
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
              </div>
            </div>
          </div>
        </div>

        <hr className="border-dashed border-[#1f1d1a4d] mt-2" />
        <hr className="border-dashed border-[#1f1d1a4d] mt-[1px]" />

        <MathJaxContext>
          <div className="w-full max-w-[1440px] mx-auto py-2 px-3 mt-5 no-preflight">
            {/* {isFetching && (
            <div className="my-10 text-sm text-center">Loading...</div>
          )} */}
            <MathJax>
              {hasPost &&
                elements.map((element, index) =>
                  element.tsx ? (
                    element.tsx
                  ) : (
                    <div
                      key={post.content + " - " + index}
                      className="w-full article-dynamic-container"
                      dangerouslySetInnerHTML={{ __html: element }}
                    ></div>
                  )
                )}
            </MathJax>
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
