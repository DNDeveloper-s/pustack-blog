import EventDetailPage from "@/components/Events/EventDetailPage";
import Events from "@/components/Events/Events";
import Navbar from "@/components/Navbar/Navbar";
import { ErrorMasterComponent } from "@/components/shared/ErrorComponent";
import Footer from "@/components/shared/Footer";
import { flattenDocumentData } from "@/firebase/event";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Metadata, ResolvingMetadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { redirect } from "next/navigation";

type Props = {
  params: { eventId: [string] };
  searchParams: { eventId: string };
};

export const revalidate = 0;

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  //fetch data
  // const post = await Post.get(params.postId[0], true);
  try {
    if (!searchParams.eventId)
      return {
        title: "Minerva",
        description: "Minerva",
        openGraph: {
          title: "Minerva",
          description: "Minerva",
          url: "https://pustack-blog.vercel.app/",
          siteName: "Minerva",
          images: [
            {
              url: "https://pustack-blog.vercel.app/minerva.svg",
            },
          ],
          locale: "en_US",
          type: "website",
        },
      };
    const docRef = doc(
      db,
      "events",
      "collections",
      "all_events",
      searchParams.eventId
    );
    const data = await getDoc(docRef);

    const event = flattenDocumentData(data);

    const _imageUrl = event.displayImage;

    const imageUrl = encodeURIComponent(_imageUrl ?? "");

    const processedImageUrl = `https://pustack-blog.vercel.app/api/generate-image?imageUrl=${imageUrl}`;
    const processedImageUrl2 = `https://pustack-blog.vercel.app/api/generate-image?imageUrl=${imageUrl}&width=450&height=235&overlayWidth=200&overlayHeight=200`;
    const processedImageUrl3 = `https://pustack-blog.vercel.app/api/generate-image?imageUrl=${imageUrl}&width=400&height=400&overlayWidth=200&overlayHeight=200`;
    const processedImageUrl4 = `https://pustack-blog.vercel.app/api/generate-image?imageUrl=${imageUrl}&width=514&height=269&overlayWidth=200&overlayHeight=200`;

    // optionally access and extend (rather than replace) parent metadata
    // const previousImages = (await parent).openGraph?.images || [];

    return {
      title: event.title,
      description: event.description,
      openGraph: {
        title: event.title,
        description: event.description,
        url: "https://pustack-blog.vercel.app/",
        siteName: "Minerva",
        images: [
          {
            url: processedImageUrl2,
            width: 450,
            height: 235,
          },
          {
            url: processedImageUrl,
            width: 450,
            height: 300,
          },
          {
            url: processedImageUrl3,
            width: 400,
            height: 400,
          },
        ],
        locale: "en_US",
        type: "website",
      },
    };
  } catch (e) {
    return {
      title: "Minerva",
      description: "Minerva",
      openGraph: {
        title: "Minerva",
        description: "Minerva",
        url: "https://pustack-blog.vercel.app/",
        siteName: "Minerva",
        images: [
          {
            url: "https://pustack-blog.vercel.app/minerva.svg",
          },
        ],
        locale: "en_US",
        type: "website",
      },
    };
  }
}

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

  return (
    <ErrorBoundary errorComponent={ErrorMasterComponent}>
      <Events
        eventId={eventId}
        _event={
          event
            ? {
                ...event,
                id: event?.id,
                timestamp: new Date(
                  event?.timestamp.seconds * 1000
                ).toISOString(),
                startTime: new Date(
                  event?.startTime.seconds * 1000
                ).toISOString(),
                endTime: new Date(event?.endTime.seconds * 1000).toISOString(),
              }
            : null
        }
      />
    </ErrorBoundary>
  );
}
