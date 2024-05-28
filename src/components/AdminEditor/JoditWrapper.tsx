"use client";

import { useEffect, useRef, useState } from "react";
import JoditEditor from "./JoditEditor";
import { Post } from "@/firebase/post";
import { useCreatePost } from "@/api/post";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { MathJax } from "better-react-mathjax";

const dummyAuthor = {
  name: "John Doe",
  email: "johndoe@gmail.com",
  photoURL:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwMtTVob9_kP89ahzHe8zbQLNio88s0UDBDqlDjbkpBQ&s",
};

const TOPICS = [
  { key: "", value: "Select Topic", disabled: true },
  { key: "politics", value: "Politics" },
  { key: "business", value: "Business" },
  { key: "technology", value: "Technology" },
  { key: "africa", value: "Africa" },
  { key: "net-zero", value: "Net Zero" },
  { key: "security", value: "Security" },
  { key: "media", value: "Media" },
  { key: "others", value: "Others" },
];

export default function JoditWrapper() {
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { mutate: postCreatePost, isPending } = useCreatePost({
    onSuccess: () => {
      setTopic("");
      setContent("");
      if (inputRef.current) inputRef.current.value = "";
      router.push("/");
    },
  });

  useEffect(() => {
    Post.get("thanks-to-the-title-4", true)
      .then((snapshot) => {
        if (inputRef.current) inputRef.current.value = snapshot.title;
        setContent(snapshot.content);
      })
      .catch((error) => console.error("Error getting document:", error));
  }, []);

  async function handleCreatePost() {
    if (isPending) return;

    const isValid = inputRef.current?.value && content && topic;

    if (!isValid) {
      setError("Please fill all fields");
      return;
    }

    const post = new Post(
      inputRef.current?.value || "Untitled",
      content,
      dummyAuthor,
      topic
    );

    postCreatePost(post);
  }

  return (
    <div className="w-full max-w-[1100px] mx-auto py-2 px-3">
      <div>
        <h2 className="text-appBlack text-[30px] mt-8 font-larkenExtraBold">
          Create Post
        </h2>
      </div>
      {error && <p className="text-red-500 text-sm my-2">{error}</p>}
      <div className="mt-5">
        <h4 className="text-[12px] font-helvetica uppercase ml-1 mb-1 text-appBlack">
          Post Title
        </h4>
        <input
          disabled={isPending}
          className="border text-[16px] w-full flex-1 flex-shrink py-1 px-2 bg-lightPrimary focus:outline-appBlack focus:outline-offset-[-2]"
          placeholder="Enter the Post Title"
          type="text"
          style={{
            fontVariationSettings: '"wght" 400,"opsz" 10',
            borderInlineEnd: 0,
          }}
          ref={inputRef}
        />
      </div>
      <div className="mt-5">
        <h4 className="text-[12px] font-helvetica uppercase ml-1 mb-1 text-appBlack">
          Topic
        </h4>
        <select
          disabled={isPending}
          onChange={(e) => {
            setTopic(e.target.value);
          }}
          className="border text-[16px] w-full flex-1 flex-shrink py-2 px-2 bg-lightPrimary focus:outline-appBlack focus:outline-offset-[-2]"
        >
          {TOPICS.map((_topic) => (
            <option
              selected={topic === _topic.value}
              key={_topic.key}
              value={_topic.key}
              disabled={_topic.disabled}
            >
              {_topic.value}
            </option>
          ))}
        </select>
      </div>
      <JoditEditor content={content} setContent={setContent} />
      <div className="flex justify-end gap-4 mb-10">
        <Button
          isDisabled={isPending}
          className="h-9 px-5 rounded bg-appBlue text-primary text-xs uppercase font-featureRegular"
          onClick={handleCreatePost}
          variant="flat"
          color="primary"
          isLoading={isPending}
        >
          Create Post
        </Button>
      </div>
    </div>
  );
}
