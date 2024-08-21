import CreateEventEntry from "@/components/Events/CreateEventEntry";
import Layout from "@/layout/main";
import { Suspense } from "react";

export default function CreateEventsPage() {
  return (
    <Suspense fallback={<p>Loading</p>}>
      <CreateEventEntry />
    </Suspense>
  );
}
