import EventDetailPage from "@/components/Events/EventDetailPage";
import Events from "@/components/Events/Events";
import Navbar from "@/components/Navbar/Navbar";
import { ErrorMasterComponent } from "@/components/shared/ErrorComponent";
import Footer from "@/components/shared/Footer";
import { flattenDocumentData } from "@/firebase/event";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { redirect } from "next/navigation";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { event_id: string };
}) {
  const eventId = searchParams.event_id;
  let event = null;

  if (eventId) {
    try {
      const docRef = doc(db, "events", "collections", "all_events", eventId);
      const data = await getDoc(docRef);

      if (data.exists() === false) {
        return redirect("/events");
      }

      event = flattenDocumentData(data);
    } catch (e) {
      console.log("e - ", e);
      return redirect("/");
    }
  }

  console.log('event - ', event)

  if (event) {
    return (
      <div>
        <ErrorBoundary errorComponent={ErrorMasterComponent}>
          <EventDetailPage
            _event={{
              ...event,
              id: event.id,
              timestamp: new Date(event.timestamp.seconds * 1000).toISOString(),
              startTime: new Date(event.startTime.seconds * 1000).toISOString(),
              endTime: new Date(event.endTime.seconds * 1000).toISOString(),
            }}
          />
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <ErrorBoundary errorComponent={ErrorMasterComponent}>
      <main className="w-full max-w-[1440px] mx-auto px-3">
        <Navbar />
        <Events eventId={eventId} />
        <Footer />
      </main>
    </ErrorBoundary>
  );
}
