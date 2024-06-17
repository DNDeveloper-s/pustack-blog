import { Post } from "@/firebase/post";
import BlogPostShareLinks from "./BlogPostShareLinks";
import Logo from "../shared/Logo";

interface BlogPostStickyNavbarProps {
  post: Post;
}

export default function BlogPostStickyNavbar({
  post,
}: BlogPostStickyNavbarProps) {
  return (
    <div className="w-full px-2 fixed top-0 left-0 bg-primary z-[9] sticky_navbar">
      <div
        className="flex items-center justify-between"
        style={{
          padding: "10px 0 12px",
          borderBottom: "1px dashed rgba(31, 29, 26, .302)",
          position: "relative",
        }}
      >
        <div className="flex items-center justify-start">
          <Logo linkClassName="!h-[14px]" className="!h-[14px]" />
          <h2 className="sticky_navbar_title flex-1 text-[14px] capitalize ">
            {post?.snippetData?.title}
          </h2>
        </div>
        <div className="flex items-center">
          <div className="styles_divider_vertical"></div>
          <BlogPostShareLinks post={post} />
        </div>
      </div>
    </div>
  );
}
