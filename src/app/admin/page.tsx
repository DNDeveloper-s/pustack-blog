import AdminPage from "@/components/AdminEditor/AdminPage";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";

export default async function Admin() {
  return <AdminPage />;
}
