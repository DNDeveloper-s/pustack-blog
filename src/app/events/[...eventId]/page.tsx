import EventDetailPage from "@/components/Events/EventDetailPage";
import { ErrorMasterComponent } from "@/components/shared/ErrorComponent";
import { flattenDocumentData } from "@/firebase/event";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { redirect } from "next/navigation";

export default async function EventId(props: {
  params: { eventId: string[] };
}) {
  // const post = await Event.get(props.params.postId[0], true);

  // console.log("post - ", post.title);
  let event = null;
  try {
    const docRef = doc(db, "events", props.params.eventId[0]);
    const data = await getDoc(docRef);

    if (data.exists() === false) {
      return redirect("/");
    }

    event = flattenDocumentData(data);
  } catch (e) {
    return redirect("/");
  }

  return (
    <div>
      <ErrorBoundary errorComponent={ErrorMasterComponent}>
        <EventDetailPage
          _event={{
            ...event,
            id: event.id,
            timestamp: new Date(event.timestamp.seconds * 1000).toISOString(),
          }}
        />
      </ErrorBoundary>
    </div>
  );
}
