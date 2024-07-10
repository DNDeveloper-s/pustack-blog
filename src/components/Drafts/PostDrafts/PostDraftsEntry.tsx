"use client";

import { useQueryDraftPosts } from "@/api/post";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/shared/Footer";
import { Post } from "@/firebase/post-v2";
import PostDraftItem from "./PostDraftItem";

export default function PostDraftsEntry({
  _serverPosts,
}: {
  _serverPosts: any;
}) {
  const { data: drafts } = useQueryDraftPosts({
    initialData: _serverPosts.map((data: any) => {
      return new Post(
        data.title,
        data.author,
        data.topic,
        data.sections,
        data.id,
        data.timestamp,
        data.position,
        data.design,
        data.displayTitle,
        data.displayContent,
        data.is_v2
      );
    }),
  });

  return (
    <div className="max-w-[1440px] w-screen overflow-auto px-3 mx-auto">
      <Navbar />
      <div className="py-10 min-h-[calc(100vh-150px)]">
        <div>
          <h2 className="text-appBlack text-[30px] font-larkenExtraBold">
            Drafts
          </h2>
        </div>
        <div>
          {drafts.map((post: Post) => (
            <PostDraftItem key={post.id} post={post} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
