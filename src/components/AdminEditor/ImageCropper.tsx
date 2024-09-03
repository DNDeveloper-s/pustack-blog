import { ConfigProvider, Segmented } from "antd";
import Cropper, { Area } from "react-easy-crop";
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
import { ImageVariant, Post } from "@/firebase/post-v2";

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
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  return (
    <div className="relative h-[500px]">
      <Cropper
        image={baseImageUrl}
        crop={crop}
        zoom={zoom}
        aspect={aspectRatio}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
        initialCroppedAreaPercentages={imageCropData?.croppedArea}
        initialCroppedAreaPixels={imageCropData?.croppedAreaPixels}
      />
    </div>
  );
}

export type ImageCropData = {
  aspectRatio: string;
  croppedArea: Area;
  croppedAreaPixels: Area;
  baseImageUrl: string | null;
  outputWidth: number;
  outputHeight: number;
};
function ImageCropperRef(
  props: { cropData: ImageVariant[] | undefined | null },
  ref: any
) {
  const [selectedTab, setSelectedTab] = useState("4 / 3");
  const [index, setIndex] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [baseImageUrl, setBaseImageUrl] = useState<string | null>(null);
  const [imageCropData, setImageCropData] = useState<ImageCropData[]>([]);

  useEffect(() => {
    if (props.cropData && baseImageUrl) {
      setImageCropData(
        props.cropData.map((data) => ({
          ...data,
          baseImageUrl: baseImageUrl,
        }))
      );
    }
  }, [props.cropData, baseImageUrl]);

  const onChangeIndex = (ind: number) => {
    setIndex(ind);
    setSelectedTab(tabs[ind].toLowerCase());
  };

  useImperativeHandle(ref, () => ({
    getImageCropData: () => imageCropData,
  }));

  const onCropComplete =
    (aspectRatio: keyof typeof aspectRatioOptions) =>
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
            outputHeight: aspectRatioOptions[aspectRatio].height,
            outputWidth: aspectRatioOptions[aspectRatio].width,
          },
        ];
      });
    };

  useEffect(() => {
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
  }, []);

  return (
    <div className="mt-5">
      <h4 className="text-[12px] font-helvetica uppercase ml-1 mb-1 text-appBlack">
        Crop Thumbnail
      </h4>
      {!baseImageUrl && (
        <div className="border bg-lightPrimary py-8">
          <p className="text-[15px] text-opacity-20 text-center font-helvetica text-appBlack">
            Please add at least one image to the content to crop thumbnail
          </p>
        </div>
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
