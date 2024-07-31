import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

export default function useStateWithQuery(
  key: string
): [boolean, (value: boolean) => void] {
  //   const [_open, _setOpen] = useState(false);
  const queryParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const open = useMemo(() => {
    return queryParams.has(key);
  }, [queryParams]);

  const setOpen = useCallback(
    (value: boolean) => {
      const params = new URLSearchParams(queryParams.toString());
      if (value) {
        params.set(key, "true");
      } else {
        params.delete(key);
      }
      const url = pathname + "?" + params.toString();
      router.push(url);
    },
    [queryParams, router, pathname]
  );

  return [open, setOpen];
}
