import { useEffect, useState } from "react";

export default function useAppleDevice() {
  const [is, setIs] = useState<boolean | null>(null);

  useEffect(() => {
    setIs(
      /iPad|iPhone|iPod/.test(navigator?.userAgent) ||
        navigator.userAgent.includes("Macintosh")
    );
  }, []);

  return is;
}
