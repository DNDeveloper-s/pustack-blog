// In Next.js, this file would be called: app/providers.jsx
"use client";

// We can not useState or useRef in a server component, which is why we are
// extracting this part out into it's own file with 'use client' on top
import React, { useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "@/context/UserContext";
import { User } from "firebase/auth";
import { LinkContextProvider } from "@/context/LinkContext";
import { BlogImageContextProvider } from "@/context/BlogImageContext";
import { notification } from "antd";
import {
  ArgsProps,
  NotificationInstance,
  NotificationPlacement,
} from "antd/es/notification/interface";
import { NotificationContextProvider } from "@/context/NotificationContext";
import { JoinModalContextProvider } from "@/context/JoinModalContext";
import JoinModal from "@/components/shared/JoinModal";
// import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
// import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

let browserPersister: ReturnType<typeof makePersister> | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

function makePersister() {
  // return createSyncStoragePersister({
  //   storage: window.localStorage,
  // });
}

function getPersistor() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return {};
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    // if (!browserPersister) browserPersister = makePersister();
    return browserPersister;
  }
}

const Context = React.createContext({ name: "Default" });

export default function Providers({ children }: { children: React.ReactNode }) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (
    placement: NotificationPlacement,
    props: ArgsProps,
    type: keyof Omit<NotificationInstance, "destroy"> = "success"
  ) => {
    api[type]({
      placement,
      showProgress: true,
      closable: false,
      pauseOnHover: true,
      ...props,
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <>
        <BlogImageContextProvider>
          <>
            <NotificationContextProvider
              openNotification={openNotification}
              destroy={api.destroy}
            >
              <>
                {contextHolder}
                <UserProvider>
                  <JoinModalContextProvider>
                    {children}
                    <JoinModal />
                  </JoinModalContextProvider>
                </UserProvider>
              </>
            </NotificationContextProvider>
          </>
        </BlogImageContextProvider>
      </>
    </QueryClientProvider>
  );
}
