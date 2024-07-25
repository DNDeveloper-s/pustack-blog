import {
  AppRouterContext,
  AppRouterInstance,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export const useInterceptAppRouter = <TMethod extends keyof AppRouterInstance>(
  method: TMethod,
  interceptFn: (
    original: AppRouterInstance[TMethod],
    ...args: Parameters<AppRouterInstance[TMethod]>
  ) => void
) => {
  const appRouter = use(AppRouterContext);

  useEffect(() => {
    if (!appRouter)
      throw new Error(
        "useInterceptAppRouter must be used within an App Router context"
      );
    const originalMethod = appRouter[method];

    appRouter[method] = ((...args: Parameters<AppRouterInstance[TMethod]>) => {
      interceptFn(originalMethod, ...args);
    }) as AppRouterInstance[TMethod];

    return () => {
      appRouter[method] = originalMethod;
    };
  }, [appRouter, method, interceptFn]);
};

export const useConfirmPageLeave = (shouldConfirm: boolean) => {
  const router = useRouter();
  useEffect(() => {
    const handlePageLeave = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    const handlePopState = (e: any) => {
      if (shouldConfirm) {
        const shouldProceed = window.confirm(
          "You have unsaved changes. Are you sure you want to leave?"
        );
        if (!shouldProceed) {
          // window.history.pushState(null, "", window.location.href + "admin");
          router.push("/admin");
        }
      }
      // if (shouldWarn) {
      //   setModalOpen(true);
      //   // Save the next route to navigate later
      //   setNextRoute(document.referrer);
      // }
      // setModalOpen(true);
      // setNextRoute(document.referrer);
      // console.log("popstate - ", window.location.href);
      // window.history.pushState(null, "", window.location.href + "admin"); // Prevent back navigation
      // router.push("/admin");
    };

    if (shouldConfirm) {
      window.addEventListener("beforeunload", handlePageLeave);
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handlePageLeave);
    };
  }, [shouldConfirm]);

  const handleIntercept = (proceed: () => void) => {
    if (!shouldConfirm) {
      return proceed();
    }
    const shouldProceed = window.confirm(
      "You have unsaved changes. Are you sure you want to leave?"
    );
    if (shouldProceed) {
      proceed();
    }
  };

  useInterceptAppRouter("push", (original, ...args) => {
    if (args[0] === "/admin") {
      original(...args);
      return;
    }
    handleIntercept(() => original(...args));
  });
  useInterceptAppRouter("replace", (original, ...args) => {
    handleIntercept(() => original(...args));
  });
  useInterceptAppRouter("replace", (original, ...args) => {
    handleIntercept(() => original(...args));
  });
  useInterceptAppRouter("back", (original, ...args) => {
    handleIntercept(() => original(...args));
  });
  useInterceptAppRouter("forward", (original, ...args) => {
    handleIntercept(() => original(...args));
  });
  useInterceptAppRouter("refresh", (original, ...args) => {
    handleIntercept(() => original(...args));
  });
};
