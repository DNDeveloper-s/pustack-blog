import dynamic from "next/dynamic";
const PublicationsEntry = dynamic(
  () => import("@/components/Me/Publications/Publications"),
  {
    ssr: false,
  }
);

export const revalidate = 0;

export default function MyPublications() {
  return <PublicationsEntry />;
}
