"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function NavigationEvents() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const prevUrl = useRef<null | string | undefined>(pathname);

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    console.log("prevUrl.current - ", prevUrl.current);
    // console.log(url, document.referrer);
    // if (prevUrl.current === "/admin?") {
    //   const shouldProceed = window.confirm(
    //     "You have unsaved changes. Are you sure you want to leave?"
    //   );
    //   if (!shouldProceed) {
    //     // window.history.pushState(null, "", window.location.href + "admin");
    //     router.push("/admin");
    //   }
    // }

    // if (!shouldProceed) {
    //   // window.history.pushState(null, "", window.location.href + "admin");
    //   router.push("/admin");
    // }
    // throw new Error("Admin page is not allowed");
    // throw `Route change to ${url} was aborted. This error can be safely ignored.`;
    // }
    // You can now use the current URL
    // ...
    prevUrl.current = url;
  }, [pathname, searchParams]);

  return null;
}
