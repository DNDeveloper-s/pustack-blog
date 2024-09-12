import { ImageCropData } from "@/components/AdminEditor/ImageCropper";
import { PostThumbnail } from "@/firebase/post-v2";
import axios from "axios";

export async function prepareThumbnailVariantsByCropData(
  thumbnail?: PostThumbnail,
  generateBlurData = false
): Promise<PostThumbnail | null> {
  const cropData = thumbnail?.variants;

  console.log("thumbnail - ", thumbnail);

  if (!cropData || !thumbnail) return null;

  let newVariants = [];

  for (let i = 0; i < cropData.length; i++) {
    const crop = cropData[i];

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

    const imageUrl = `https://minerva.news/api/resize-image?${searchParams.toString()}`;

    let blurData = null;

    if (generateBlurData) {
      const blurDataResponse = await axios.get(
        "/api/get-blur-data-url?imageUrl=" + encodeURIComponent(imageUrl)
      );

      blurData = blurDataResponse.data;
    }

    newVariants.push({
      ...cropItem,
      blurData,
      url: imageUrl,
    });
  }

  // const newVariants = cropData.map((crop) => {
  //   const searchParams = new URLSearchParams();
  //   searchParams.append("imageUrl", thumbnail.baseImageUrl ?? "");
  //   searchParams.append("x", crop.croppedAreaPixels.x.toString());
  //   searchParams.append("y", crop.croppedAreaPixels.y.toString());
  //   searchParams.append("width", crop.croppedAreaPixels.width.toString());
  //   searchParams.append("height", crop.croppedAreaPixels.height.toString());
  //   searchParams.append("outputWidth", crop.outputWidth.toString());
  //   searchParams.append("outputHeight", crop.outputHeight.toString());

  //   const cropItem: any = {
  //     ...crop,
  //   };

  //   if (cropItem.baseImageUrl) delete cropItem.baseImageUrl;

  //   return {
  //     ...cropItem,
  //     url: `https://minerva.news/api/resize-image?${searchParams.toString()}`,
  //   };
  // });

  return {
    baseImageUrl: thumbnail.baseImageUrl,
    blurData: thumbnail.blurData,
    variants: newVariants,
  };
}
