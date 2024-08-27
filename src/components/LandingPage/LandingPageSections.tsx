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

export default function LandingPageSections() {
  const isTabletScreen = useMediaQuery({ query: "(max-width: 1024px)" });

  return (
    <div className="">
      <ArtificialIntelligence />
      <Technology />
      <SiliconValley />
      <ProductManagement />
      <More />
      {/* <Politics />
      <Business />
      <Technology />
      <Africa />
      <NetZero />
      <Security />
      <Media /> */}
      {isTabletScreen && <SignUpForNewsLetters />}
    </div>
  );
}
