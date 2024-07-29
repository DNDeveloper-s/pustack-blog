"use client";

import Image from "next/image";
import React, { useEffect } from "react";
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

  const handleError = (error: ImageError) => {
    setError(error);
  };

  if (error === "none") {
    return <img {...props} src={noImageUrl} />;
  }

  if (error === "next") {
    return <img onError={() => handleError("none")} {...props} />;
  }

  return (
    // @ts-ignore
    <Image onError={() => handleError("next")} {...props} />
  );
}
