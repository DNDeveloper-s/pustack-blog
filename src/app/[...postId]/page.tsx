import BlogPost from "@/components/BlogPost/BlogPost";
import { Post, flattenDocumentData, srcReducer } from "@/firebase/post";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Metadata, ResolvingMetadata } from "next";
import { JSDOM } from "jsdom";

type Props = {
  params: { postId: [string] };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
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
      images: _images?.map((image: string) => ({
        url: image,
        width: 800,
        height: 600,
      })),
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
  const post = flattenDocumentData(data);

  return (
    <div>
      <BlogPost _post={post} />
    </div>
  );
}
