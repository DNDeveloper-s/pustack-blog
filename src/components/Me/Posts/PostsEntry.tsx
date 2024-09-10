"use client";

import { useQueryDraftPosts, useQueryPosts } from "@/api/post";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/shared/Footer";
import { Post } from "@/firebase/post-v2";
import PostDraftItem, { PostItemHeader } from "./PostItem";
import { Select } from "antd";
import { SVGAttributes, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useInView from "@/hooks/useInView";
import { Spinner } from "@nextui-org/spinner";
import SortByModal, { SortBy } from "./SortByModal";
import FilterModal from "./FilterModal";
import { useUser } from "@/context/UserContext";
import { Dayjs } from "dayjs";
import useScreenSize from "@/hooks/useScreenSize";
import PostDraftItemDesktop, { PostItemDesktopHeader } from "./PostItemDesktop";

const options = [
  { value: "draft", label: "Drafts" },
  { value: "published", label: "Published" },
  { value: "scheduled", label: "Scheduled" },
];

export const NoPostIcon = (props: SVGAttributes<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 68 68"
    {...props}
  >
    <path
      d="M21.5 38.6c.3-.3.3-.8 0-1.1l-2.4-2.4 3.1-3.1c.3-.3.3-.8 0-1.1s-.8-.3-1.1 0L18 34l-2.8-2.8c-.3-.3-.8-.3-1.1 0s-.3.8 0 1.1l2.8 2.8-2.8 2.8c-.3.3-.3.8 0 1.1s.8.3 1.1 0l2.8-2.8 2.4 2.4c.4.3.8.3 1.1 0zm-.3 9.9c-.3.3-.3.8.1 1.1.3.3.8.3 1.1-.1 4.9-5.4 13.3-5.3 18.1-.3.3.3.8.3 1.1 0s.3-.8 0-1.1c-5.5-5.6-14.9-5.7-20.4.4z"
      data-original="#000000"
    />
    <path
      d="M58.6 54.5 61.2 28c.1-1.1-.3-2.2-1-3s-1.8-1.3-2.9-1.3v-6.9c0-2.6-2-4.7-4.6-4.8l-42.1-.6c-2.7 0-4.7 2.1-4.8 4.6v1.8c-1.2.3-2.1 1.1-2.6 2.3-.6.7-1 1.6-1.2 2.3-.5 1.8-.4 3.7-.2 5.6.8 8.8 1.6 17.5 2.3 26.3.3 3.8 1.3 5.4 6.8 5.7 15.7.8 31.4.7 47.1.4.6 0 1.3 0 1.8-.3.6-.3 1-.9.9-1.5-.3-1.3-2.5-1.1-3.8-1.2.9-.6 1.5-1.6 1.7-2.9zM10.6 13l42.1.6c1.7 0 3.2 1.5 3.1 3.2v7H41.1c-1.1 0-2.2-.5-3-1.3l-2.3-2.6c-1.2-1.3-2.9-2.1-4.7-2.1H7.3v-1.6c0-1.9 1.5-3.3 3.3-3.2zm44.1 43.6H9.6c-1.2 0-2.3-.9-2.4-2.2L4.3 21.8c-.1-1.4 1-2.6 2.4-2.6h24.4c1.4 0 2.7.6 3.6 1.6l2.3 2.6c1 1.2 2.5 1.9 4.1 1.9h16.2c.7 0 1.3.3 1.8.8s.7 1.2.6 1.8l-2.6 26.5c-.1 1.2-1.2 2.2-2.4 2.2z"
      data-original="#000000"
    />
    <path
      d="m44.2 33.8 2.2-2.2c.3-.3.3-.8 0-1.1s-.8-.3-1.1 0l-2.2 2.2-2.8-2.8c-.3-.3-.8-.3-1.1 0s-.3.8 0 1.1l2.8 2.8-2.6 2.6c-.3.3-.3.8 0 1.1s.8.3 1.1 0l2.6-2.6 2.8 2.8c.3.3.8.3 1.1 0s.3-.8 0-1.1zM57.8 7.6c-.9 1.2-1.6 2.4-2.1 3.8-.1.4.1.8.5.9s.8-.1.9-.5c.4-1.2 1-2.4 1.8-3.4.3-.3.2-.8-.1-1.1-.3 0-.7 0-1 .3zm6.4 2.9c-.2-.3-.7-.5-1-.2l-4.7 3c-.3.2-.4.7-.2 1s.7.5 1 .2l4.7-3c.3-.2.4-.7.2-1zm1.4 5.4-5.3.4c-.4 0-.7.4-.7.8s.4.7.8.7l5.3-.4c.4 0 .7-.4.7-.8-.1-.4-.4-.7-.8-.7z"
      data-original="#000000"
    />
  </svg>
);

export interface PostFilters {
  status: string[];
  sort: { field: string; order: "asc" | "desc" }[];
  dateRange: [Dayjs | null, Dayjs | null];
  topics: string[];
}

export default function PostsEntry({ _serverPosts }: { _serverPosts?: any }) {
  const [filters, setFilters] = useState<PostFilters>({
    status: [],
    sort: [{ field: "timestamp", order: "desc" }],
    dateRange: [null, null],
    topics: [],
  });
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const {
    posts: _clientPosts,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    hasNextPage,
  } = useQueryPosts({
    status: filters.status,
    dateRange: filters.dateRange,
    topics: filters.topics,
    sort: filters.sort,
    enabled: !!user?.uid,
    userId: user?.uid,
  });
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const { isMobileScreen } = useScreenSize();

  const posts = _clientPosts || _serverPosts || [];
  const hasSignals = posts?.length > 0;

  const { ref: lastItemRef, isInView } = useInView();

  useEffect(() => {
    if (!isFetching && !isFetchingNextPage && isInView) fetchNextPage();
  }, [fetchNextPage, isFetching, isFetchingNextPage, isInView]);

  useEffect(() => {
    if (searchParams.has("status")) {
      const status = searchParams.get("status")?.split(",");
      setFilters((c) => ({ ...c, status: status || [] }));
    } else {
      setFilters((c) => ({ ...c, status: [] }));
    }
  }, [searchParams]);

  const handleChange = (value: string[]) => {
    // setFilters({ status: value });
    const params = new URLSearchParams(searchParams.toString());
    value.join(",")
      ? params.set("status", value.join(","))
      : params.delete("status");
    router.push(pathname + "?" + params.toString());
  };

  const handleSelectChange = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedKeys([...selectedKeys, id]);
    } else {
      setSelectedKeys(selectedKeys.filter((key) => key !== id));
    }
  };

  const handleSortApply = (sortBy: SortBy) => {
    setFilters((c) => ({
      ...c,
      sort: Object.keys(sortBy).reduce((acc, key) => {
        // @ts-ignore
        if (sortBy[key]) {
          // @ts-ignore
          acc.push({ field: key, order: sortBy[key] });
        }
        return acc;
      }, [] as { field: string; order: "asc" | "desc" }[]),
    }));
  };

  const handleFiltersApply = (_filters: PostFilters) => {
    setFilters(_filters);
  };

  console.log("isLoading - ", isLoading, posts, isFetching);

  return (
    <div className="overflow-x-auto bg-lightPrimary">
      {isMobileScreen ? <PostItemHeader /> : <PostItemDesktopHeader />}
      {/* <button
            onClick={() => {
              setFilters((c) => ({
                ...c,
                sort: {
                  field: "timestamp",
                  order: c.sort.order === "asc" ? "desc" : "asc",
                },
              }));
            }}
          >
            Change Sort timestamp
          </button>
          <button
            onClick={() => {
              setFilters((c) => ({
                ...c,
                sort: {
                  field: "displayTitle",
                  order: c.sort.order === "asc" ? "desc" : "asc",
                },
              }));
            }}
          >
            Change Sort title
          </button> */}
      {isLoading ? (
        <div className="w-full flex justify-center items-center py-2 text-tertiary text-xs">
          <p>Loading posts...</p>
        </div>
      ) : posts?.length > 0 ? (
        posts?.map((post: Post) =>
          isMobileScreen ? (
            <PostDraftItem
              handleSelectChange={handleSelectChange}
              isSelected={selectedKeys.includes(post.id as string)}
              key={post.id}
              post={post}
            />
          ) : (
            <PostDraftItemDesktop
              handleSelectChange={handleSelectChange}
              isSelected={selectedKeys.includes(post.id as string)}
              key={post.id}
              post={post}
            />
          )
        )
      ) : (
        <div className="flex flex-col gap-1 py-5 items-center justify-center">
          <NoPostIcon className="w-16" />
          <p className="text-tertiary">No Posts</p>
        </div>
      )}
      {(hasNextPage || isFetching || isLoading) && (
        <div
          ref={lastItemRef}
          className="w-full flex items-center justify-center py-4"
        >
          <Spinner
            classNames={{
              circle1: "blue-border-b",
              circle2: "blue-border-b",
            }}
            color="warning"
            size="lg"
          />
        </div>
      )}
    </div>
  );
}
