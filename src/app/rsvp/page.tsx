import dynamic from "next/dynamic";
const RSVPedPage = dynamic(() => import("@/components/RSVP/RSVPedPage"), {
  ssr: false,
});

export default function RSVPedEvents() {
  return <RSVPedPage />;
}
