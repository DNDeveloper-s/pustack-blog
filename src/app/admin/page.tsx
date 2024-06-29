import AdminPage from "@/components/AdminEditor/AdminPage";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { redirect } from "next/navigation";

export default async function Admin({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const postId = searchParams.post_id;
  // const user = await getAuthenticatedAppForUser();

  // if (!user.currentUser?.uid) return redirect("/");

  return (
    <>
      <AdminPage postId={postId as string} />
    </>
  );
}
