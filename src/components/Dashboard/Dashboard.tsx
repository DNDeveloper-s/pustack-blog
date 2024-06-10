import { circlesBlue } from "@/assets";
import Flagship from "@/components/Blogs/Flagship";
import Image from "next/image";
import BlueCircleBlog from "../Blogs/BlueCircleBlog";
import BlogWithAuthor, { BlogWithAuthorV2 } from "../Blogs/BlogWithAuthor";
import SignUpForNewsLetters from "../SignUpForNewsLetters/SignUpForNewsLetters";
import { useMediaQuery } from "react-responsive";
import { usePosts } from "@/hooks/usePosts";
import { PostPosition } from "@/firebase/post";
import { chunk } from "lodash";

export default function Dashboard() {
  const isTabletScreen = useMediaQuery({ query: "(max-width: 1024px)" });
  const { posts } = usePosts();

  const fullCPosts = posts?.filter(
    (post) => post.position === PostPosition.Full_C
  );

  const fullQPosts = posts?.filter(
    (post) => post.position === PostPosition.Full_Q
  );

  const textContentPosts = posts?.filter(
    (post) => post.position === PostPosition.TEXT_CONTENT
  );

  const headlinePosts = posts?.filter(
    (post) => post.position === PostPosition.HEADLINE
  );

  const oldPosts = chunk(
    [...(fullCPosts?.slice(2) ?? []), ...(fullQPosts ?? [])],
    2
  );

  console.log("posts - ", posts);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[21%_54%_25%] py-2">
      <div className="pr-0 md:pr-7">
        {/* <Flagship /> */}
        <div className="pt-1 selection:md:pt-5 flex md:flex-col flex-row divide-x md:divide-x-0 md:divide-y divide-dashed divide-[#1f1d1a4d] overflow-x-auto md:overflow-x-hidden">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="md:px-0 px-3 min-w-[170px] my-2 md:my-0">
              <BlueCircleBlog />
            </div>
          ))}
        </div>
      </div>
      <div className="md:border-x border-dashed border-[#1f1d1a4d] px-3 md:px-7">
        <BlogWithAuthor post={fullCPosts?.[0]} />
        <div className="grid divide-y divide-dashed divide-[#1f1d1a4d]">
          {oldPosts?.map((postChunkOf2, i) => (
            <div
              key={i}
              className="grid grid-cols-2 divide-x divide-dashed divide-[#1f1d1a4d] py-3"
            >
              {postChunkOf2.map((post, j) => (
                <div key={post.id} className={j % 2 === 0 ? "pr-3" : "pl-3"}>
                  {post.position === PostPosition.Full_C && (
                    <BlogWithAuthor post={post} size="sm" />
                  )}
                  {post.position === PostPosition.Full_Q && (
                    <BlogWithAuthorV2 post={post} size="sm" />
                  )}
                </div>
              ))}
            </div>
          ))}
          {/* <div className="pr-3">
            <BlogWithAuthorV2 size="sm" />
          </div>
          <div className="pl-3">
            <BlogWithAuthor size="sm" />
          </div> */}
        </div>
      </div>
      <div className="px-3 md:pl-7 md:pr-0">
        <BlogWithAuthor post={fullCPosts?.[1]} size="sm" />
        {!isTabletScreen && (
          <div>
            <SignUpForNewsLetters />
          </div>
        )}
      </div>
    </div>
  );
}
