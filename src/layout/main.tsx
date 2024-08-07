"use client";

import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/shared/Footer";

interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="max-w-[1440px] w-screen h-screen flex flex-col overflow-auto px-3 mx-auto">
      <Navbar />
      <div className="w-full overflow-auto py-10 flex-1 flex flex-col">
        <div className="w-full flex-1">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
