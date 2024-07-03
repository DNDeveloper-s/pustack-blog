import { arrowSignalBlue, avatar, circlesBlue, imageOne } from "@/assets";
import { url } from "@/constants";
import { Post } from "@/firebase/post-v2";
import Image from "next/image";
import Link from "next/link";
import TrimmedPara from "../shared/TrimmedPara";
import BlogImage from "../shared/BlogImage";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { ReactNode } from "react";

export interface BlogBaseProps {
  size?: "lg" | "sm";
  noLink?: boolean;
  post?: Post;
  linkClassName?: string;
}

const defaultBlogWithAuthor = (size = "lg") => (
  <div className="py-3 group">
    <div className="flex">
      <div className="mr-2">
        <Image className="w-[38px] h-[38px]" src={avatar} alt="avatar" />
      </div>
      <div>
        <h3 className="leading-[120%] text-[17px] group-hover:text-appBlue">
          Kadia Goba
        </h3>
        <p
          className="leading-[120%] text-[15px] text-tertiary group-hover:text-appBlue font-helvetica uppercase"
          style={{
            fontWeight: "300",
            fontVariationSettings: '"wght" 400,"opsz" 10',
          }}
        >
          POLITICS
        </p>
      </div>
    </div>
    <hr className="border-dashed border-[#1f1d1a4d] my-4" />
    <div>
      <h2
        className="font-featureHeadline leading-[120%] group-hover:text-appBlue bg-animation group-hover:bg-hover-animation"
        style={{
          fontSize: size === "sm" ? "24px" : "32px",
          fontWeight: "395",
          fontVariationSettings: '"wght" 495,"opsz" 10',
        }}
      >
        As Democrats double down on border bill, some progressives grow uneasy
      </h2>
      <p
        className="leading-[120%] group-hover:text-appBlue"
        style={{
          fontSize: size === "sm" ? "16px" : "18px",
          paddingTop: size === "sm" ? "8px" : "10px",
        }}
      >
        Senate Majority Leader Chuck Schumer is eager to put Republicans on
        defense with a vote on a bipartisan border bill. Not every Democrat is
        so excited.
      </p>
      <figure className="mt-2">
        <Image src={imageOne} alt="Image One" />
      </figure>
      <p
        className="leading-[120%] text-[12px] mt-1.5 text-tertiary"
        style={{
          fontFamily: "Courier,monospace",
        }}
      >
        REUTERS/Leah Millis
      </p>
    </div>
  </div>
);

export default function BlogWithAuthor({
  size = "lg",
  post,
  noLink,
  linkClassName,
}: BlogBaseProps & { post?: Post }) {
  if (!post) return defaultBlogWithAuthor(size);

  const content = (
    <div className="py-3 group h-full flex flex-col">
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
      <hr className="border-dashed border-[#1f1d1a4d] my-2 md:my-4" />
      <div className="flex-1">
        {post.snippetData?.title && (
          <h2
            className="font-featureHeadline leading-[120%] line-clamp-2 group-hover:text-appBlue bg-animation group-hover:bg-hover-animation"
            style={{
              fontSize: size === "sm" ? "24px" : "32px",
              fontWeight: "395",
              fontVariationSettings: '"wght" 495,"opsz" 10',
            }}
          >
            {post.snippetData?.title}
          </h2>
        )}
        {post.snippetData?.content && (
          <TrimmedPara
            className="leading-[120%] line-clamp-3 group-hover:text-appBlue"
            style={{
              fontSize: size === "sm" ? "16px" : "18px",
              paddingTop: size === "sm" ? "8px" : "10px",
            }}
          >
            {post.snippetData?.content}
          </TrimmedPara>
        )}
        {/* {post.snippetData?.image && (
          <BlogImage className="mt-2" src={post.snippetData?.image} />
        )} */}
        {!post.snippetData?.image && post.snippetData?.iframe && (
          <iframe
            width="100%"
            src={post.snippetData?.iframe}
            className="mt-2 aspect-video"
          ></iframe>
        )}
      </div>
      {post.snippetData?.image && (
        // <Zoom>
        //   <img
        //     onClick={(e: any) => {
        //       e.stopPropagation();
        //       e.preventDefault();
        //       // openPreview(src);
        //       // console.log("src - ", src);
        //     }}
        //     className="max-w-full max-h-full w-auto h-auto object-contain"
        //     src={post.snippetData?.image}
        //     alt="Image Preview"
        //   />
        // </Zoom>
        <BlogImage
          imageProps={{ className: "!w-full !object-cover !h-full" }}
          noZoom
          className="mt-2"
          src={post.snippetData?.image}
        />
      )}
      {/* <p
            className="leading-[120%] text-[12px] mt-1.5 text-tertiary"
            style={{
              fontFamily: "Courier,monospace",
            }}
          >
            REUTERS/Leah Millis
          </p> */}
    </div>
  );

  return noLink ? (
    content
  ) : (
    <Link className={linkClassName} href={`/${post.id}`}>
      {content}
    </Link>
  );

  // return noLink ? content :  (
  //   <Link href={`/${post.id}`}>{content}</Link>
  // ) : (
  //   defaultBlogWithAuthor(size)
  // );
}

const defaultBlogWithAuthorV2 = (size = "lg", noImage = false) => (
  <div className="py-3 group">
    <div className="flex">
      {/* <div className="mr-2">
          <Image className="w-[38px] h-[38px]" src={avatar} alt="avatar" />
        </div> */}
      <div>
        <h3 className="leading-[120%] group-hover:text-appBlue text-[17px]">
          Kadia Goba
        </h3>
        <p
          className="leading-[120%] text-[15px] group-hover:text-appBlue text-tertiary font-helvetica uppercase"
          style={{
            fontWeight: "300",
            fontVariationSettings: '"wght" 400,"opsz" 10',
          }}
        >
          POLITICS
        </p>
      </div>
    </div>
    <hr className="border-dashed border-[#1f1d1a4d] my-4" />
    <div>
      <Image
        src={circlesBlue}
        alt="circles blue"
        className="w-[21px] h-[17px] float-left mt-[4px] mr-[5px]"
      />
      <h2
        className="font-featureHeadline leading-[120%] group-hover:text-appBlue bg-animation group-hover:bg-hover-animation"
        style={{
          fontSize: size === "sm" ? "24px" : "32px",
          fontWeight: "395",
          fontVariationSettings: '"wght" 495,"opsz" 10',
        }}
      >
        As Democrats double down on border bill, some progressives grow uneasy
      </h2>
      <p
        className="leading-[120%] group-hover:text-appBlue"
        style={{
          fontSize: size === "sm" ? "16px" : "18px",
          paddingTop: size === "sm" ? "8px" : "10px",
        }}
      >
        Senate Majority Leader Chuck Schumer is eager to put Republicans on
        defense with a vote on a bipartisan border bill. Not every Democrat is
        so excited.
      </p>
      <div className="flex mt-3">
        <Image
          src={arrowSignalBlue}
          alt="circles blue"
          className="w-[16px] h-[13px] mr-[8px]"
        />
        <h2
          className="leading-[120%] font-helvetica text-appBlue text-[15px]"
          style={{
            fontWeight: "395",
            fontVariationSettings: '"wght" 495,"opsz" 10',
          }}
        >
          UK&apos;s infected blood scandal exacerbated by &apos;chilling&apos;
          cover-up, inquiry finds{" "}
        </h2>
      </div>
      {!noImage && (
        <>
          <figure className="mt-2">
            <Image src={imageOne} alt="Image One" />
          </figure>
          <p
            className="leading-[120%] text-[12px] mt-1.5 text-tertiary"
            style={{
              fontFamily: "Courier,monospace",
            }}
          >
            REUTERS/Leah Millis
          </p>
        </>
      )}
    </div>
  </div>
);

export function BlogWithAuthorV2({
  size = "lg",
  post,
  noImage,
  noLink,
  linkClassName,
}: BlogBaseProps & { post?: Post; noImage?: boolean }) {
  if (!post) return defaultBlogWithAuthorV2(size, noImage);

  const content = (
    <div className="py-3 group h-full flex flex-col ">
      <div className="flex">
        {post.author.photoURL && (
          <div className="mr-2">
            <img
              className="w-[38px] h-[38px]"
              src={post.author.photoURL}
              alt="avatar"
            />
          </div>
        )}
        <div>
          <h3 className="leading-[120%] group-hover:text-appBlue text-[17px]">
            {post.author.name}
          </h3>
          <p
            className="leading-[120%] text-[15px] group-hover:text-appBlue text-tertiary font-helvetica uppercase"
            style={{
              fontWeight: "300",
              fontVariationSettings: '"wght" 400,"opsz" 10',
            }}
          >
            {post.topic}
          </p>
        </div>
      </div>
      <hr className="border-dashed border-[#1f1d1a4d] my-2 md:my-4" />
      <div className="flex-1">
        <Image
          src={circlesBlue}
          alt="circles blue"
          className="w-[21px] h-[17px] float-left mt-[4px] mr-[5px]"
        />
        {post.snippetData?.title && (
          <h2
            className="font-featureHeadline leading-[120%] line-clamp-2 group-hover:text-appBlue bg-animation group-hover:bg-hover-animation"
            style={{
              fontSize: size === "sm" ? "24px" : "32px",
              fontWeight: "395",
              fontVariationSettings: '"wght" 495,"opsz" 10',
            }}
          >
            {post.snippetData?.title}
          </h2>
        )}
        {post.snippetData?.content && (
          <TrimmedPara
            className="leading-[120%] line-clamp-3 group-hover:text-appBlue"
            style={{
              fontSize: size === "sm" ? "16px" : "18px",
              paddingTop: size === "sm" ? "8px" : "10px",
            }}
          >
            {post.snippetData?.content}
          </TrimmedPara>
        )}
        {post.snippetData?.quote && (
          <div className="flex mt-3">
            <Image
              src={arrowSignalBlue}
              alt="circles blue"
              className="w-[16px] h-[13px] mr-[8px]"
            />

            <h2
              className="leading-[120%] font-helvetica text-appBlue text-[15px]"
              style={{
                fontWeight: "395",
                fontVariationSettings: '"wght" 495,"opsz" 10',
              }}
            >
              {post.snippetData?.quote}
            </h2>
          </div>
        )}
        {/* <figure className="mt-2">
          <Image src={imageOne} alt="Image One" />
        </figure>
        <p
          className="leading-[120%] text-[12px] mt-1.5 text-tertiary"
          style={{
            fontFamily: "Courier,monospace",
          }}
        >
          REUTERS/Leah Millis
        </p> */}
      </div>
      {!noImage && post.snippetData?.image && (
        <>
          {/* <Zoom>
            <img
              onClick={(e: any) => {
                e.stopPropagation();
                e.preventDefault();
                // openPreview(src);
                // console.log("src - ", src);
              }}
              className="max-w-full max-h-full w-auto h-auto object-contain"
              src={post.snippetData?.image}
              alt="Image Preview"
            />
          </Zoom> */}
          <BlogImage
            imageProps={{ className: "!w-full !object-cover !h-full" }}
            noZoom
            className="mt-2"
            src={post.snippetData?.image}
          />
        </>
      )}
      {/* {post.snippetData?.image && (
        <Zoom>
          <img
            onClick={(e: any) => {
              e.stopPropagation();
              e.preventDefault();
              // openPreview(src);
              // console.log("src - ", src);
            }}
            className="max-w-full max-h-full w-auto h-auto object-contain"
            src={post.snippetData?.image}
            alt="Image Preview"
          />
        </Zoom>
      )} */}
      {/* <p
            className="leading-[120%] text-[12px] mt-1.5 text-tertiary"
            style={{
              fontFamily: "Courier,monospace",
            }}
          >
            REUTERS/Leah Millis
          </p> */}
    </div>
  );

  return noLink ? (
    content
  ) : (
    <Link className={linkClassName} href={`/${post.id}`}>
      {content}
    </Link>
  );
}
