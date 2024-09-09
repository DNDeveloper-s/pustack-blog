import { ConfigProvider, Segmented } from "antd";
import Cropper, { Area, Point } from "react-easy-crop";
import SwipeableViews from "react-swipeable-views";
import {
  extractTextFromEditor,
  getFirstImage,
} from "../SlateEditor/utils/helpers";
import React, { useEffect, useImperativeHandle, useState } from "react";
import EventEmitter from "@/lib/EventEmitter";
import { Descendant } from "slate";
import { Editor } from "slate";
import { trimToSentence } from "@/lib/transformers/trimToSentence";
import { ImageVariant, Post, PostThumbnail } from "@/firebase/post-v2";

const tabs = ["4 / 3", "16 / 9"];
export type AspectRatioType = keyof typeof aspectRatioOptions;
const aspectRatioOptions = {
  "4 / 3": {
    width: 800,
    height: 600,
  },
  "16 / 9": {
    width: 1280,
    height: 720,
  },
};

function ImageCropItem({
  baseImageUrl,
  onCropComplete,
  aspectRatio,
  imageCropData,
}: {
  baseImageUrl: string;
  onCropComplete: any;
  aspectRatio: any;
  imageCropData: ImageCropData | undefined;
}) {
  const [crop, setCrop] = useState(imageCropData?.crop ?? { x: 0, y: 0 });
  const [zoom, setZoom] = useState(imageCropData?.zoom ?? 1);

  useEffect(() => {
    if (imageCropData) {
      setCrop(imageCropData.crop);
      setZoom(imageCropData.zoom);
    }
  }, [imageCropData]);

  return (
    <div className="relative h-[500px]">
      <Cropper
        image={baseImageUrl}
        crop={crop}
        zoom={zoom}
        aspect={aspectRatio}
        onCropChange={setCrop}
        onCropComplete={onCropComplete(zoom, crop)}
        onZoomChange={setZoom}
        // initialCroppedAreaPercentages={imageCropData?.croppedArea}
        // initialCroppedAreaPixels={imageCropData?.croppedAreaPixels}
      />
    </div>
  );
}

export type ImageCropData = {
  aspectRatio: string;
  croppedArea: Area;
  croppedAreaPixels: Area;
  baseImageUrl: string | null;
  zoom: number;
  crop: Point;
  outputWidth: number;
  outputHeight: number;
};
function ImageCropperRef(
  props: { thumbnail: PostThumbnail | undefined | null },
  ref: any
) {
  const [selectedTab, setSelectedTab] = useState("4 / 3");
  const [index, setIndex] = useState(0);
  const [baseImageUrl, setBaseImageUrl] = useState<string | null>(null);
  const [imageCropData, setImageCropData] = useState<ImageCropData[]>([]);

  useEffect(() => {
    if (props.thumbnail) {
      setImageCropData(props.thumbnail.variants);
      setBaseImageUrl(props.thumbnail.baseImageUrl);
    }
  }, [props.thumbnail]);

  const onChangeIndex = (ind: number) => {
    setIndex(ind);
    setSelectedTab(tabs[ind].toLowerCase());
  };

  useImperativeHandle(ref, () => ({
    getThumbnail: () => {
      return {
        baseImageUrl: baseImageUrl,
        variants: imageCropData,
      };
    },
  }));

  const onCropComplete =
    (aspectRatio: keyof typeof aspectRatioOptions) =>
    (zoom: number, crop: Point) =>
    (croppedArea: any, croppedAreaPixels: any) => {
      console.log(croppedArea, croppedAreaPixels);
      setImageCropData((prev: any) => {
        const newData = prev.filter(
          (data: any) => data.aspectRatio !== aspectRatio
        );
        return [
          ...newData,
          {
            baseImageUrl,
            aspectRatio,
            croppedArea,
            croppedAreaPixels,
            zoom,
            crop,
            outputHeight: aspectRatioOptions[aspectRatio].height,
            outputWidth: aspectRatioOptions[aspectRatio].width,
          },
        ];
      });
    };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];

    const blob = new Blob([file], { type: file.type });
    const objectUrl = URL.createObjectURL(blob);

    console.log("objectUrl - ", objectUrl);

    setBaseImageUrl(objectUrl);
  };

  useEffect(() => {
    if (props.thumbnail) return;
    const timeoutId = setTimeout(() => {
      EventEmitter.emit("get-slate-value");
    }, 2000);
    const unsub = EventEmitter.addListener(
      "slate-value-change",
      (data: { value: Descendant[]; editor: Editor }) => {
        const extractedTextFromEditor = extractTextFromEditor(data.editor);
        const extractedImage = getFirstImage(data.value);

        setBaseImageUrl(extractedImage);
      }
    );

    return () => {
      clearTimeout(timeoutId);
      unsub.remove();
    };
  }, [props.thumbnail]);

  return (
    <div className="mt-5">
      <div className="mb-1 flex items-center justify-between">
        <h4 className="text-[12px] font-helvetica uppercase ml-1  text-appBlack">
          Post Thumbnail
        </h4>
        {baseImageUrl && (
          <div className="flex items-center gap-3">
            <label htmlFor="change-thumbnail" className="cursor-pointer">
              <p className="text-[12px] font-helvetica text-appBlack px-2 py-1">
                Change Image
              </p>
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
                name="change-thumbnail"
                id="change-thumbnail"
              />
            </label>
            <button
              className="text-[12px] font-helvetica text-danger-500 px-2 py-1"
              onClick={() => setBaseImageUrl(null)}
            >
              Remove
            </button>
          </div>
        )}
      </div>
      {!baseImageUrl && (
        <label
          htmlFor="thumbnail"
          className="border block bg-lightPrimary py-8 cursor-pointer"
        >
          <p className="text-[15px] text-opacity-20 text-center font-helvetica text-appBlack">
            Click to Choose an Image
          </p>
          <input
            hidden
            id="thumbnail"
            name="thumbnail"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>
      )}
      {baseImageUrl && (
        <>
          <ConfigProvider
            theme={{
              components: {
                Segmented: {
                  /* here is your component tokens */
                  itemActiveBg: "#243bb5",
                  itemColor: "#1f1d1a",
                  itemHoverColor: "#1f1d1a",
                  itemSelectedBg: "#243bb5",
                  itemSelectedColor: "#fff",
                  trackBg: "#fcfae4",
                },
              },
            }}
          >
            <Segmented<string>
              size={"large"}
              options={tabs}
              onChange={(value) => {
                console.log(value); // string
                setSelectedTab(value.toLowerCase());
                setIndex(tabs.indexOf(value));
              }}
              value={selectedTab}
              label={"Select Aspect Ratio"}
              style={{
                width: "100%",
              }}
              block
              // className="!bg-lightPrimary"
            />
          </ConfigProvider>
          <SwipeableViews index={index} onChangeIndex={onChangeIndex}>
            <ImageCropItem
              aspectRatio={4 / 3}
              onCropComplete={onCropComplete("4 / 3")}
              baseImageUrl={baseImageUrl}
              imageCropData={imageCropData.find(
                (c) => c.aspectRatio === "4 / 3"
              )}
            />
            <ImageCropItem
              aspectRatio={16 / 9}
              onCropComplete={onCropComplete("16 / 9")}
              baseImageUrl={baseImageUrl}
              imageCropData={imageCropData.find(
                (c) => c.aspectRatio === "16 / 9"
              )}
            />
          </SwipeableViews>
        </>
      )}
    </div>
  );
}

const ImageCropper = React.forwardRef(ImageCropperRef);

export default ImageCropper;
