import { useSignupNewsLetters } from "@/api/newsletter";
import { Spinner } from "@nextui-org/spinner";
import { useEffect, useRef, useState } from "react";

function isValidEmail(email: string) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}
interface Status {
  error: string | null;
  sucess: string | null;
  loading: boolean;
}

export default function SignUpForNewsLettersButton({
  checkedLetters,
  containerClassName,
}: {
  checkedLetters: any[];
  containerClassName?: string;
}) {
  const {
    isPending,
    mutate: postSignUpNewsLetters,
    isSuccess,
  } = useSignupNewsLetters();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<Status>({
    error: null,
    sucess: null,
    loading: false,
  });

  useEffect(() => {
    if (isSuccess) {
      if (inputRef.current) inputRef.current.value = "";
      setStatus({
        error: null,
        sucess: "You are on the list",
        loading: false,
      });
    }
  }, [isSuccess]);

  const handleSignUpNewsLetters = () => {
    if (!isValidEmail(inputRef.current?.value ?? "")) {
      return setStatus({
        error: "Please enter a valid email",
        sucess: null,
        loading: false,
      });
    }

    if (checkedLetters.length === 0) {
      return setStatus({
        error: "Please select at least one newsletter",
        sucess: null,
        loading: false,
      });
    }

    postSignUpNewsLetters({
      email: inputRef.current?.value ?? "",
      newsLetters: checkedLetters.map((item) => ({
        id: item.key,
        title: item.title,
        description: item.description,
        frequency: item.frequency,
      })),
    });
  };

  return (
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
          setStatus({
            error: null,
            sucess: null,
            loading: false,
          });
        }}
      />
      <button
        className="font-featureHeadline email_button w-[84] flex items-center justify-center"
        onClick={handleSignUpNewsLetters}
      >
        {isPending ? <Spinner size="sm" color="warning" /> : "Sign Up"}
      </button>
      <div
        className={
          "input-feedback " +
          (status.sucess ? " show success" : status.error ? " show error" : "")
        }
      >
        {status.error || status.sucess}
      </div>
    </div>
  );
}
