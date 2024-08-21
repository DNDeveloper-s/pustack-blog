import { Inter } from "next/font/google";
import "./globals.css";
import "./contact.css";
import Providers from "./providers";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { Metadata } from "next";
import Script from "next/script";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { ErrorMasterComponent } from "@/components/shared/ErrorComponent";
import { Suspense } from "react";
import { NavigationEvents } from "@/components/NavigationEvents";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar/Navbar";
import Layout from "@/layout/main";
// import BottomNavBar from "@/components/Navbar/BottomNavBar/BottomNavBar";
const BottomNavBar = dynamic(
  () => import("@/components/Navbar/BottomNavBar/BottomNavBar")
);

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
//   favicon: "/favicon.ico",
// };

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode;
}>) {
  // const doc = await getAuthenticatedAppForUser();

  return (
    <html lang="en">
      <body>
        <ErrorBoundary errorComponent={ErrorMasterComponent}>
          <Providers>
            <Layout>
              {children}
              {modal}
            </Layout>
          </Providers>
        </ErrorBoundary>

        <Suspense fallback={null}>
          <NavigationEvents />
        </Suspense>
      </body>
    </html>
  );
}
