"use client";

import { url } from "@/constants";
import Link from "next/link";
import { forwardRef, useImperativeHandle, useState } from "react";
import SignUpForNewsLettersButton from "../shared/SignUpForNewsLettersButton";

function CheckboxControl(
  {
    onChange,
    defaultValue,
    id,
  }: {
    onChange?: (checked: boolean) => void;
    defaultValue?: boolean;
    id: string;
  },
  ref: any
) {
  const [checked, setChecked] = useState(defaultValue ?? false);

  useImperativeHandle(ref, () => ({
    isChecked: checked,
    setChecked,
  }));

  return (
    <div className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={26}
        height={22}
        fill="none"
        aria-hidden="true"
        style={{
          fill: "#f8f5d7",
          pointerEvents: "none",
        }}
        viewBox="0 0 24 22"
      >
        <rect
          width={19}
          height={19}
          x={0.5}
          y={1.5}
          fill="#FFECB7"
          stroke="#1F1D1A"
          // className="outline"
          rx={0}
          style={{
            fill: checked ? "#f8f5d7" : "inherit",
          }}
        />
        {checked && (
          <path
            stroke="#1F1D1A"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="m23.29 2-14 14L3 9.71"
            className="__web-inspector-hide-shortcut__"
          />
        )}
      </svg>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          setChecked(e.target.checked);
          onChange && onChange(e.target.checked);
        }}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
}

export const Checkbox = forwardRef(CheckboxControl);

function NewsLetterItem({
  onChange,
  item,
}: {
  onChange: (checked: boolean) => void;
  item: NewsLetterItem;
}) {
  return (
    <label htmlFor={item.key} className="flex gap-2 py-2 cursor-pointer group">
      <div className="mt-2 group-hover:scale-105">
        <Checkbox id={item.key} onChange={onChange} />
      </div>
      <div>
        <h2 className="text-[22px] font-featureHeadline">{item.title}</h2>
        <p className="text-[16px] leading-[120%] mt-1">{item.description}</p>
        <div className="mt-2 flex items-center gap-4 font-helvetica text-[14px] text-appBlack text-opacity-70">
          <p>{item.frequency}</p>
          <Link href={url}>
            <p>{item.action}</p>
          </Link>
        </div>
      </div>
    </label>
  );
}

interface NewsLetterItem {
  key: string;
  title: string;
  description: string;
  frequency: string;
  action: string;
}

export const newsLettersList = [
  {
    key: "1",
    title: "Flagship",
    description: "The daily global news briefing you can trust.",
    frequency: "2x/WEEKDAY",
    action: "READ IT",
  },
  {
    key: "2",
    title: "Principals",
    description: "What the White House is reading.",
    frequency: "WEEKDAYS",
    action: "READ IT",
  },
  {
    key: "3",
    title: "Business",
    description: "The stories (& the scoops) from Wall Street.",
    frequency: "2x/WEEK",
    action: "READ IT",
  },
  {
    key: "4",
    title: "Technology",
    description: "What's next in the new era of tech.",
    frequency: "2x/WEEK",
    action: "READ IT",
  },
  {
    key: "5",
    title: "Net Zero",
    description: "The nexus of politics, tech, and energy.",
    frequency: "2x/WEEK",
    action: "READ IT",
  },
  {
    key: "6",
    title: "Africa",
    description: "A rapidly-growing continent's crucial stories.",
    frequency: "3x/WEEK",
    action: "READ IT",
  },
  {
    key: "7",
    title: "Americana",
    description: "An insider's guide to American power.",
    frequency: "2x/WEEK",
    action: "READ IT",
  },
  {
    key: "8",
    title: "Media",
    description: "Media's essential read.",
    frequency: "SUNDAYS",
    action: "READ IT",
  },
];

interface Status {
  error: string | null;
  sucess: string | null;
  loading: boolean;
}

export default function SignUpForNewsLetters() {
  const [checkedLetters, setCheckedLetters] = useState<NewsLetterItem[]>([]);
  return (
    <div className="my-4">
      <div className="border-t border-appBlack py-1">
        <h2
          className="text-[18px] font-featureHeadline"
          style={{
            fontVariationSettings: '"wght" 495,"opsz" 10',
            fontWeight: 395,
          }}
        >
          Sign up for our Newsletters
        </h2>
      </div>
      <SignUpForNewsLettersButton
        containerClassName="flex mt-1"
        checkedLetters={checkedLetters}
      />
      {/* <div className="flex mt-1 relative">
        <input
          className="font-featureHeadline email_input"
          placeholder="Your Email address"
          type="text"
          style={{
            fontVariationSettings: '"wght" 400,"opsz" 10',
            borderInlineEnd: 0,
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
            (status.sucess
              ? " show success"
              : status.error
              ? " show error"
              : "")
          }
        >
          {status.error || status.sucess}
        </div>
      </div> */}
      <div className="flex flex-col divide-y divide-dashed divide-[#1f1d1a4d] my-4">
        <div className="text-center mb-2">
          <p>{checkedLetters.length} newsletters selected</p>
        </div>
        {newsLettersList.map((newsLetter, i) => (
          <NewsLetterItem
            key={newsLetter.key}
            item={newsLetter}
            onChange={(checked) => {
              setCheckedLetters((prev) =>
                checked
                  ? [...prev, newsLetter]
                  : prev.filter((item) => item.key !== newsLetter.key)
              );
              // setCheckedCount((prev) => (checked ? prev + 1 : prev - 1));
            }}
          />
        ))}
      </div>
    </div>
  );
}
