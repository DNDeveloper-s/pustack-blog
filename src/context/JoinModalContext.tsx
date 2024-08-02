// "use client";

import {
  Dispatch,
  FC,
  SetStateAction,
  createContext,
  useContext,
  useReducer,
  useRef,
  useState,
} from "react";

interface IJoinModalState {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const joinModalState = {
  open: false,
  setOpen: () => {},
};

export const JoinModalContext =
  createContext<UseJoinModalContextType>(joinModalState);

const JoinModalContextProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const context = useJoinModalContext();

  return (
    <JoinModalContext.Provider value={context}>
      {children}
    </JoinModalContext.Provider>
  );
};

type UseJoinModalContextType = {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
};

type JoinModalAction = {
  type: string;
  payload: any;
};

function JoinModalReducer(
  state: IJoinModalState,
  action: JoinModalAction
): IJoinModalState {
  switch (action.type) {
    default:
      return state;
  }
}

function useJoinModalContext(): UseJoinModalContextType {
  //   const [state] = useReducer(JoinModalReducer, initState);
  //   const guardRef = useRef(true);
  const [open, setOpen] = useState(false);

  return {
    setOpen,
    open,
  };
}

function useJoinModal(): UseJoinModalContextType {
  const context = useContext(JoinModalContext);
  if (context === undefined) {
    throw new Error(
      "useJoinModal must be used within a JoinModalContextProvider"
    );
  }

  return context;
}

export { useJoinModal, JoinModalContextProvider };
