"use client";

import { useGetPostById } from "@/api/post";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PostId() {
  const params = useParams();
  const { data: post, isFetching } = useGetPostById(params.postId[0] as string);

  const hasPost = post && !isFetching;
  const hasNoPost = !post && !isFetching;

  return (
    <main className="h-screen overflow-auto">
      <Navbar />
      <div className="w-full max-w-[1100px] mx-auto py-2 px-3">
        {isFetching && (
          <div className="my-10 text-sm text-center">Loading...</div>
        )}
        {hasPost && (
          <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
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
