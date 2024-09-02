import PageDrawer from "@/components/shared/PageDrawer";
import BlogPostMobile from "./BlogPostMobile";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useGetPostById } from "@/api/post";
import { useEffect, useMemo } from "react";
import { Post } from "@/firebase/post-v2";
import { Spinner } from "@nextui-org/spinner";

export default function BlogPostDrawer({ _posts }: { _posts?: Post[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const drawerPostId = searchParams.get("post_drawer_id");
  const { data: _drawerPost } = useGetPostById(drawerPostId);

  const drawerPost = useMemo(() => {
    if (_drawerPost) return _drawerPost;
    return _posts?.find((c: any) => c.id === drawerPostId);
  }, [_posts, _drawerPost, drawerPostId]);

  const postId = searchParams.get("post_drawer_id");

  const handleClose = () => {
    const url = new URLSearchParams(searchParams.toString());
    url.delete("post_drawer_id");
    router.push(`${pathname}?${url.toString()}`, { scroll: true });
  };

  return (
    <div>
      <PageDrawer open={!!postId} onClose={handleClose}>
        {!drawerPost ? (
          <div className="h-full w-full flex items-center justify-center">
            <Spinner
              color="warning"
              size="md"
              label="Hang on, while we are fetching your posts"
            />
          </div>
        ) : (
          <BlogPostMobile _post={drawerPost} />
        )}
      </PageDrawer>
    </div>
  );
}
