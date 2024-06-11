"use client";

import Africa from "@/components/Africa/Africa";
import Business from "@/components/Business/Business";
import Dashboard from "@/components/Dashboard/Dashboard";
import Media from "@/components/Media/Media";
import Navbar from "@/components/Navbar/Navbar";
import NetZero from "@/components/NetZero/NetZero";
import Politics from "@/components/Politics/Politics";
import Security from "@/components/Security/Security";
import SignUpForNewsLetters from "@/components/SignUpForNewsLetters/SignUpForNewsLetters";
import Technology from "@/components/Technology/Technology";
import Footer from "@/components/shared/Footer";
import { useMediaQuery } from "react-responsive";

export default function Home() {
  const isTabletScreen = useMediaQuery({ query: "(max-width: 1024px)" });
  return (
    <main className="w-full max-w-[1440px] mx-auto px-0 md:px-3">
      <Navbar />
      <div className="">
        <Dashboard />
        <div className="px-3 md:px-0">
          <Politics />
          <Business />
          <Technology />
          <Africa />
          <NetZero />
          <Security />
          <Media />
          {isTabletScreen && (
            <div className="px-3">
              <SignUpForNewsLetters />
            </div>
          )}
          <Footer />
        </div>
      </div>
    </main>
  );
}
