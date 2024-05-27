"use client";

import { NavbarMobile } from "@/components/Navbar/Navbar";
import dynamic from "next/dynamic";
import { useMediaQuery } from "react-responsive";
const JoditWrapper = dynamic(
  () => import("@/components/AdminEditor/JoditWrapper"),
  {
    ssr: false,
  }
);
const Navbar = dynamic(() => import("@/components/Navbar/Navbar"), {
  ssr: false,
});
// import JoditWrapper from "@/components/AdminEditor/JoditWrapper";
// import Navbar from "@/components/Navbar/Navbar";

export default function Admin() {
  const isTabletScreen = useMediaQuery({ query: "(max-width: 1024px)" });
  return (
    <main className="h-screen overflow-auto">
      {isTabletScreen ? <NavbarMobile /> : <Navbar />}
      <JoditWrapper />
      {/* <button onClick={() => copyIt()}>Copy it</button> */}
    </main>
  );
}
