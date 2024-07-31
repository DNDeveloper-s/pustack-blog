import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Drawer } from "antd";
import SwipeableViews from "react-swipeable-views";
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useTransition,
} from "react";
import { AccountStepOne, AccountStepTwo } from "./AccountSteps";
import { useUser } from "@/context/UserContext";
import dayjs from "dayjs";
import { useUpdateUser } from "@/api/user";
import useStateWithQuery from "@/hooks/useStateWithQuery";

const popOverShadowStyles = {
  boxShadow:
    "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
};

interface AccountsModalProps {
  Trigger: React.ReactNode;
  deleteAccountDisclosure: any;
}
export default function AccountsModal(props: AccountsModalProps) {
  const accountStepTwoRef = useRef<any>(null);
  const [isTransitionPending, startTransition] = useTransition();
  const [stepTwoKey, setStepTwoKey] = useState(0);
  const { user } = useUser();
  const {
    isPending,
    isSuccess,
    mutate: postUpdateUser,
  } = useUpdateUser({
    onSettled: () => {
      // activeField.current = undefined;
    },
  });
  const [slide, setSlide] = useState(0);
  const onChange = (currentSlide: number, latestSlide: number) => {
    console.log("currentSlide", currentSlide);
    console.log("latestSlide", latestSlide);
    setSlide(currentSlide);
  };

  const goNext = () => {
    if (slide === 1) return;
    // carouselRef.current?.next();
    setSlide(1);
  };

  const goPrev = () => {
    if (slide === 0) return;
    setSlide(0);
    accountStepTwoRef.current?.reset();
    // carouselRef.current?.prev();
    // setStepTwoKey((prev) => prev + 1);
  };

  console.log("rerendered -- slide", slide);

  return (
    <Popover
      classNames={{
        content: "!bg-lightPrimary rounded-lg !p-0 large-shadow",
        base: "!w-[350px]",
      }}
      placement={"bottom-end"}
      color="secondary"
      offset={-5}
      backdrop="transparent"
      onClose={() => {
        setSlide(0);
        document.body.style.overflow = "unset";
      }}
      onOpenChange={(open) => {
        if (open) {
          document.body.style.overflow = "hidden";
        }
      }}
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
        <div className="w-[350px] h-auto bg-primary rounded-lg text-appBlack">
          {/* <Carousel
            slide={slide.toString()}
            ref={carouselRef}
            dots={false}
            afterChange={onChange}
          > */}
          <SwipeableViews index={slide} onChangeIndex={onChange}>
            <AccountStepOne
              userDetails={{
                name: user?.name ?? "",
                email: user?.email ?? "",
                image: user?.image_url ?? "",
                app_rating: 0,
                sign_up_ts:
                  // @ts-ignore
                  user?.sign_up_ts ?? dayjs().toISOString(),
                isSubscribed: user?.subscriber,
              }}
              onSubscriptionChange={(value) => {
                user?.uid &&
                  postUpdateUser({ userId: user?.uid, subscriber: value });
              }}
              handleGearClick={goNext}
              handleBackClick={() => {}}
            />
            <AccountStepTwo
              deleteAccountDisclosure={props.deleteAccountDisclosure}
              handleBackClick={goPrev}
              ref={accountStepTwoRef}
            />
          </SwipeableViews>
          {/* </Carousel> */}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function AccountsDrawerRef(props: { deleteAccountDisclosure: any }, ref: any) {
  const { user } = useUser();
  const [slide, setSlide] = useState(0);
  const [open, setOpen] = useStateWithQuery("accounts-drawer");

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
    setSlide(1);
  };

  const goPrev = () => {
    if (slide === 0) return;
    setSlide(0);
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
        <SwipeableViews index={slide} onChangeIndex={onChange}>
          <AccountStepOne
            userDetails={{
              name: user?.name ?? "",
              email: user?.email ?? "",
              image: user?.image_url ?? "",
              app_rating: 0,
              sign_up_ts:
                // @ts-ignore
                user?.sign_up_ts ?? dayjs().toISOString(),
              isSubscribed: false,
            }}
            onSubscriptionChange={(value) => console.log(value)}
            handleGearClick={goNext}
            handleBackClick={onClose}
          />
          <AccountStepTwo
            deleteAccountDisclosure={props.deleteAccountDisclosure}
            key={slide}
            handleBackClick={goPrev}
          />
        </SwipeableViews>
      </div>
    </Drawer>
  );
}

export const AccountsDrawer = forwardRef(AccountsDrawerRef);
