// "use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

interface ILinkState {}

const initLinkState = {
  isGuard: false,
  setLink: () => {},
};

export const LinkContext = createContext<UseLinkContextType>({
  state: initLinkState,
  navigationStack: [],
  isGuard: false,
  setGuard: () => {},
  setReplace: () => {},
});

const LinkContextProvider: FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const context = useLinkContext(initLinkState);

  return (
    <LinkContext.Provider value={context}>{children}</LinkContext.Provider>
  );
};

type UseLinkContextType = {
  state: ILinkState;
  navigationStack: string[];
  isGuard: boolean;
  setGuard: (active: boolean) => void;
  setReplace: (isReplace: boolean) => void;
};

type LinkAction = {
  type: string;
  payload: any;
};

function LinkReducer(state: ILinkState, action: LinkAction): ILinkState {
  switch (action.type) {
    default:
      return state;
  }
}

function useLinkContext(initState: ILinkState): UseLinkContextType {
  const [state] = useReducer(LinkReducer, initState);
  const guardRef = useRef(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [navigationStack, setNavigationStack] = useState<string[]>([]);
  const replaceRef = useRef(false); // Track if replace was called

  useEffect(() => {
    const currentRoute = pathname + "?" + searchParams.toString();

    setNavigationStack((prev) => {
      if (replaceRef.current) {
        // Replace the last entry if replace was used
        const newStack = [...prev];
        newStack[newStack.length - 1] = currentRoute;
        replaceRef.current = false; // Reset the replace flag
        return newStack;
      } else {
        // Push the new route otherwise
        return [...prev, currentRoute];
      }
    });
  }, [pathname, searchParams]);

  const setReplace = useCallback(() => {
    replaceRef.current = true;
  }, []);

  return {
    state,
    navigationStack,
    isGuard: guardRef.current,
    setGuard: (active: boolean) => {
      guardRef.current = active;
    },
    setReplace,
  };
}

function useLink(): UseLinkContextType {
  const context = useContext(LinkContext);
  if (context === undefined) {
    throw new Error("useLink must be used within a LinkContextProvider");
  }

  return context;
}

export { useLink, LinkContextProvider };
