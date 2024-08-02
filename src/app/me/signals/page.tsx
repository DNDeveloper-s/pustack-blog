import dynamic from "next/dynamic";
const SignalsEntry = dynamic(
  () => import("@/components/Me/Signals/MySignalsPage"),
  {
    ssr: false,
  }
);

export const revalidate = 0;

export default async function PostDrafts() {
  return <SignalsEntry />;
}
