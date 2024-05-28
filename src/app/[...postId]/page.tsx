"use client";

import { useGetPostById } from "@/api/post";
import Navbar, { NavbarMobile } from "@/components/Navbar/Navbar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { Highlight, themes } from "prism-react-renderer";
import { useEffect, useState } from "react";

export default function PostId() {
  const isTabletScreen = useMediaQuery({ query: "(max-width: 1024px)" });
  const params = useParams();
  const { data: post, isFetching } = useGetPostById(params.postId[0] as string);
  const [elements, setElements] = useState<any[]>([]);

  const hasPost = post && !isFetching;
  const hasNoPost = !post && !isFetching;

  useEffect(() => {
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
                      {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                          {/* <span>{i + 1}</span> */}
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                        </div>
                      ))}
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

  console.log("elements - ", elements);

  return (
    <main className="h-screen overflow-auto max-w-[900px] mx-auto">
      {isTabletScreen ? <NavbarMobile /> : <Navbar />}
      <div className="w-full max-w-[1440px] mx-auto py-2 px-3 mt-5">
        {isFetching && (
          <div className="my-10 text-sm text-center">Loading...</div>
        )}
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
        {hasNoPost && (
          <div className="my-10 text-xl text-center text-red-500 uppercase">
            Post not found,{" "}
            <span className="underline text-appBlue">
              <Link href="/">Go back</Link>
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
