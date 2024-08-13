import { useCheckUserRSVP, useMutateRSVPNow } from "@/api/event";
import { useUser } from "@/context/UserContext";
import { Spinner } from "@nextui-org/spinner";
import { useEffect, useRef, useState } from "react";

interface RSVPNowButtonProps {
  containerClassName?: string;
  eventId: string;
}
export default function RSVPNowButton({
  containerClassName,
  eventId,
}: RSVPNowButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();

  const {
    mutate: postRSVPNow,
    isPending,
    error,
    isSuccess,
    isError,
    reset,
  } = useMutateRSVPNow();
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const { data: isUserRSVP } = useCheckUserRSVP(
    eventId,
    user?.email ?? sessionEmail,
    user?.uid
  );

  console.log("isUserRSVP - ", isUserRSVP, error);

  useEffect(() => {
    if (sessionEmail)
      window.sessionStorage.setItem("sessionEmail", sessionEmail);
  }, [sessionEmail]);

  useEffect(() => {
    if (!inputRef.current) return;
    if (user?.email) {
      inputRef.current.value = user?.email;
      setSessionEmail(user?.email);
    } else {
      inputRef.current.value = "";
    }
  }, [user?.email]);

  const handleRSVPButton = () => {
    if (!inputRef.current || isPending) return;
    const email = inputRef.current.value;

    setSessionEmail(email);

    postRSVPNow({
      userEmail: email,
      eventId,
      userId: user?.uid,
      enableRSVP: true,
    });
  };

  const handleUnRSVPButton = () => {
    const email = user?.email ?? sessionEmail;
    if (!email) return;
    postRSVPNow({
      userEmail: email,
      eventId,
      userId: user?.uid,
      enableRSVP: false,
    });
  };

  if (isUserRSVP)
    return (
      <>
        <p className="text-sm text-center font-featureHeadline style_intro leading-[120%]">
          See you there! We have email you the invitation at{" "}
          <b className="font-featureBold">
            {user?.email ?? inputRef.current?.value}
          </b>
        </p>
        <button
          className="mt-2 h-[40px] leading-[40px] w-full flex items-center justify-center border-[#1f1d1a] border font-featureRegular text-[16px]"
          onClick={handleUnRSVPButton}
        >
          {isPending ? (
            <Spinner size="sm" color="warning" />
          ) : (
            "I can't make it."
          )}
        </button>
      </>
    );

  return (
    <>
      <p className="text-sm font-featureHeadline style_intro leading-[120%]">
        <b className="font-featureBold">RSVP to this event, </b>and get
        notified.
      </p>
      <div className={"relative " + containerClassName}>
        <input
          className="font-featureHeadline email_input"
          placeholder="Your Email address"
          type="text"
          style={{
            fontVariationSettings: '"wght" 400,"opsz" 10',
            borderInlineEnd: 0,
            color: "#1f1d1a",
          }}
          ref={inputRef}
          onChange={() => {
            //   setStatus({
            //     error: null,
            //     sucess: null,
            //     loading: false,
            //   });
            reset();
          }}
        />
        <button
          className="font-featureHeadline email_button w-[108px] flex-shrink-0 flex items-center justify-center"
          onClick={handleRSVPButton}
        >
          {isPending ? <Spinner size="sm" color="warning" /> : "RSVP Now!"}
        </button>
      </div>
    </>
  );
}
