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

export default function Footer() {
  return (
    <div className="border-t-2 border-appBlack mx-3 md:mx-4 pb-8 md:pb-2">
      <div className="flex gap-1 md:gap-4 md:justify-between flex-wrap items-center">
        <div className="w-full md:w-auto">
          <Logo size="sm" />
        </div>
        {footerData.map((item) => (
          <div
            key={item.key}
            className="text-white px-4 font-featureHeadline"
            style={{
              fontVariationSettings: '"wght" 500,"opsz" 10',
            }}
          >
            {item.label}
          </div>
        ))}
        <div className="pl-4">
          <span>© 2024 Semafor Inc.</span>
        </div>
      </div>
    </div>
  );
}
