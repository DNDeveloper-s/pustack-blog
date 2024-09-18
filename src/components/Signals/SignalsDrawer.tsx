import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@nextui-org/spinner";
import SignalsMobile from "./SignalsMobile";
import PageDrawer from "../shared/PageDrawer";
import { useLink } from "@/context/LinkContext";

export default function SignalDrawer({ _signals }: { _signals?: any }) {
  const searchParams = useSearchParams();
  const { navigationStack } = useLink();
  const router = useRouter();

  const signalId = searchParams.get("signal_drawer_id");

  const handleClose = () => {
    // const url = new URLSearchParams(searchParams.toString());
    // url.delete("signal_drawer_id");
    // router.push(`${pathname}?${url.toString()}`, { scroll: true });
    if (navigationStack.length === 1) {
      return router.push("/signals");
    }
    router.back();
  };

  return (
    <div>
      <PageDrawer open={!!signalId} onClose={handleClose}>
        {!_signals ? (
          <div className="h-full w-full flex items-center justify-center">
            <Spinner
              color="warning"
              size="md"
              label="Hang on, while we are fetching signals"
            />
          </div>
        ) : (
          <SignalsMobile _signals={_signals} startAt={signalId} />
        )}
      </PageDrawer>
    </div>
  );
}
