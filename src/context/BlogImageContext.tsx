// interface ILinkState {}

import { useDisclosure } from "@nextui-org/modal";
import {
  FC,
  createContext,
  useCallback,
  useContext,
  useReducer,
  useRef,
  useState,
} from "react";

// const initLinkState = {
//   isGuard: false,
//   setLink: () => {},
// };

// export const LinkContext = createContext<UseLinkContextType>({
//   state: initLinkState,
//   isGuard: false,
//   setGuard: () => {},
// });

// const LinkContextProvider: FC<{ children: React.ReactElement }> = ({
//   children,
// }) => {
//   const context = useLinkContext(initLinkState);

//   return (
//     <LinkContext.Provider value={context}>{children}</LinkContext.Provider>
//   );
// };

// type UseLinkContextType = {
//   state: ILinkState;
//   isGuard: boolean;
//   setGuard: (active: boolean) => void;
// };

// type LinkAction = {
//   type: string;
//   payload: any;
// };

// function LinkReducer(state: ILinkState, action: LinkAction): ILinkState {
//   switch (action.type) {
//     default:
//       return state;
//   }
// }

// function useLinkContext(initState: ILinkState): UseLinkContextType {
//   const [state] = useReducer(LinkReducer, initState);
//   const guardRef = useRef(true);

//   return {
//     state,
//     isGuard: guardRef.current,
//     setGuard: (active: boolean) => {
//       guardRef.current = active;
//     },
//   };
// }

// function useLink(): UseLinkContextType {
//   const context = useContext(LinkContext);
//   if (context === undefined) {
//     throw new Error("useLink must be used within a LinkContextProvider");
//   }

//   return context;
// }

// export { useLink, LinkContextProvider };

interface IBlogImageState {
  previewUrl: string | null;
}

const initBlogImageState = {
  previewUrl: null,
};

type UseBlogImageContextType = {
  //   state: IBlogImageState;
  isOpen: boolean;
  imageUrl: string | null;
  openWithUrl: (url: string) => void;
  onClose: () => void;
};

export const BlogImageContext = createContext<UseBlogImageContextType>({
  isOpen: false,
  imageUrl: null,
  openWithUrl: () => {},
  onClose: () => {},
});

const BlogImageContextProvider: FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const context = useBlogImageContext(initBlogImageState);

  return (
    <BlogImageContext.Provider value={context}>
      {children}
    </BlogImageContext.Provider>
  );
};

type BlogImageAction = {
  type: string;
  payload: any;
};

function BlogImageReducer(
  state: IBlogImageState,
  action: BlogImageAction
): IBlogImageState {
  switch (action.type) {
    case "OPEN_PREVIEW":
      state.previewUrl = action.payload;
      return {
        ...state,
      };
    case "CLOSE_PREVIEW":
      state.previewUrl = null;
      return {
        ...state,
      };
    default:
      return state;
  }
}

function useBlogImageContext(
  initState: IBlogImageState
): UseBlogImageContextType {
  const [state, dispatch] = useReducer(BlogImageReducer, initState);

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const openWithUrl = useCallback((url: string) => {
    setImageUrl(url);
  }, []);

  const onClose = useCallback(() => {
    setImageUrl(null);
  }, []);

  // const openPreview = useCallback((url: string) => {
  //   dispatch({ type: "OPEN_PREVIEW", payload: url });
  // }, []);

  // const closePreview = useCallback(() => {
  //   dispatch({ type: "CLOSE_PREVIEW", payload: null });
  // }, []);

  return {
    isOpen: !!imageUrl,
    imageUrl,
    openWithUrl,
    onClose,
  };
}

function useBlogImage(): UseBlogImageContextType {
  const context = useContext(BlogImageContext);
  if (context === undefined) {
    throw new Error(
      "useBlogImage must be used within a BlogImageContextProvider"
    );
  }

  return context;
}

export { useBlogImage, BlogImageContextProvider };
