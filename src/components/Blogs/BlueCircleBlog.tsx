import { circlesBlue } from "@/assets";
import { url } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { BlogBaseProps } from "./BlogWithAuthor";
import { Post } from "@/firebase/post-v2";
import { Signal } from "@/firebase/signal";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const defaultBlueCircleBlog = () => {
  return (
    <div className="py-0 md:py-3 group">
      <div className="flex group-hover:text-appBlue uppercase items-center gap-3 text-[12px] font-featureHeadline mb-1">
        <span>TECHNOLOGY</span>
      </div>
      <div>
        <Image
          src={circlesBlue}
          alt="circles blue"
          className="w-[16px] h-[13px] float-left mt-[5px] mr-[5px]"
        />
        <h2
          className="font-featureHeadline group-hover:text-appBlue bg-animation group-hover:bg-hover-animation"
          style={{
            fontWeight: "395",
            fontVariationSettings: '"wght" 495,"opsz" 10',
          }}
        >
          UK&apos;s infected blood scandal exacerbated by &apos;chilling&apos;
          cover-up, inquiry finds{" "}
        </h2>
      </div>
    </div>
  );
};

export default function BlueCircleBlog({
  size = "lg",
  post,
  noLink,
}: BlogBaseProps & { post?: Post }) {
  if (!post) return defaultBlueCircleBlog();

  const content = (
    <div className="py-0 md:py-3 group">
      <div className="flex group-hover:text-appBlue uppercase items-center gap-3 text-[12px] font-featureHeadline mb-1">
        <span>TECHNOLOGY</span>
      </div>
      <div>
        <Image
          src={circlesBlue}
          alt="circles blue"
          className="w-[16px] h-[13px] float-left mt-[5px] mr-[5px]"
        />
        <h2
          className="font-featureHeadline group-hover:text-appBlue bg-animation group-hover:bg-hover-animation"
          style={{
            fontWeight: "395",
            fontVariationSettings: '"wght" 495,"opsz" 10',
          }}
        >
          {post.snippetData?.title}
        </h2>
      </div>
    </div>
  );

  return noLink ? content : <Link href={`/posts/${post.id}`}>{content}</Link>;
}

export function BlueSignalBlog({
  href,
  signal,
}: {
  href?: string;
  signal: Signal;
}) {
  const router = useRouter();

  useEffect(() => {
    router.prefetch(href ?? "/signals?id=" + signal.id);
  }, [router, href, signal.id]);

  const content = (
    <div className="py-0 md:py-3 group">
      {/* <div className="flex group-hover:text-appBlue uppercase items-center gap-3 text-[12px] font-featureHeadline mb-1">
        <span>TECHNOLOGY</span>
      </div> */}
      <div>
        <Image
          src={circlesBlue}
          alt="circles blue"
          className="w-[16px] h-[13px] float-left mt-[5px] mr-[5px]"
        />
        <h2
          className="font-featureHeadline group-hover:text-appBlue bg-animation group-hover:bg-hover-animation text-appBlack text-opacity-75 "
          style={{
            fontWeight: "395",
            fontVariationSettings: '"wght" 495,"opsz" 10',
          }}
        >
          {signal.title}
        </h2>
      </div>
    </div>
  );

  return <Link href={href ?? "/signals?id=" + signal.id}>{content}</Link>;
}
