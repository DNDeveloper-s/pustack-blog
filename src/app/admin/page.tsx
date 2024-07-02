import AdminPage from "@/components/AdminEditor/AdminPage";
import { ErrorMasterComponent } from "@/components/shared/ErrorComponent";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
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
      <ErrorBoundary errorComponent={ErrorMasterComponent}>
        <AdminPage postId={postId as string} />
      </ErrorBoundary>
    </>
  );
}
