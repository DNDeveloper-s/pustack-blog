"use client";

import Slider from "react-slick";
import { Slider as SliderNext } from "@nextui-org/slider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  MdEdit,
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
import BlogImage from "../shared/BlogImage";
import { useEffect, useRef, useState } from "react";
import { useReadOnly } from "slate-react";
import CreateImageCarouselUI from "./CreateImageCarouselUI";

function calculateProgress(currentIndex: number, totalImages: number) {
  if (currentIndex < 1 || currentIndex > totalImages) {
    throw new Error("Invalid current index");
  }
  return ((currentIndex - 1) / (totalImages - 1)) * 100;
}

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore
    navigator.msMaxTouchPoints > 0
  );
}

interface ImageCarouselProps {
  attributes: any;
  element: any;
  setPreviewMode: any;
  readonly: boolean;
}
function ImageCarousel({
  attributes,
  element,
  setPreviewMode,
  readonly,
}: ImageCarouselProps) {
  const sliderRef = useRef<Slider>();
  const [curSlide, setCurSlide] = useState(0);

  const [isTouchDeviceState, setIsTouchDeviceState] = useState(false);

  useEffect(() => {
    setIsTouchDeviceState(isTouchDevice());
  }, []);

  const imageUrls = element.images.map((image: any) => image.src);

  const settings = {
    className: "slider variable-width",
    dots: false,
    variableWidth: true,
    infinite: false,
    centerMode: true,
    slidesToShow: 1,
    arrows: false,
    slidesToScroll: 1,
    cssEase: "cubic-bezier(.17,.83,.29,.89)",
    beforeChange: (currentSlide: number, nextSlide: number) => {
      setCurSlide(nextSlide);
    },
  };
  return (
    <div {...attributes} className="w-full h-[250px]">
      <div
        className="group slider-container border border-dashed border-[#1f1d1a2b] editor-in-slider overflow-hidden"
        style={{
          // @ts-ignore
          "--slick-track-width": imageUrls.length * 350 + "px",
        }}
      >
        <Slider
          {...settings}
          ref={(slider: Slider) => {
            sliderRef.current = slider;
          }}
        >
          {imageUrls.map((url: string) => (
            <div
              key={url}
              style={{ padding: "5px", width: 350 }}
              className="p-4 h-full"
            >
              {/* <img
                className="w-full h-full object-cover image"
                src={url}
                alt=""
              /> */}
              <BlogImage
                style={{
                  aspectRatio: "unset",
                  width: "100%",
                  height: "100%",
                }}
                src={url}
                className="slider-image-zoom"
              />
            </div>
          ))}
        </Slider>
        <div
          className={
            isTouchDeviceState
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          }
        >
          {!readonly && (
            <div
              onClick={() => {
                setPreviewMode(false);
              }}
              className="absolute top-3 right-3 rounded flex items-center gap-1 text-sm justify-center bg-lightPrimary text-appBlack cursor-pointer"
            >
              <MdEdit className="text-sm" />
              <span>Edit</span>
            </div>
          )}
          <div
            onClick={() => {
              sliderRef.current?.slickPrev();
            }}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 rounded-full w-7 h-7 flex items-center justify-center bg-lightPrimary text-appBlack cursor-pointer"
          >
            <MdOutlineArrowBackIos className="text-md" />
          </div>
          <div
            onClick={() => {
              sliderRef.current?.slickNext();
            }}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 rounded-full w-7 h-7 flex items-center justify-center bg-lightPrimary text-appBlack cursor-pointer"
          >
            <MdOutlineArrowForwardIos className="text-md " />
          </div>
          <div className="w-full flex items-center gap-4 px-5 py-2 absolute bottom-0 h-10 bg-lightPrimary bg-opacity-65">
            <div>
              <span className="text-appBlack font-helvetica text-sm">
                {curSlide + 1} / {imageUrls.length}
              </span>
            </div>
            <div className="flex-1">
              <SliderNext
                classNames={{
                  base: "!max-w-[unset] !w-full",
                  labelWrapper: "!hidden",
                  filler: "transition-all duration-200",
                  thumb: "transition-all duration-200",
                }}
                size="sm"
                color="foreground"
                className="max-w-md"
                value={calculateProgress(curSlide + 1, imageUrls.length)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ImageCarouselEntry({ element, attributes }: any) {
  const readonly = useReadOnly();
  const [previewMode, setPreviewMode] = useState(false);

  if (readonly || previewMode)
    return (
      <ImageCarousel
        element={element}
        attributes={attributes}
        setPreviewMode={setPreviewMode}
        readonly={readonly}
      />
    );

  return (
    <CreateImageCarouselUI
      attributes={attributes}
      element={element}
      setPreviewMode={setPreviewMode}
    />
  );
}
