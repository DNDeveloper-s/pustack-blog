import { useGetPostsByCategory } from "@/api/post";
import { ampersandImage } from "@/assets";
import { chunk, sortBy } from "lodash";
import Image from "next/image";
import { useMemo } from "react";
import DesignedBlog from "../Blogs/DesignedBlog";

interface MoreFromMinervaProps {
  category: string;
}
export default function MoreFromMinerva(props: MoreFromMinervaProps) {
  const { data: posts } = useGetPostsByCategory({ category: props.category });

  const chunkedPosts = useMemo(() => {
    return chunk(sortBy(posts ?? [], "post.timestamp"), 2);
  }, [posts]);

  console.log("chunkedPosts - ", chunkedPosts);

  return (
    posts && (
      <div>
        <hr
          style={{
            margin: "60px 0 0",
            borderColor: "#1f1d1a",
            borderBottom: 0,
          }}
        />
        <hr
          style={{
            margin: "60px 0 0",
            borderColor: "#1f1d1a",
            borderBottom: 0,
            marginTop: "2px",
            marginBottom: "10px",
          }}
        />
        <div className="styles_title flex items-center gap-3">
          <Image src={ampersandImage} width={20} height={16} alt="Ampersand" />
          <h2 style={{ marginBottom: 0 }}>More from Minerva</h2>
        </div>
        <div className="grid divide-y divide-dashed divide-[#1f1d1a4d]">
          {chunkedPosts?.map((postChunkOf2, i) => (
            <div
              key={i}
              className="grid grid-cols-2 divide-x divide-dashed divide-[#1f1d1a4d] py-3"
            >
              {postChunkOf2.map((post, j) => (
                <div key={post.id} className={j % 2 === 0 ? "pr-3" : "pl-3"}>
                  <DesignedBlog size="sm" post={post} />
                </div>
              ))}
            </div>
          ))}
          {/* <div className="pr-3">
            <BlogWithAuthorV2 size="sm" />
          </div>
          <div className="pl-3">
            <BlogWithAuthor size="sm" />
          </div> */}
        </div>
      </div>
    )
  );
}
