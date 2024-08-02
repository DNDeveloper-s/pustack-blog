import dynamic from "next/dynamic";
const AdminPage = dynamic(() => import("@/components/AdminEditor/AdminPage"), {
  ssr: false,
});
import { ErrorMasterComponent } from "@/components/shared/ErrorComponent";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

export default async function Admin({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const postId = searchParams.post_id;

  return (
    <>
      <ErrorBoundary errorComponent={ErrorMasterComponent}>
        <AdminPage postId={postId as string} />
      </ErrorBoundary>
    </>
  );
}
