"use client";

import Slider from "react-slick";
import { Slider as SliderNext } from "@nextui-org/slider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
import BlogImage from "../shared/BlogImage";
import { useRef, useState } from "react";

const imageUrl = [
  "https://i.natgeofe.com/n/2a832501-483e-422f-985c-0e93757b7d84/6_3x2.jpg",
  "https://cdn.pixabay.com/photo/2012/08/27/14/19/mountains-55067_640.png",
  "https://img.artpal.com/565372/14-23-4-8-13-3-53m.jpg",
  "https://www.superprof.co.in/blog/wp-content/uploads/2018/02/landscape-photography-tutorials.jpg",
  "https://cdn.prod.website-files.com/63a02e61e7ffb565c30bcfc7/65ea99845e53084280471b71_most%20beautiful%20landscapes%20in%20the%20world.webp",
  "https://cdn.pixabay.com/photo/2023/11/04/10/03/bear-8364583_640.png",
  "https://images.unsplash.com/photo-1476610182048-b716b8518aae?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Nnx8fGVufDB8fHx8fA%3D%3D",
];

function calculateProgress(currentIndex: number, totalImages: number) {
  if (currentIndex < 1 || currentIndex > totalImages) {
    throw new Error("Invalid current index");
  }
  return ((currentIndex - 1) / (totalImages - 1)) * 100;
}

export default function ImageCarousel() {
  const sliderRef = useRef<Slider>();
  const [curSlide, setCurSlide] = useState(0);

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
    <div className="w-full h-[250px]">
      <div className="group slider-container editor-in-slider overflow-hidden">
        <Slider
          {...settings}
          ref={(slider: Slider) => {
            sliderRef.current = slider;
          }}
        >
          {imageUrl.map((url) => (
            <div
              key={url}
              style={{ padding: "5px", width: 350 }}
              className="px-5 h-full"
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
        <div className="opacity-0 group-hover:opacity-100">
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
                {curSlide + 1} / {imageUrl.length}
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
                value={calculateProgress(curSlide + 1, imageUrl.length)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
