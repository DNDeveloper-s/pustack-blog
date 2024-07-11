"use client";

import { useQueryDraftPosts, useQueryPosts } from "@/api/post";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/shared/Footer";
import { Post } from "@/firebase/post-v2";
import PostDraftItem from "./PostDraftItem";
import { Select } from "antd";
import { useEffect, useState } from "react";

const options = [
  { value: "draft", label: "Drafts" },
  { value: "published", label: "Published" },
  { value: "scheduled", label: "Scheduled" },
];

export default function PostDraftsEntry({
  _serverPosts,
}: {
  _serverPosts: any;
}) {
  const [filters, setFilters] = useState<{ status: string[] }>({
    status: ["draft"],
  });
  const {
    data: drafts,
    isLoading,
    error,
  } = useQueryPosts({
    initialData: _serverPosts.map((data: any) => {
      return new Post(
        data.title,
        data.author,
        data.topic,
        data.sections,
        data.status ?? "published",
        data.id,
        data.timestamp,
        data.position,
        data.design,
        data.displayTitle,
        data.displayContent,
        data.scheduledTime,
        data.is_v2
      );
    }),
    status: filters.status,
  });

  console.log("error - ", error);

  const handleChange = (value: string[]) => {
    setFilters({ status: value });
  };

  return (
    <div className="max-w-[1440px] w-screen overflow-auto px-3 mx-auto">
      <Navbar />
      <div className="py-10 min-h-[calc(100vh-150px)]">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-appBlack text-[30px] font-larkenExtraBold">
            Drafts
          </h2>
          <div className="min-w-[200px]">
            <Select
              value={filters.status}
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Tags Mode"
              onChange={handleChange}
              options={options}
            />
          </div>
        </div>
        {isLoading ? (
          <div>
            <p>Loading .... </p>
          </div>
        ) : (
          <div>
            {drafts?.map((post: Post) => (
              <PostDraftItem key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
