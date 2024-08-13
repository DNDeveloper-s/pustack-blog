// "use client";

import { FC, createContext, useContext, useReducer, useRef } from "react";

interface ILinkState {}

const initLinkState = {
    isGuard: false,
    setLink: () => {},
};

export const LinkContext = createContext<UseLinkContextType>({
    state: initLinkState,
    isGuard: false,
    setGuard: () => {},
});

const LinkContextProvider: FC<{ children: React.ReactElement }> = ({
    children,
}) => {
    const context = useLinkContext(initLinkState);

    return (
        <LinkContext.Provider value={context}>
            {children}
        </LinkContext.Provider>
    );
}

type UseLinkContextType = {
    state: ILinkState;
    isGuard: boolean;
    setGuard: (active: boolean) => void;
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

    return {
        state,
        isGuard: guardRef.current,
        setGuard: (active: boolean) => {
            guardRef.current = active;
        }
    };
}

function useLink(): UseLinkContextType {
    const context = useContext(LinkContext);
    if (context === undefined) {
      throw new Error(
        "useLink must be used within a LinkContextProvider"
      );
    }
  
    return context;
  }

export { useLink, LinkContextProvider };