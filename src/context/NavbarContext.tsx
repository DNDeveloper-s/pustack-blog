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

interface INavbarState {}

const initNavbarState = {};

export const NavbarContext = createContext<UseNavbarContextType>({
  isBottomNavOpen: false,
  setIsBottomNavOpen: null as any,
});

const NavbarContextProvider: FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const context = useNavbarContext(initNavbarState);

  return (
    <NavbarContext.Provider value={context}>{children}</NavbarContext.Provider>
  );
};

type UseNavbarContextType = {
  isBottomNavOpen: boolean;
  setIsBottomNavOpen: Dispatch<SetStateAction<boolean>>;
};

type NavbarAction = {
  type: string;
  payload: any;
};

function NavbarReducer(
  state: INavbarState,
  action: NavbarAction
): INavbarState {
  switch (action.type) {
    default:
      return state;
  }
}

function useNavbarContext(initState: INavbarState): UseNavbarContextType {
  const [state] = useReducer(NavbarReducer, initState);
  const [isBottomNavOpen, setIsBottomNavOpen] = useState(false);

  return { setIsBottomNavOpen, isBottomNavOpen };
}

function useNavbar(): UseNavbarContextType {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error("useNavbar must be used within a NavbarContextProvider");
  }

  return context;
}

export { useNavbar, NavbarContextProvider };
