import EventDetailPage from "@/components/Events/EventDetailPage";
import { ErrorMasterComponent } from "@/components/shared/ErrorComponent";
import { flattenDocumentData } from "@/firebase/event";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Metadata, ResolvingMetadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { redirect } from "next/navigation";

type Props = {
  params: { eventId: [string] };
  searchParams: { [key: string]: string | string[] | undefined };
};

export const revalidate = 0;

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  //fetch data
  // const post = await Post.get(params.postId[0], true);
  try {
    const docRef = doc(
      db,
      "events",
      "collections",
      "all_events",
      params.eventId[0]
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

export default async function EventId(props: {
  params: { eventId: string[] };
}) {
  // const post = await Event.get(props.params.postId[0], true);

  // console.log("post - ", post.title);
  let event = null;
  try {
    const docRef = doc(
      db,
      "events",
      "collections",
      "all_events",
      props.params.eventId[0]
    );
    const data = await getDoc(docRef);

    if (data.exists() === false) {
      console.log("Redirecting to home page | 115");
      return redirect("/");
    }

    event = flattenDocumentData(data);
  } catch (e) {
    console.log("Redirecting to home page | 121");
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
            startTime: new Date(event.startTime.seconds * 1000).toISOString(),
            endTime: new Date(event.endTime.seconds * 1000).toISOString(),
          }}
        />
      </ErrorBoundary>
    </div>
  );
}
