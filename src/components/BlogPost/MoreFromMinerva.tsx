"use client";

import { useGetPostsByCategory, useGetRecentPosts } from "@/api/post";
import { ampersandImage, avatar } from "@/assets";
import { chunk, sortBy } from "lodash";
import Image from "next/image";
import { ReactNode, useMemo } from "react";
import { Post } from "@/firebase/post-v2";
import TrimmedPara from "../shared/TrimmedPara";
import Link from "next/link";
import { Spinner } from "@nextui-org/spinner";
import { useParams } from "next/navigation";
import { trimToSentence } from "@/lib/transformers/trimToSentence";

function MinervaBlogPost({ post }: { post: Post }) {
  const wrapper = (children: ReactNode) => (
    <div className="pb-[10px] group">{children}</div>
  );

  const trimmedTitle = useMemo(
    () => trimToSentence(post?.snippetData?.title ?? "", 20),
    [post?.snippetData?.title]
  );

  const content = (
    <>
      <div className="flex">
        <div className="mr-2">
          <img
            className="w-[38px] h-[38px]"
            src={post.author.photoURL ?? avatar.src}
            alt="avatar"
          />
        </div>
        <div>
          <h3 className="leading-[120%] text-[17px] group-hover:text-appBlue">
            {post.author.name}
          </h3>
          <p
            className="leading-[120%] text-[15px] text-tertiary group-hover:text-appBlue font-helvetica uppercase"
            style={{
              fontWeight: "300",
              fontVariationSettings: '"wght" 400,"opsz" 10',
            }}
          >
            {post.topic}
          </p>
        </div>
      </div>
      <hr className="border-dashed border-[#1f1d1a4d] my-3" />
      <div>
        {post.snippetData?.title && (
          <h2
            className="font-featureHeadline leading-[120%] group-hover:text-appBlue bg-animation group-hover:bg-hover-animation"
            style={{
              fontSize: "22px",
              fontWeight: "395",
              fontVariationSettings: '"wght" 495,"opsz" 10',
            }}
          >
            {trimmedTitle}
          </h2>
        )}
        {post.snippetData?.content && (
          <TrimmedPara
            className="leading-[120%] group-hover:text-appBlue"
            style={{
              fontSize: "16px",
              paddingTop: "10px",
            }}
            wordLimit={40}
          >
            {post.snippetData?.content}
          </TrimmedPara>
        )}
        {/* {post.snippetData?.image && (
          <BlogImage className="mt-2" src={post.snippetData?.image} />
        )} */}
      </div>
    </>
  );

  return wrapper(<Link href={`/${post.id}`}>{content}</Link>);

  // return noLink ? content :  (
  //   <Link href={`/${post.id}`}>{content}</Link>
  // ) : (
  //   defaultBlogWithAuthor(size)
  // );
}

interface MoreFromMinervaProps {}
export default function MoreFromMinerva(props: MoreFromMinervaProps) {
  const { data: posts, error, isLoading } = useGetRecentPosts();
  const params = useParams();

  const chunkedPosts = useMemo(() => {
    const _posts = posts
      ?.filter((post) => post.id !== params?.postId?.[0])
      .slice(0, 4);
    return chunk(_posts ?? [], 2);
  }, [posts, params?.postId?.[0]]);


  const hasNoPosts = !isLoading && !posts?.length;

  return (
    !hasNoPosts && (
      <div>
        <hr
          style={{
            margin: "60px 0 0",
            borderColor: "#1f1d1a",
            borderBottom: 0,
          }}
        />
        <hr
          style={{
            margin: "60px 0 0",
            borderColor: "#1f1d1a",
            borderBottom: 0,
            marginTop: "2px",
            marginBottom: "10px",
          }}
        />
        <div className="styles_title flex items-center gap-3 !mb-4">
          <Image src={ampersandImage} width={20} height={16} alt="Ampersand" />
          <h2 style={{ marginBottom: 0, marginTop: "4px" }}>
            More from Minerva
          </h2>
        </div>
        {!isLoading ? (
          <div className="grid divide-y divide-dashed divide-[#1f1d1a4d]">
            {chunkedPosts?.map((postChunkOf2, i) => (
              <div
                key={i}
                className={
                  "grid divide-x divide-dashed divide-[#1f1d1a4d] py-3 " +
                  (posts?.length === 1
                    ? " grid-cols-1 md:grid-cols-2"
                    : " grid-cols-2")
                }
              >
                {postChunkOf2.map((post, j) => (
                  <div
                    key={post.id}
                    className={j % 2 === 0 ? "pr-3 pb-[10px]" : "pl-3"}
                  >
                    <MinervaBlogPost post={post as any} />
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
        ) : (
          <div className="flex items-center justify-center py-4">
            <Spinner
              size="lg"
              classNames={{
                circle1: "blue-border-b",
                circle2: "blue-border-b",
              }}
            />
          </div>
        )}
      </div>
    )
  );
}
