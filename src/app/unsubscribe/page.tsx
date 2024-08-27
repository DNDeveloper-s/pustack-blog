import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/shared/Footer";
import axios from "axios";

export default async function unsubscribe({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const email = searchParams.email;

  if (!email) {
    return (
      <div className="h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-center px-3">No Email provided to unsubscribe.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const response = await axios.get(
    "https://us-central1-minerva-0000.cloudfunctions.net/unsubscribeEmail/?email=" +
      email
  );

  let msg = (
    <>
      Successfully unsubscribed <strong>{email}</strong> from all emails
    </>
  );

  if (response.status !== 200) {
    msg = (
      <>
        Failed to unsubscribe <strong>{email}</strong> from all emails
      </>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-6 justify-center py-20">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        width={512}
        height={512}
        viewBox="0 0 64 64"
        className="w-16 md:w-32 h-16 md:h-32"
      >
        <g fill="none" stroke="#4C4C4C" strokeWidth={2}>
          <path d="M63 62.446v-.553l-15.5-15.5h-31L1 61.893v.553m12.781-17.818L1 31.924m49.219 12.704L63 31.924M13.781 44.628 1 31.924" />
          <path d="M1 61.893V63h62v-1.107" />
          <path d="M22 18.161h-8.219L1 30.865V63m62 0V30.865L50.219 18.161H42" />
          <path d="M48 7.333 42.667 2 32 12.667 21.333 2 16 7.333 26.667 18 16 28.667 21.333 34 32 23.333 42.667 34 48 28.667 37.333 18zM32 32v2m0 2v2m0 2v2m-6 11h10m-10 4h10" />
        </g>
      </svg>
      <p className="text-center md:text-base text-medium px-6">{msg}</p>
    </div>
  );
}
