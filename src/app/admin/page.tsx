import dynamic from "next/dynamic";
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
  return (
    <main className="h-screen overflow-auto">
      <Navbar />
      <JoditWrapper />
      {/* <button onClick={() => copyIt()}>Copy it</button> */}
    </main>
  );
}
