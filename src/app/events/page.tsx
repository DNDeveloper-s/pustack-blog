import Events from "@/components/Events/Events";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/shared/Footer";

export default function EventsPage() {
  return (
    <main className="w-full max-w-[1440px] mx-auto px-3">
      <Navbar />
      <Events />
      <Footer />
    </main>
  );
}
