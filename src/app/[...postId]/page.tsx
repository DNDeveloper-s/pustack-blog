import BlogPost from "@/components/BlogPost/BlogPost";
import { Post, flattenDocumentData, srcReducer } from "@/firebase/post";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Metadata, ResolvingMetadata } from "next";
import { JSDOM } from "jsdom";
import useUserSession from "@/hooks/useUserSession";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { redirect } from "next/navigation";

type Props = {
  params: { postId: [string] };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  //fetch data
  // const post = await Post.get(params.postId[0], true);
  const docRef = doc(db, "posts", params.postId[0]);
  const data = await getDoc(docRef);

  const post = flattenDocumentData(data);

  const dom = new JSDOM(post.content, {
    contentType: "text/html",
  });

  const _images = Array.from(
    dom.window.document.getElementsByTagName("img")
  ).reduce(srcReducer, []);

  const _imageUrl = _images[0];

  const imageUrl = encodeURIComponent(_imageUrl);

  const processedImageUrl = `https://pustack-blog.vercel.app/api/generate-image?imageUrl=${imageUrl}`;
  const processedImageUrl2 = `https://pustack-blog.vercel.app/api/generate-image?imageUrl=${imageUrl}&width=450&height=235&overlayWidth=200&overlayHeight=200`;
  const processedImageUrl3 = `https://pustack-blog.vercel.app/api/generate-image?imageUrl=${imageUrl}&width=400&height=400&overlayWidth=200&overlayHeight=200`;
  const processedImageUrl4 = `https://pustack-blog.vercel.app/api/generate-image?imageUrl=${imageUrl}&width=514&height=269&overlayWidth=200&overlayHeight=200`;

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || [];

  return {
    title: post.title,
    description: post.content,
    openGraph: {
      title: post.title,
      description: post.content,
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
}

export default async function PostId(props: { params: { postId: string[] } }) {
  // console.log("props", props);

  // const post = await Post.get(props.params.postId[0], true);

  // console.log("post - ", post.title);
  const docRef = doc(db, "posts", props.params.postId[0]);
  const data = await getDoc(docRef);

  if (data.exists() === false) {
    return redirect("/");
  }

  const post = flattenDocumentData(data);

  return (
    <div>
      <BlogPost
        _post={{
          ...post,
          id: props.params.postId[0],
          timestamp: new Date(post.timestamp.seconds * 1000).toISOString(),
          flagged_at: post.flagged_at?.toDate().toISOString(),
        }}
      />
    </div>
  );
}
