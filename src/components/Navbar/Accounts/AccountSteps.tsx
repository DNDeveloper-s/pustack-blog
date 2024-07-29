import { FaGear, FaWhatsapp } from "react-icons/fa6";
import goldCard from "@/assets/images/userMenu/gold.jpg";
import goldSim from "@/assets/images/userMenu/sim.svg";
import memberSince from "@/assets/images/userMenu/member_since.svg";
import minervaGold from "@/assets/images/userMenu/minerva-gold.svg";
import minervaBlack from "@/assets/images/userMenu/minerva-black.svg";
import dynamic from "next/dynamic";
const StarRatings = dynamic(() => import("react-star-ratings"), { ssr: false });
import Image from "next/image";
import { Switch } from "antd";
import { MdAlternateEmail } from "react-icons/md";
import { IoBookmarkSharp, IoChevronBack } from "react-icons/io5";
import { BsFillInfoCircleFill } from "react-icons/bs";
import dayjs from "dayjs";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Lottie from "lottie-react-web";
import { greenTickLottie } from "@/assets";
import { Spinner } from "@nextui-org/spinner";
import { useUpdateUser } from "@/api/user";
import { useUser } from "@/context/UserContext";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { extractCountryCodeAndNumber } from "@/lib/phonenumber";
import { handleUpload } from "@/lib/firebase/upload";
import { signOut } from "@/lib/firebase/auth";
import useScreenSize from "@/hooks/useScreenSize";
import AppImage from "@/components/shared/AppImage";
import { Progress } from "@nextui-org/progress";
import Link from "next/link";

const userImageUrl = "https://www.w3schools.com/howto/img_avatar2.png";

export const starPath =
  "M93.658,7.186,68.441,60.6,12.022,69.2C1.9,70.731-2.15,83.763,5.187,91.227l40.818,41.557-9.654,58.7c-1.738,10.611,8.959,18.559,17.918,13.6l50.472-27.718,50.472,27.718c8.959,4.922,19.656-2.986,17.918-13.6l-9.654-58.7,40.818-41.557c7.337-7.464,3.282-20.5-6.835-22.029L141.04,60.6,115.824,7.186A12.139,12.139,0,0,0,93.658,7.186Z";

const RSVPIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={13}
    height={16}
    fill="none"
    {...props}
    style={{ color: "currentcolor" }}
  >
    <path
      fill="currentcolor"
      d="M2.69 7.37c0 .16-.13.29-.29.29h-.395v-.58H2.4c.16 0 .29.13.29.29Zm9.58-5.145v11.55A2.228 2.228 0 0 1 10.043 16H2.225A2.228 2.228 0 0 1 0 13.775V2.225A2.228 2.228 0 0 1 2.225 0h7.82a2.228 2.228 0 0 1 2.224 2.225Zm-7.895-.523a.34.34 0 0 0 .34.34h2.84a.34.34 0 1 0 0-.68h-2.84a.34.34 0 0 0-.34.34ZM3.132 8a.963.963 0 0 0-.046-1.316.972.972 0 0 0-.686-.285h-.735a.34.34 0 0 0-.34.34V9.26a.34.34 0 1 0 .68 0v-.92H2.4c.16 0 .29.13.29.29v.63a.34.34 0 0 0 .68 0v-.63A.964.964 0 0 0 3.133 8Zm2.832-.902a.7.7 0 0 0-.7-.699h-.647a.7.7 0 0 0-.7.7v.543a.7.7 0 0 0 .7.698l.666.018-.018.562-.667-.018v-.11a.34.34 0 0 0-.68 0v.11a.7.7 0 0 0 .699.699h.648a.7.7 0 0 0 .699-.7v-.543a.7.7 0 0 0-.7-.698l-.666-.018.019-.562.666.018v.158a.34.34 0 0 0 .68 0v-.158Zm2.239-.687a.34.34 0 0 0-.417.24L7.43 7.958l-.354-1.307a.34.34 0 1 0-.657.178l.683 2.52a.34.34 0 0 0 .657 0l.682-2.52a.34.34 0 0 0-.24-.418Zm2.742.959a.972.972 0 0 0-.97-.97h-.736a.34.34 0 0 0-.34.34v2.52a.34.34 0 0 0 .68 0v-.92h.396a.972.972 0 0 0 .97-.97Zm-.97-.29H9.58v.58h.395a.29.29 0 0 0 0-.58Z"
    />
  </svg>
);

interface AccountStepProps {
  handleGearClick: () => void;
  handleBackClick: () => void;
  userDetails: {
    name: string;
    email: string;
    isSubscribed?: boolean;
    image?: string;
    sign_up_ts: string;
    app_rating: number;
  };
  onSubscriptionChange: (checked: boolean, event: any) => void;
}
export function AccountStepOne({
  handleGearClick,
  onSubscriptionChange: _onSubscriptionChange,
  handleBackClick,
  userDetails,
}: AccountStepProps) {
  const [hasRated, setHasRated] = useState(false);
  const { isMobileScreen } = useScreenSize();
  const [_isSubscribed, setIsSubscribed] = useState(!!userDetails.isSubscribed);

  const onSubscriptionChange = (checked: boolean, event: any) => {
    setIsSubscribed(checked);
    _onSubscriptionChange(checked, event);
  };

  useEffect(() => {
    setIsSubscribed(!!userDetails.isSubscribed);
  }, [userDetails.isSubscribed]);

  return (
    <div className="flex flex-col h-full">
      <div className={"px-4"}>
        <div
          className={"flex items-center justify-between font-featureHeadline"}
        >
          <h2 className="flex items-center gap-2 py-2">
            {isMobileScreen && (
              <IoChevronBack
                className="text-xl cursor-pointer"
                onClick={handleBackClick}
              />
            )}
            <span className="font-featureHeadline text-2xl">Account</span>
          </h2>
          <div
            className="bg-gray-200 text-sm rounded-full p-1 cursor-pointer"
            onClick={handleGearClick}
          >
            <FaGear />
          </div>
        </div>
        <div className="relative rounded-xl mt-8">
          <Image
            height={100}
            width={100}
            className="w-full rounded-xl"
            src={goldCard}
            alt="user-card-bg"
            draggable={false}
          />
          <div className="absolute big-shadow top-0 left-1/2 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 rounded-xl overflow-hidden w-[72px] h-[72px]">
            <div
              className="w-full h-full absolute"
              style={{
                transform: "rotate(149deg) scale(1.28)",
              }}
            >
              <Image
                height={100}
                width={100}
                className="w-full h-full object-cover -z-10"
                src={goldCard}
                alt="user-card-bg"
                draggable={false}
              />
            </div>
            {/* <img
              height={66}
              width={66}
              className="relative z-10 rounded-xl"
              src={userDetails.image || userImageUrl}
              alt="userdp"
              draggable={false}
            /> */}
            <AppImage
              height={66}
              width={66}
              className="w-[66px] h-[66px] relative z-10 rounded-xl object-cover"
              src={userDetails.image || userImageUrl}
              alt="userdp"
              // @ts-ignore
              unoptimized
              draggable={false}
            />
          </div>
          <Image
            height={100}
            width={90}
            src={minervaGold}
            alt="gold"
            className="absolute top-3 left-3"
            draggable={false}
          />
          <Image
            height={100}
            width={100}
            src={goldSim}
            alt="user-card-sim"
            className="absolute top-1/2 w-12 transform -translate-y-1/2 right-4"
            draggable={false}
          />

          <div className="absolute bottom-0 flex justify-between w-full py-2 px-3">
            <div className="text-xs">
              <h2 className="text-base font-medium">{userDetails.name}</h2>
              <p>{userDetails.email}</p>
            </div>
            <div className="flex items-center justify-center flex-col text-xs">
              <Image
                height={80}
                width={80}
                src={memberSince}
                alt="member-since"
                draggable={false}
              />
              <h6>{dayjs(userDetails.sign_up_ts).year()}</h6>
            </div>
          </div>
        </div>
        <div className="page-content my-5 mb-2">
          <div className={"py-2 px-3 pb-2 rounded-lg small-around-shadow"}>
            {!hasRated ? (
              <>
                <h6 className="text-xs font-featureHeadline mb-1 text-gray-500 font-medium">
                  Rate Experience
                </h6>
                <StarRatings
                  name="rating"
                  rating={2}
                  numberOfStars={5}
                  starSpacing="2px"
                  starDimension="20px"
                  svgIconPath={starPath}
                  starHoverColor="#fec107"
                  starRatedColor="#fec107"
                  changeRating={() => {
                    setHasRated(true);
                    setTimeout(() => {
                      setHasRated(false);
                    }, 4000);
                  }}
                  svgIconViewBox="0 0 207.802 207.748"
                />
              </>
            ) : (
              <div className="animate-appearance-in text-center">
                <h5>Thank you for rating us</h5>
                <span role="img" aria-label="smiley">
                  😊
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="divide-y">
          <Link
            href={"/saved"}
            className="grid grid-cols-[32px_1fr] items-center gap-2 text-appBlack font-featureBold font-medium py-3"
          >
            <div className="bg-appBlack rounded p-2 text-primary flex items-center justify-center">
              <IoBookmarkSharp />
            </div>
            <div>
              <span>Saved Posts</span>
            </div>
          </Link>
          <div className="flex items-center justify-between">
            <div className="grid grid-cols-[32px_1fr] items-center gap-2 text-appBlack font-featureBold font-medium py-3">
              <div className="bg-appBlack rounded p-2 text-primary flex items-center justify-center">
                <MdAlternateEmail />
              </div>
              <div>
                <span>Email Subscription</span>
              </div>
            </div>
            <div>
              <Switch onChange={onSubscriptionChange} checked={_isSubscribed} />
            </div>
          </div>
          <div className="grid grid-cols-[32px_1fr] items-center gap-2 text-appBlack font-featureBold font-medium py-3">
            <div className="bg-appBlack rounded p-2 text-primary w-full h-full flex items-center justify-center">
              <RSVPIcon style={{ width: "100%", height: "100%" }} />
            </div>
            <div>
              <span>RSVP&apos;ed Events</span>
            </div>
          </div>
          <div className="grid grid-cols-[32px_1fr] items-center gap-2 text-appBlack font-featureBold font-medium py-3">
            <div className="bg-appBlack rounded p-2 text-primary flex items-center justify-center">
              <BsFillInfoCircleFill className="text-sm" />
            </div>
            <div>
              <span>About</span>
            </div>
          </div>
        </div>
        <div></div>
      </div>
      <div className="flex-1"></div>
      <div className="border-t border-dashed border-[#1f1f1d1a] w-full py-2 text-xs mt-7 flex items-center justify-center gap-4">
        <div>
          <span>Terms of Service</span>
        </div>
        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
        <div>
          <span>Privacy Policy</span>
        </div>
      </div>
    </div>
  );
}

interface FormInputProps {
  label: string;
  placeholder?: string;
  input?: (
    value: string | undefined,
    onChange: (e: any) => void,
    setIsChanged: (val: boolean) => void,
    inputRef: React.RefObject<HTMLInputElement>
  ) => ReactNode;
  value?: string;
  onChange?: (e: any) => void;
  onUpdate: (val: string) => void;
  isPending?: boolean;
  isSuccess?: boolean;
  onCompleteAnimation?: () => void;
  noBottomBorder?: boolean;
}
function FormInput(props: FormInputProps) {
  const [isChanged, setIsChanged] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(props.value);

  const handleChange = (e: any) => {
    const _isChanged = (props.value?.trim() ?? "") !== e.target.value.trim();
    setIsChanged(_isChanged);
    props.onChange?.(e);
    setValue(e.target.value);
  };

  const handleUpdate = () => {
    setIsChanged(false);
    props.onUpdate?.(inputRef.current?.value ?? "");
  };

  const id = useMemo(() => props.label.split(" ").join("-"), [props.label]);

  const renderStatus = () => {
    console.log("props - ", props);
    if (props.isPending) {
      return (
        <Spinner
          size="sm"
          classNames={{
            base: "!w-[14px] !h-[14px]",
            wrapper: "!w-full !h-full",
            circle1: "!border !border-b-appBlue",
            circle2: "!border !border-b-appBlue",
          }}
        />
      );
    }

    if (props.isSuccess) {
      return (
        <div className="w-[20px] h-[20px]">
          <Lottie
            options={{ animationData: greenTickLottie, loop: false }}
            eventListeners={[
              {
                eventName: "complete",
                callback: () => props.onCompleteAnimation?.(),
              },
            ]}
          />
        </div>
      );
    }

    if (isChanged) {
      return (
        <span className="cursor-pointer" onClick={handleUpdate}>
          Update
        </span>
      );
    }

    return null;
  };

  return (
    <form className="relative grid grid-cols-[90px_1fr] items-center px-4">
      <label className="text-sm mb-1" htmlFor={id}>
        {props.label}
      </label>
      <div>
        {props.input ? (
          props.input(value, handleChange, setIsChanged, inputRef)
        ) : (
          <input
            type="text"
            id={id}
            placeholder={props.placeholder ?? "Enter here"}
            className={
              "w-full bg-transparent py-2 text-sm font-featureBold !outline-none pr-[45px] " +
              (props.noBottomBorder
                ? ""
                : "border-b border-dashed border-[#1f1d1a4d]")
            }
            onChange={handleChange}
            value={value}
            ref={inputRef}
            // value={profileName}
            // onChange={handleProfileNameChange}
          />
        )}
        {/* <Lottie /> */}
        <div className="absolute text-xs top-1/2 transform -translate-y-1/2 right-[25px]">
          {renderStatus()}
        </div>
      </div>
    </form>
  );
}

interface ImagePickerProps {
  url: string;
  setUrl: (url: string) => void;
}
function ImagePicker({ url, setUrl }: ImagePickerProps) {
  const [isPending, setIsPending] = useState(false);
  const [progress, setProgress] = useState(0);
  // const [url, setUrl] = useState(props.image_url);
  // const [hide, setHide] = useState(false);

  const handleImageChange = (e: any) => {
    // setProgress(60);
    // setUrl(
    //   "https://firebasestorage.googleapis.com/v0/b/minerva-0000.appspot.com/o/images%2F452380345_374227215435694_2191457578537821322_n.png?alt=media&token=8429bf54-a8c7-4517-91eb-e83745a6a9ec"
    // );
    handleUpload(e.target.files[0], {
      setProgress: (val) => setProgress(val),
      setIsPending: (val) => setIsPending(val),
      handleComplete: (_url: any) => {
        setUrl(_url);
        setIsPending(false);
        setProgress(0);
        // setHide(true);
        // setTimeout(() => {
        //   setHide(false);
        // }, 500);
      },
    });

    e.target.value = "";
    // e.target.files = null;
  };

  return (
    <div
      // htmlFor="profile-input"
      className="flex justify-center items-center flex-col gap-2 cursor-pointer relative"
    >
      <div
        className="relative big-shadow  flex flex-col items-center justify-center rounded-xl overflow-hidden w-[72px] h-[72px]"
        key={url}
      >
        <div
          className="w-full h-full absolute"
          style={{
            transform: "rotate(149deg) scale(1.28)",
          }}
        >
          <Image
            height={100}
            width={100}
            className="w-full h-full object-cover -z-10"
            src={goldCard}
            alt="user-card-bg"
            draggable={false}
          />
        </div>
        {progress > 0 && (
          <Progress
            className="absolute top-0 h-[3px]"
            classNames={{
              track: "!h-full !bg-transparent",
              indicator: "!bg-appBlue",
            }}
            value={parseInt(progress.toString())}
          />
        )}

        <AppImage
          height={66}
          width={66}
          className="w-[66px] h-[66px] relative z-10 rounded-xl object-cover"
          src={url}
          alt="userdp"
          // @ts-ignore
          unoptimized
          draggable={false}
        />
      </div>
      <h4 className="text-[12px] font-medium text-appBlue">
        Change Profile Photo
      </h4>
      <div
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        // htmlFor="profile-input"
        aria-label="profile-input"
      >
        <input
          onChange={handleImageChange}
          id="profile-input"
          type="file"
          accept="image/*"
          className="w-full h-full cursor-pointer"
          // hidden
        />
      </div>
    </div>
  );
}

// : (
//   <Lottie
//     options={{ animationData: greenTickLottie, loop: false }}
//   />
// )

interface AccountStepTwoProps {
  handleBackClick: () => void;
}
export function AccountStepTwo({ handleBackClick }: AccountStepTwoProps) {
  // const activeField = useRef<"name" | "email" | "phone" | "company">();

  const [activeField, setActiveField] = useState<
    "name" | "email" | "phone" | "company"
  >();
  const { user } = useUser();
  const [url, setUrl] = useState(user?.image_url ?? "");
  const {
    isPending,
    isSuccess,
    mutate: postUpdateUser,
  } = useUpdateUser({
    onSettled: () => {
      // activeField.current = undefined;
    },
  });

  const handleCompleteAnimation = () => {
    setActiveField(undefined);
  };

  return (
    user?.uid && (
      <div className="flex flex-col h-full">
        <div
          className={
            "flex items-center justify-between font-featureHeadline px-3 pr-4"
          }
        >
          <h2 className="flex items-center gap-2 py-2">
            <IoChevronBack
              className="text-xl cursor-pointer"
              onClick={handleBackClick}
            />
            <span className="font-featureHeadline text-2xl">Settings</span>
          </h2>
          <span className="font-featureHeadline text-appBlue font-bold text-sm">
            Done
          </span>
        </div>
        <div className="w-full flex justify-center px-4">
          <ImagePicker
            url={url}
            setUrl={(url: string) => {
              setUrl(url);
              postUpdateUser({
                userId: user?.uid,
                image_url: url,
              });
            }}
          />
        </div>

        <hr className="border-dashed border-[#1f1d1a4d] mb-2 mt-5" />

        <div>
          <div>
            <div>
              {/* <form className="relative grid grid-cols-[90px_1fr] items-center px-4">
              <label className="text-sm mb-1" htmlFor="name">
                Name
              </label>
              <div>
                <input
                  type="text"
                  id="name"
                  placeholder="Your name"
                  className="w-full bg-transparent py-2 border-b border-dashed border-[#1f1d1a4d] text-sm font-featureBold !outline-none pr-[45px]"
                  // value={profileName}
                  // onChange={handleProfileNameChange}
                />
                <span className="absolute text-xs top-1/2 transform -translate-y-1/2 right-[25px]">
                  Update
                </span>
              </div>
            </form> */}
              <FormInput
                label="Name"
                onUpdate={(value: string) => {
                  setActiveField("name");
                  postUpdateUser({
                    name: value,
                    userId: user?.uid,
                  });
                }}
                onCompleteAnimation={handleCompleteAnimation}
                isPending={activeField === "name" && isPending}
                isSuccess={activeField === "name" && isSuccess}
                placeholder="Enter Name"
                value={user?.name}
              />
            </div>
            <div>
              <FormInput
                label="Phone"
                onUpdate={(value: string) => {
                  setActiveField("phone");
                  const { nationalNumber, countryCode } =
                    extractCountryCodeAndNumber(value);
                  postUpdateUser({
                    phone: nationalNumber,
                    phone_country_code: countryCode,
                    userId: user?.uid,
                  });
                }}
                input={(value, onChange, _, inputRef) => (
                  <PhoneInput
                    inputProps={{
                      ref: inputRef,
                    }}
                    country={"in"}
                    containerClass="border-b border-dashed border-[#1f1d1a4d]"
                    inputClass="!border-none !w-full !bg-transparent py-2 pt-3 text-sm font-featureBold !outline-none pr-[45px] !pl-[34px]"
                    buttonClass="!bg-transparent !border-none minerva-account-modal-phone-input"
                    value={value}
                    onChange={(phone) => onChange({ target: { value: phone } })}
                  />
                )}
                onCompleteAnimation={handleCompleteAnimation}
                isPending={activeField === "phone" && isPending}
                isSuccess={activeField === "phone" && isSuccess}
                placeholder="Enter here"
                value={(user?.phone_country_code ?? "") + (user?.phone ?? "")}
              />
              {/* <form className="relative grid grid-cols-[90px_1fr] items-center px-4">
              <label className="text-sm mb-1" htmlFor="name">
                Phone
              </label>
              <div>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter here"
                  className="w-full bg-transparent py-2 pt-3 border-b border-dashed border-[#1f1d1a4d] text-sm font-featureBold !outline-none pr-[45px]"
                  // value={profileName}
                  // onChange={handleProfileNameChange}
                />
                <span className="absolute text-xs top-1/2 transform -translate-y-1/2 right-[25px]">
                  Update
                </span>
              </div>
            </form> */}
            </div>
            <div>
              <FormInput
                label="Email"
                onUpdate={(value: string) => {
                  setActiveField("email");
                  postUpdateUser({
                    email: value,
                    userId: user?.uid,
                  });
                }}
                onCompleteAnimation={handleCompleteAnimation}
                isPending={activeField === "email" && isPending}
                isSuccess={activeField === "email" && isSuccess}
                placeholder="Enter here"
                value={user?.email}
              />
              {/* <form className="relative grid grid-cols-[90px_1fr] items-center px-4">
              <label className="text-sm mb-1" htmlFor="name">
                Email
              </label>
              <div>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter here"
                  className="w-full bg-transparent py-2 pt-3 border-b border-dashed border-[#1f1d1a4d] text-sm font-featureBold !outline-none pr-[45px]"
                  // value={profileName}
                  // onChange={handleProfileNameChange}
                />
                <span className="absolute text-xs top-1/2 transform -translate-y-1/2 right-[25px]">
                  Update
                </span>
              </div>
            </form> */}
            </div>
            <div>
              <FormInput
                label="Company"
                onUpdate={(value: string) => {
                  setActiveField("company");
                  postUpdateUser({
                    company: value,
                    userId: user?.uid,
                  });
                }}
                onCompleteAnimation={handleCompleteAnimation}
                isPending={activeField === "company" && isPending}
                isSuccess={activeField === "company" && isSuccess}
                placeholder="Enter here"
                value={user?.company}
                noBottomBorder
              />
              {/* <form className="relative grid grid-cols-[90px_1fr] items-center px-4">
              <label className="text-sm mb-1" htmlFor="name">
                Company
              </label>
              <div>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter here"
                  className="w-full bg-transparent py-2 pt-3 text-sm font-featureBold !outline-none pr-[45px]"
                  // value={profileName}
                  // onChange={handleProfileNameChange}
                />
                <span className="absolute text-xs top-1/2 transform -translate-y-1/2 right-[25px]">
                  Update
                </span>
              </div>
            </form> */}
            </div>
            {/* <div className="user-settings-form">
                <form
                  onClick={() => {
                    // setSwipeFlow(() => {
                    //   setActiveIndex(2, SWIPE_FLOW.PHONE);
                    //   return SWIPE_FLOW.PHONE;
                    // });
                  }}
                >
                  <label htmlFor="name">Phone</label>
                  <PhoneInput
                    value={`+91 93198-25600`}
                    placeholder="+91 XXXXX-XXXXX"
                    // disableDropdown={true}
                    // disabled={true}
                  />
                </form>
              </div> */}
          </div>
          <hr className="border-dashed border-[#1f1d1a4d] mb-2 mt-0.5" />
          <div className="flex flex-col text-sm font-medium text-appBlue divide-y divide-dashed divide-[#1f1d1a4d]">
            <h6 className="pb-2 px-4">
              <span>Terms of Service</span>
            </h6>
            <h6 className="py-2 px-4">
              <span>Privacy Policy</span>
            </h6>
            <h6 className="py-2 px-4 cursor-pointer" onClick={() => signOut()}>
              <span>Log Out saurs2000@gmail.com</span>
            </h6>
            <h6 className="py-2 px-4">
              <span className="delete text-red-500">Delete Account</span>
            </h6>
          </div>
        </div>
        <div className="flex-1"></div>
        <hr className="border-dashed border-[#1f1d1a4d] mb-2 mt-10" />
        <div className="flex items-center flex-col justify-center pb-3 gap-2 pt-1">
          <Image
            height={100}
            width={130}
            className="powered__by__icon"
            src={minervaBlack}
            alt="pustack-logo"
            draggable={false}
          />
          <p className="text-xs">
            Powered By <strong>PuStack Education</strong>
          </p>
        </div>
      </div>
    )
  );
}
