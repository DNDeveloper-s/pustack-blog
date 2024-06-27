import AdminPage from "@/components/AdminEditor/AdminPage";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";

export default async function Admin({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const postId = searchParams.post_id;
  return <AdminPage postId={postId as string} />;
}
