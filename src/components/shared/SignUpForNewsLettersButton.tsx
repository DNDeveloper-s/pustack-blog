import { useCheckUserRSVP, useMutateRSVPNow } from "@/api/event";
import { useSignupNewsLetters } from "@/api/newsletter";
import { useUser } from "@/context/UserContext";
import { Spinner } from "@nextui-org/spinner";
import { useEffect, useRef, useState } from "react";
import { newsLettersList } from "../SignUpForNewsLetters/SignUpForNewsLetters";

export function isValidEmail(email: string) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

interface SignUpMinervaButtonProps {
  containerClassName?: string;
  [key: string]: any;
  checkedLetters?: any;
}
export default function SignUpForNewsLettersButton({
  containerClassName,
}: SignUpMinervaButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  //   const {
  //     mutate: postRSVPNow,
  //     isPending,
  //     error,
  //     isSuccess,
  //     isError,
  //     reset,
  //   } = useMutateRSVPNow();

  const {
    isPending,
    mutate: postSignUpNewsLetters,
    isSuccess,
    reset,
    error,
  } = useSignupNewsLetters();

  const _error = errorMessage || error?.message;

  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [isSignedUp, setIsSignedUp] = useState<boolean>(false);

  useEffect(() => {
    if (sessionEmail)
      window.sessionStorage.setItem("sessionSignUpMinervaEmail", sessionEmail);
  }, [sessionEmail]);

  useEffect(() => {
    if (!inputRef.current) return;
    if (user?.email) {
      inputRef.current.value = user?.email;
      setSessionEmail(user?.email);
    } else {
      const sessionStorage = window.sessionStorage.getItem(
        "sessionSignUpMinervaEmail"
      );
      if (sessionStorage) {
        inputRef.current.value = sessionStorage;
        setSessionEmail(sessionStorage);
        setIsSignedUp(true);
      } else {
      inputRef.current.value = "";
        setSessionEmail(null);
        setIsSignedUp(false);
      }
    }
  }, [user?.email]);

  useEffect(() => {
    if (isSuccess) {
      setIsSignedUp(true);
    }
  }, [isSuccess]);

  const handleSignUpButton = () => {
    if (!inputRef.current || isPending) return;
    const email = inputRef.current.value;

    const isValid = isValidEmail(email);

    if (!isValid) {
      setErrorMessage("Please enter a valid email address.");

      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      return;
    }

    setSessionEmail(email);

    postSignUpNewsLetters({
      email: inputRef.current?.value ?? "",
      newsLetters: newsLettersList.map((item) => ({
        id: item.key,
        title: item.title,
        description: item.description,
        frequency: item.frequency,
      })),
    });
  };

  if (isSignedUp)
    return (
      <>
        <p className="text-sm text-center font-featureHeadline style_intro leading-[120%]">
          Thanks for subscribing! You&apos;ll start receiving all updates at{" "}
          <b className="font-featureBold">
            {sessionEmail ?? inputRef.current?.value}
          </b>
        </p>
        <button
          className="mt-2 h-[40px] leading-[40px] w-full flex items-center justify-center border-[#1f1d1a] border font-featureRegular text-[16px]"
          onClick={() => setIsSignedUp(false)}
        >
          Sign Up with another email
        </button>
      </>
    );

  return (
    <>
      <div className="py-1">
        <p className="font-featureHeadline style_intro leading-[120%]">
          <b className="style_bold">Sign up for Minerva Principals:</b>
          {" What the Silicon Valley is reading. "}
          <span className="underline whitespace-nowrap">Read More</span>
        </p>
      </div>
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
          onClick={handleSignUpButton}
        >
          {isPending ? <Spinner size="sm" color="warning" /> : "Sign Up"}
        </button>
      </div>
      {_error && <p className="mt-1 text-xs text-danger-500">{_error}</p>}
      {isSuccess && (
        <p className="mt-1 text-xs text-green-500">
          You have successfully suscribed to the newsletter.
        </p>
      )}
    </>
  );
}
