import dynamic from "next/dynamic";
const SavedPostPage = dynamic(
  () => import("@/components/SavedPost/SavedPostPage"),
  { ssr: false }
);

export default function SavedPosts() {
  return <SavedPostPage />;
}
