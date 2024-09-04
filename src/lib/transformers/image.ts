import { ImageCropData } from "@/components/AdminEditor/ImageCropper";
import { PostThumbnail } from "@/firebase/post-v2";

export function prepareThumbnailVariantsByCropData(
  thumbnail?: PostThumbnail
): PostThumbnail | null {
  const cropData = thumbnail?.variants;

  if (!cropData || !thumbnail) return null;

  const newVariants = cropData.map((crop) => {
    const searchParams = new URLSearchParams();
    searchParams.append("imageUrl", thumbnail.baseImageUrl ?? "");
    searchParams.append("x", crop.croppedAreaPixels.x.toString());
    searchParams.append("y", crop.croppedAreaPixels.y.toString());
    searchParams.append("width", crop.croppedAreaPixels.width.toString());
    searchParams.append("height", crop.croppedAreaPixels.height.toString());
    searchParams.append("outputWidth", crop.outputWidth.toString());
    searchParams.append("outputHeight", crop.outputHeight.toString());

    const cropItem: any = {
      ...crop,
    };

    if (cropItem.baseImageUrl) delete cropItem.baseImageUrl;

    return {
      ...cropItem,
      url: `https://pustack-blog.vercel.app/api/resize-image?${searchParams.toString()}`,
    };
  });

  return {
    baseImageUrl: thumbnail.baseImageUrl,
    variants: newVariants,
  };
}
