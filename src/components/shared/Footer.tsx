"use client";

import useScreenSize from "@/hooks/useScreenSize";
/**
 * @file Footer.tsx
 *
 * Component to display the footer of the application.
 * This component is used to display the footer of the application.
 * It is a shared component that is used across the application.
 * It is a functional component that returns a div element.
 *
 */

import Logo from "./Logo";

/**
 *
 * Newsletters
 * Events
 * YouTube
 * Twitter
 * Facebook
 * About
 * Careers
 * Privacy
 * Consent Preferences
 */

const footerData = [
  { key: "newsletters", label: "Newsletters" },
  { key: "events", label: "Events" },
  { key: "youtube", label: "YouTube" },
  { key: "twitter", label: "Twitter" },
  { key: "facebook", label: "Facebook" },
  { key: "about", label: "About" },
  { key: "careers", label: "Careers" },
  { key: "privacy", label: "Privacy" },
  { key: "consentPreferences", label: "Consent Preferences" },
];

function MobileFooter() {
  return (
    <div className="border-t border-dashed border-[#1f141d75]] pb-2 py-3">
      <div className="flex flex-col justify-center items-center">
        <div className="w-auto">
          <Logo
            linkStyle={{
              height: "25px",
              display: "block",
            }}
            linkClassName="md:my-0 my-2"
            withMini
          />
        </div>
        <div className="pl-4 font-helvetica text-[12px]">
          <span>
            Powered by{" "}
            <strong className="font-helvetica font-bold">
              PuStack Education 1.0.0
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const { isSmallScreen } = useScreenSize();

  if (isSmallScreen) {
    return <MobileFooter />;
  }

  return (
    <div className="border-t border-appBlack md:mx-0 pb-8 py-4 md:pb-8">
      <div className="flex gap-x-4 gap-y-2 md:justify-between flex-wrap items-center">
        <div className="w-full md:w-auto">
          <Logo
            linkStyle={{
              height: "25px",
              display: "block",
            }}
            linkClassName="md:my-0 my-2"
            withMini
          />
        </div>
        {footerData.map((item) => (
          <div
            key={item.key}
            className="text-appBlack font-featureHeadline text-[16px]"
            style={{
              fontVariationSettings: '"wght" 500,"opsz" 10',
            }}
          >
            {item.label}
          </div>
        ))}
        <div className="pl-4">
          <span>© 2024 Minerva Inc.</span>
        </div>
      </div>
    </div>
  );
}
