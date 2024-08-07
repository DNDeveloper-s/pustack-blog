"use client";

import { useQuerySavedPosts } from "@/api/post";
import Navbar from "../Navbar/Navbar";
import Footer from "../shared/Footer";
import SavedPostItem, {
  SavedPostItemV2,
  SavedPostItemV3,
} from "./SavedPostItem";
import { Post } from "@/firebase/post-v2";
import DesignedBlog from "../Blogs/DesignedBlog";
import { useMemo, useState } from "react";
import { chunk } from "lodash";
import BlogWithAuthor from "../Blogs/BlogWithAuthor";
import { useMediaQuery } from "react-responsive";
import useScreenSize from "@/hooks/useScreenSize";
import { useUser } from "@/context/UserContext";
import { useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@/context/NotificationContext";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { API_QUERY } from "@/config/api-query";
import { NotificationPlacements } from "antd/es/notification/interface";
import { SnackbarContent } from "../AdminEditor/AdminPage";

export default function SavedPostPage() {
  const { data: posts, error } = useQuerySavedPosts();

  const { user } = useUser();
  const qc = useQueryClient();
  const { openNotification } = useNotification();

  const [isPending, setIsPending] = useState<false | string>(false);

  const smallDesktop = useMediaQuery({ query: "(max-width: 1024px)" });
  const miniTab = useMediaQuery({ query: "(max-width: 768px)" });
  const isMobileScreen = useMediaQuery({ query: "(max-width: 500px)" });

  const itemInRowCount = useMemo(() => {
    if (miniTab) return 2;
    if (smallDesktop) return 3;
    return 4;
  }, [smallDesktop, miniTab]);

  const chunkedPosts = useMemo(() => {
    return chunk(posts ?? [], itemInRowCount);
  }, [posts, itemInRowCount]);

  const gridClassName = `grid grid-cols-${itemInRowCount}`;

  async function handleBookMark(post: Post, bookmarked: boolean) {
    if (!post?.id || !user?.uid) return;
    try {
      setIsPending(post?.id);
      const docRef = doc(db, "users", user.uid, "bookmarks", post.id);
      if (bookmarked) {
        await setDoc(docRef, {
          id: post.id,
          bookmarked_at: serverTimestamp(),
        });
      } else {
        await deleteDoc(docRef);
      }
      qc.invalidateQueries({
        queryKey: API_QUERY.QUERY_SAVED_POSTS(user?.uid),
      });
      openNotification(
        NotificationPlacements[5],
        {
          message: (
            <SnackbarContent label={"Post has been removed from bookmarks"} />
          ),
          key: "drafts-notification",
          className: "drafts-notification",
        },
        "success"
      );
      setIsPending(false);
    } catch (e) {
      console.log("Error while bookmarking - ", e);
      setIsPending(false);
      // setIsBookMarked(oldState);
      openNotification(
        NotificationPlacements[5],
        {
          message: <SnackbarContent label={"Error while bookmarking"} />,
          key: "drafts-notification",
          className: "drafts-notification",
        },
        "error"
      );
    }
  }

  return (
    <div className="max-w-[1440px] w-screen h-screen flex flex-col overflow-auto px-3 mx-auto">
      <Navbar />
      <div className="w-full overflow-auto py-10 flex-1 flex flex-col">
        <div className="w-full flex-1">
          <div className="mb-6 w-full flex justify-between items-center">
            <h2 className="text-appBlack text-[30px] font-larkenExtraBold">
              Saved Posts
            </h2>
            {/* <div className="flex items-center gap-4">
            <SortByModal handleApply={handleSortApply} />
            <FilterModal filters={filters} handleApply={handleFiltersApply} />
          </div> */}
          </div>
          {isMobileScreen ? (
            <div className="grid grid-cols-1 gap-3">
              {posts?.map((post: Post) => (
                <SavedPostItem
                  key={post.id}
                  post={post}
                  isPending={isPending === post?.id}
                  handleBookMark={(bookmarked: boolean) =>
                    handleBookMark(post, bookmarked)
                  }
                />
              ))}
            </div>
          ) : (
            <div className="grid divide-y divide-dashed divide-[#1f1d1a4d]">
              {chunkedPosts?.map((postChunkOf2: Post[], i: number) => (
                <div
                  key={i}
                  className={
                    "divide-x divide-dashed divide-[#1f1d1a4d] py-3 " +
                    gridClassName
                  }
                >
                  {postChunkOf2.map((post, j) => (
                    <div
                      key={post.id}
                      className={
                        j % itemInRowCount === itemInRowCount - 1
                          ? "pl-3"
                          : j % itemInRowCount === 0
                          ? "pr-3"
                          : "px-3"
                      }
                    >
                      <BlogWithAuthor
                        linkClassName={"h-full block"}
                        size="sm"
                        post={post}
                        showUnBookmarkButton
                        handleBookMark={(bookmarked) =>
                          handleBookMark(post, bookmarked)
                        }
                        isPending={isPending === post?.id}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}
