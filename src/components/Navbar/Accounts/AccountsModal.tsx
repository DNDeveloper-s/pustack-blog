import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Carousel } from "antd";
import { CarouselRef } from "antd/es/carousel";
import { useRef, useState } from "react";
import { AccountStepOne, AccountStepTwo } from "./AccountSteps";

interface AccountsModalProps {
  Trigger: React.ReactNode;
}
export default function AccountsModal(props: AccountsModalProps) {
  const carouselRef = useRef<CarouselRef>(null);
  const [slide, setSlide] = useState(0);
  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
    setSlide(currentSlide);
  };

  const goNext = () => {
    if (slide === 1) return;
    carouselRef.current?.next();
  };

  const goPrev = () => {
    if (slide === 0) return;
    carouselRef.current?.prev();
  };

  return (
    <Popover
      classNames={{
        content: "!bg-lightPrimary rounded-none !p-0",
        base: "!w-[350px]",
      }}
      placement={"bottom-end"}
      color="secondary"
      offset={-5}
      //   isOpen={openRow}
      //   onOpenChange={handleOpenRowChange}
    >
      <PopoverTrigger>
        {/* <div className="cursor-pointer">
          <div className="cursor-pointer rounded-lg border bg-gray-100 px-1 hover:bg-gray-300 transition-all">
            <FaGripLinesVertical />
          </div>
        </div> */}
        {props.Trigger}
      </PopoverTrigger>
      <PopoverContent>
        <div className="w-[350px] h-auto bg-primary ">
          <Carousel
            slide={slide.toString()}
            ref={carouselRef}
            dots={false}
            afterChange={onChange}
          >
            <AccountStepOne {...{ goNext, goPrev }} />
            <AccountStepTwo {...{ goNext, goPrev }} />
          </Carousel>
        </div>
      </PopoverContent>
    </Popover>
  );
}
