"use client";

import { useMediaQuery } from "react-responsive";
import Navbar, { NavbarMobile } from "../Navbar/Navbar";
import { MathJaxContext } from "better-react-mathjax";
import JoditWrapper from "./JoditWrapper";

export default function AdminPage() {
  const isTabletScreen = useMediaQuery({ query: "(max-width: 1024px)" });
  return (
    <main className="h-screen overflow-auto">
      {isTabletScreen ? <NavbarMobile /> : <Navbar />}
      <MathJaxContext>
        <JoditWrapper />
      </MathJaxContext>

      {/* <DraftEditor /> */}
      {/* <button onClick={() => copyIt()}>Copy it</button> */}
    </main>
  );
}
