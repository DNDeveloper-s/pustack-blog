"use client";

import { useQueryDraftPosts, useQueryPosts } from "@/api/post";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/shared/Footer";
import { Post } from "@/firebase/post-v2";
import PostDraftItem, { PostDraftItemHeader } from "./PostDraftItem";
import { Select } from "antd";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useInView from "@/hooks/useInView";
import { Spinner } from "@nextui-org/spinner";
import SortByModal, { SortBy } from "./SortByModal";
import FilterModal from "./FilterModal";
import { useUser } from "@/context/UserContext";
import { Dayjs } from "dayjs";

const options = [
  { value: "draft", label: "Drafts" },
  { value: "published", label: "Published" },
  { value: "scheduled", label: "Scheduled" },
];

export interface PostFilters {
  status: string[];
  sort: { field: string; order: "asc" | "desc" }[];
  dateRange: [Dayjs | null, Dayjs | null];
  topics: string[];
}

export default function PostDraftsEntry({
  _serverPosts,
}: {
  _serverPosts: any;
}) {
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
    dateRange: filters.dateRange,
    topics: filters.topics,
    sort: filters.sort,
    userEmail: user?.email,
    enabled: !!user?.email,
  });
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const posts = _clientPosts || _serverPosts;
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

    console.log("_filters - ", _filters);
  };

  return (
    <div className="max-w-[1440px] w-screen overflow-auto px-3 mx-auto">
      <Navbar />
      <div className="py-10 min-h-[calc(100vh-150px)]">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-appBlack text-[30px] font-larkenExtraBold">
            My Posts
          </h2>
          <div className="min-w-[200px] flex items-center gap-4">
            <SortByModal handleApply={handleSortApply} />
            <FilterModal filters={filters} handleApply={handleFiltersApply} />
          </div>
        </div>

        <div>
          <PostDraftItemHeader />
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
          ) : (
            posts?.map((post: Post) => (
              <PostDraftItem
                handleSelectChange={handleSelectChange}
                isSelected={selectedKeys.includes(post.id as string)}
                key={post.id}
                post={post}
              />
            ))
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
                label="Fetching more posts..."
              />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
