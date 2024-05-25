"use client";

import JoditWrapper from "@/components/AdminEditor/JoditWrapper";
import Navbar from "@/components/Navbar/Navbar";

export default function Admin() {
  return (
    <main className="h-screen overflow-auto">
      <Navbar />
      <JoditWrapper />
      {/* <button onClick={() => copyIt()}>Copy it</button> */}
    </main>
  );
}
