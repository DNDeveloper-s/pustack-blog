import BlogPost from "@/components/BlogPost/BlogPost";
import BlogPostV2 from "@/components/BlogPost/v2/BlogPost";
import { Post, flattenDocumentData, srcReducer } from "@/firebase/post";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { ErrorMasterComponent } from "@/components/shared/ErrorComponent";

type Props = {
  params: { postId: [string] };
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
    const docRef = doc(db, "posts", params.postId[0]);
    const data = await getDoc(docRef);

    const post = flattenDocumentData(data);

    const _imageUrl = post.meta.image;

    const imageUrl = encodeURIComponent(_imageUrl ?? "");

    const processedImageUrl = `https://minerva.news/api/generate-image?imageUrl=${imageUrl}`;
    const processedImageUrl2 = `https://minerva.news/api/generate-image?imageUrl=${imageUrl}&width=450&height=235&overlayWidth=200&overlayHeight=200`;
    const processedImageUrl3 = `https://minerva.news/api/generate-image?imageUrl=${imageUrl}&width=400&height=400&overlayWidth=200&overlayHeight=200`;
    const processedImageUrl4 = `https://minerva.news/api/generate-image?imageUrl=${imageUrl}&width=514&height=269&overlayWidth=200&overlayHeight=200`;

    // optionally access and extend (rather than replace) parent metadata
    // const previousImages = (await parent).openGraph?.images || [];

    return {
      title: post.title,
      description: post.meta.description,
      openGraph: {
        title: post.title,
        description: post.meta.description,
        url: "https://minerva.news/",
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
        url: "https://minerva.news/",
        siteName: "Minerva",
        images: [
          {
            url: "https://minerva.news/minerva.svg",
          },
        ],
        locale: "en_US",
        type: "website",
      },
    };
  }
}

export default async function PostId(props: { params: { postId: string[] } }) {
  // const post = await Post.get(props.params.postId[0], true);

  // console.log("post - ", post.title);
  let post = null;
  try {
    const docRef = doc(db, "posts", props.params.postId[0]);
    const data = await getDoc(docRef);

    if (data.exists() === false) {
      return redirect("/");
    }

    post = flattenDocumentData(data);
  } catch (e) {
    return redirect("/");
  }

  return (
    <div>
      <ErrorBoundary errorComponent={ErrorMasterComponent}>
        {post.sections ? (
          <BlogPostV2
            _post={{
              ...post,
              id: props.params.postId[0],
              timestamp: new Date(post.timestamp.seconds * 1000).toISOString(),
              flagged_at: post.flagged_at?.toDate().toISOString(),
            }}
          />
        ) : (
          <BlogPost
            _post={{
              ...post,
              id: props.params.postId[0],
              timestamp: new Date(post.timestamp.seconds * 1000).toISOString(),
              flagged_at: post.flagged_at?.toDate().toISOString(),
            }}
          />
        )}
      </ErrorBoundary>
    </div>
  );
}
