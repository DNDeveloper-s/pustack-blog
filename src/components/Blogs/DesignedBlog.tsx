import { SnippetDesign } from "@/firebase/post";
import BlogWithAuthor, {
  BlogBaseProps,
  BlogWithAuthorV2,
} from "./BlogWithAuthor";
import BlueCircleBlog from "./BlueCircleBlog";

export default function DesignedBlog(props: BlogBaseProps) {
  if (!props.post?.snippetDesign) {
    return <BlogWithAuthor {...props} />;
  }
  return (
    <>
      {props.post?.snippetDesign === SnippetDesign.DETAILED_CARD && (
        <BlogWithAuthorV2 {...props} />
      )}
      {props.post?.snippetDesign === SnippetDesign.CLASSIC_CARD && (
        <BlogWithAuthor {...props} />
      )}
      {props.post?.snippetDesign === SnippetDesign.COMPACT_CARD && (
        <BlogWithAuthorV2 {...props} noImage />
      )}
      {props.post?.snippetDesign === SnippetDesign.SIMPLE_LIST && (
        <BlueCircleBlog {...props} />
      )}
    </>
  );
}
