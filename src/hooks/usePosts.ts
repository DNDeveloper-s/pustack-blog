import { useQueryPosts } from "@/api/post";

const postCategories = [
    'with text only',
    'with author, topic, image, headline and paragraph',
    'with author, topic, headling, paragraph and quote'
]

export const usePosts = () => {
  const { data: posts } = useQueryPosts();

  

  return { posts };
};
