import Events from "@/components/Events/Events";
import Navbar from "@/components/Navbar/Navbar";
import { ErrorMasterComponent } from "@/components/shared/ErrorComponent";
import Footer from "@/components/shared/Footer";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

export default function EventsPage() {
  return (
    <ErrorBoundary errorComponent={ErrorMasterComponent}>
      <main className="w-full max-w-[1440px] mx-auto px-3">
        <Navbar />
        <Events />
        <Footer />
      </main>
    </ErrorBoundary>
  );
}
