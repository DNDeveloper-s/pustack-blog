"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import {
  ShimmerButton,
  ShimmerTitle,
  ShimmerText,
  ShimmerCircularImage,
  ShimmerThumbnail,
  ShimmerBadge,
  ShimmerTableCol,
  ShimmerTableRow,
  // @ts-ignore
} from "react-shimmer-effects";

export const noImageUrl =
  "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";

type ImageError = false | "none" | "next";

interface AppImageProps
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  alt: string;
}
export default function AppImage(props: AppImageProps) {
  const [error, setError] = React.useState<ImageError>(false);
  const [loaded, setLoaded] = React.useState(false);

  const handleError = (error: ImageError) => {
    setError(error);
    setLoaded(false);
  };

  if (error === "none") {
    return (
      <img
        {...props}
        src={noImageUrl}
        onLoad={() => {
          // setLoaded(true);
        }}
      />
    );
  }

  if (error === "next") {
    return (
      <>
        <img
          onError={() => handleError("none")}
          onLoad={() => {
            // setLoaded(true);
          }}
          {...props}
          // @ts-ignore
          alt="Image Preview 2"
        />
        {/* {!loaded && (
          <Image
            // @ts-ignore
            src={props.blurDataUrl}
            className="absolute top-0 left-0 !h-auto w-full !aspect-video rounded"
            alt="Image Blur Preview 2"
            unoptimized
          />
        )} */}
      </>
    );
  }

  return (
    <>
      {/* @ts-ignore */}
      <Image
        onError={() => handleError("next")}
        onLoad={() => {
          // setLoaded(true);
        }}
        {...props}
        // @ts-ignore
        alt="Image Preview 1"
      />
      {/* {!loaded && (
        <Image
          // @ts-ignore
          src={props.blurDataUrl}
          className="absolute top-0 left-0 !h-auto w-full !aspect-video rounded"
          alt="Image Blur Preview 1"
          unoptimized
        />
      )} */}
    </>
  );
}
