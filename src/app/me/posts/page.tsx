import dynamic from "next/dynamic";
const PostsEntry = dynamic(() => import("@/components/Me/Posts/PostsEntry"), {
  ssr: false,
});

export const revalidate = 0;

export default async function PostDrafts() {
  return <PostsEntry />;
}
