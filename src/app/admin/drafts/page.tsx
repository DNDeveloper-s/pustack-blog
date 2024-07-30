import dynamic from "next/dynamic";
const PostDraftsEntry = dynamic(
  () => import("@/components/Drafts/PostDrafts/PostDraftsEntry"),
  {
    ssr: false,
  }
);

export const revalidate = 0;

export default async function PostDrafts() {
  return <PostDraftsEntry />;
}
