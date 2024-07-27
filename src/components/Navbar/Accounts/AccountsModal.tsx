import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Carousel, Drawer } from "antd";
import { CarouselRef } from "antd/es/carousel";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { AccountStepOne, AccountStepTwo } from "./AccountSteps";
import { useUser } from "@/context/UserContext";
import dayjs from "dayjs";

const popOverShadowStyles = {
  boxShadow:
    "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
};

interface AccountsModalProps {
  Trigger: React.ReactNode;
}
export default function AccountsModal(props: AccountsModalProps) {
  const carouselRef = useRef<CarouselRef>(null);
  const { user } = useUser();
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

  console.log("user - ", user);

  return (
    <Popover
      classNames={{
        content: "!bg-lightPrimary rounded-lg !p-0 large-shadow",
        base: "!w-[350px]",
      }}
      placement={"bottom-end"}
      color="secondary"
      offset={-5}
      onClose={() => setSlide(0)}
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
        <div className="w-[350px] h-auto bg-primary rounded-lg">
          <Carousel
            slide={slide.toString()}
            ref={carouselRef}
            dots={false}
            afterChange={onChange}
          >
            <AccountStepOne
              userDetails={{
                name: user?.name ?? "",
                email: user?.email ?? "",
                image: user?.image_url ?? "",
                app_rating: 0,
                sign_up_ts:
                  // @ts-ignore
                  user?.sign_up_ts.toDate().toISOString() ??
                  dayjs().toISOString(),
                isSubscribed: false,
              }}
              onSubscriptionChange={(value) => console.log(value)}
              handleGearClick={goNext}
              handleBackClick={() => {}}
            />
            <AccountStepTwo handleBackClick={goPrev} />
          </Carousel>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function AccountsDrawerRef(props: any, ref: any) {
  const carouselRef = useRef<CarouselRef>(null);
  const { user } = useUser();
  const [slide, setSlide] = useState(0);
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    showDrawer,
  }));

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

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
    <Drawer
      title="Basic Drawer"
      placement={"right"}
      closable={false}
      onClose={onClose}
      open={open}
      classNames={{
        wrapper: "!w-screen",
        header: "!hidden",
        body: "!p-0",
      }}
    >
      <div className="w-screen h-screen bg-primary">
        <Carousel
          slide={slide.toString()}
          ref={carouselRef}
          dots={false}
          afterChange={onChange}
        >
          <AccountStepOne
            userDetails={{
              name: user?.name ?? "",
              email: user?.email ?? "",
              image: user?.image_url ?? "",
              app_rating: 0,
              sign_up_ts:
                // @ts-ignore
                user?.sign_up_ts.toDate().toISOString() ??
                dayjs().toISOString(),
              isSubscribed: false,
            }}
            onSubscriptionChange={(value) => console.log(value)}
            handleGearClick={goNext}
            handleBackClick={onClose}
          />
          <AccountStepTwo handleBackClick={goPrev} />
        </Carousel>
      </div>
    </Drawer>
  );
}

export const AccountsDrawer = forwardRef(AccountsDrawerRef);
