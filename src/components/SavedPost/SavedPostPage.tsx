"use client";

import { useQuerySavedPosts } from "@/api/post";
import Navbar from "../Navbar/Navbar";
import Footer from "../shared/Footer";
import SavedPostItem, {
  SavedPostItemV2,
  SavedPostItemV3,
} from "./SavedPostItem";
import { Post } from "@/firebase/post-v2";

export default function SavedPostPage() {
  const { data: posts, error } = useQuerySavedPosts();

  console.log("error - ", error);
  return (
    <div className="max-w-[1440px] w-screen h-screen flex flex-col overflow-auto px-3 mx-auto">
      <Navbar />
      <div className="w-full overflow-auto py-10 flex-1">
        <div className=" max-w-[700px] mx-auto w-full">
          <div className="mb-6 w-full flex justify-between items-center">
            <h2 className="text-appBlack text-[30px] font-larkenExtraBold">
              Saved Posts
            </h2>
            {/* <div className="flex items-center gap-4">
            <SortByModal handleApply={handleSortApply} />
            <FilterModal filters={filters} handleApply={handleFiltersApply} />
          </div> */}
          </div>
          <div className="w-full grid grid-cols-2 gap-x-2 justify-items-center">
            {posts?.map((post: Post) => (
              <SavedPostItemV3 key={post.id} post={post} />
            ))}
            {/* <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {posts?.map((post: Post) => (
              <SavedPostItemV2 key={post.id} post={post} />
            ))}
          </div> */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
