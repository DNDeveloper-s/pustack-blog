"use client";

import { useGetPostById } from "@/api/post";
import Navbar, { NavbarMobile } from "@/components/Navbar/Navbar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMediaQuery } from "react-responsive";

export default function PostId() {
  const isTabletScreen = useMediaQuery({ query: "(max-width: 1024px)" });
  const params = useParams();
  const { data: post, isFetching } = useGetPostById(params.postId[0] as string);

  const hasPost = post && !isFetching;
  const hasNoPost = !post && !isFetching;

  return (
    <main className="h-screen overflow-auto">
      {isTabletScreen ? <NavbarMobile /> : <Navbar />}
      <div className="w-full max-w-[1440px] mx-auto py-2 px-3 mt-5">
        {isFetching && (
          <div className="my-10 text-sm text-center">Loading...</div>
        )}
        {hasPost && (
          <div
            className="w-full article-dynamic-container"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
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
