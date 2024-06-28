import AdminPage from "@/components/AdminEditor/AdminPage";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";

export default async function Admin({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const postId = searchParams.post_id;
  const user = await getAuthenticatedAppForUser();

  return (
    <>
      <p>{JSON.stringify(user)}</p>
      <AdminPage postId={postId as string} />
    </>
  );
}
