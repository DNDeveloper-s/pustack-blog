"use client";

import { useMediaQuery } from "react-responsive";
import Politics from "../Politics/Politics";
import Business from "../Business/Business";
import Technology from "../Technology/Technology";
import Africa from "../Africa/Africa";
import NetZero from "../NetZero/NetZero";
import Security from "../Security/Security";
import Media from "../Media/Media";
import SignUpForNewsLetters from "../SignUpForNewsLetters/SignUpForNewsLetters";
import Footer from "../shared/Footer";
import ArtificialIntelligence from "../ArtificialIntelligence/ArtificialIntelligence";
import SiliconValley from "../SiliconValley/SiliconValley";
import ProductManagement from "../ProductManagement/ProductManagement";
import More from "../More/More";
import LandingPageSectionLayout from "./LandingPageSectionLayout";

const sections = [
  { id: "artificial-intelligence", label: "Artificial Intelligence" },
  { id: "technology", label: "Technology" },
  { id: "silicon-valley", label: "Silicon Valley" },
  { id: "product-management", label: "Product Management" },
  { id: "others", label: "Others" },
];

export default function LandingPageSections() {
  const isTabletScreen = useMediaQuery({ query: "(max-width: 1024px)" });

  return (
    <div className="">
      {sections.map((section) => (
        <LandingPageSectionLayout
          key={section.id}
          label={section.label as any}
          topics={[section.id] as any}
          limit={10}
        />
      ))}
      {isTabletScreen && <SignUpForNewsLetters />}
    </div>
  );
}
