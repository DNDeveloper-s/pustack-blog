"use client";

import BottomNavBar from "@/components/Navbar/BottomNavBar/BottomNavBar";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/shared/Footer";
import useScreenSize from "@/hooks/useScreenSize";
import { usePathname } from "next/navigation";

interface RouteConfigState {
  href: string;
  hideNavbar?: boolean;
  hideFooter?: boolean;
  noPadding?: boolean;
  classNames?: {
    childWrapper?: string;
  };
  isSmallScreen?: boolean;
  isMobileScreen?: boolean;
}

const routesConfig: RouteConfigState[] = [
  {
    href: "/contact",
    hideNavbar: true,
    hideFooter: true,
    noPadding: true,
    classNames: { childWrapper: "flex flex-col" },
  },
  {
    href: "/contact-us",
    classNames: { childWrapper: "flex" },
  },
  { href: "/signals", hideFooter: true },
  { href: "/posts/create", hideFooter: true },
  { href: "/events", hideNavbar: true, hideFooter: true, isSmallScreen: true },
  {
    href: "/me/publications",
    hideNavbar: true,
    hideFooter: true,
    isSmallScreen: true,
  },
  {
    href: "/saved",
    hideNavbar: true,
    hideFooter: true,
    isSmallScreen: true,
  },
  {
    href: "/rsvp",
    hideNavbar: true,
    hideFooter: true,
    isSmallScreen: true,
  },
  { href: "/events", hideFooter: true },
];

interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const { isSmallScreen, isTabletScreen } = useScreenSize();

  const route = routesConfig.find(
    (route) =>
      route.href === pathname &&
      (route.isSmallScreen !== undefined
        ? route.isSmallScreen === isSmallScreen
        : true)
  );

  return (
    <div
      className={
        "max-w-[1440px] w-screen h-auto flex flex-col mx-auto " +
        (route?.noPadding ? "" : "px-3")
      }
      style={{
        minHeight: "100%",
      }}
    >
      {!route?.hideNavbar && <Navbar />}
      <div className={"w-full flex-1 flex flex-col"}>
        <div
          className={"w-full flex-1 " + (route?.classNames?.childWrapper ?? "")}
        >
          {children}
        </div>
        {!route?.hideFooter && <Footer />}
        <BottomNavBar />
      </div>
    </div>
  );
}
