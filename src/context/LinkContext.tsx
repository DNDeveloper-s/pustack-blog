// "use client";

import { FC, createContext, useContext, useReducer, useRef } from "react";

// import React, {
//   createContext,
//   FC,
//   useContext,
//   useEffect,
//   useMemo,
//   useReducer,
//   useRef,
//   useState,
// } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import {
//   IBusinessResponse,
//   SocialPageObject,
//   SocialPageType,
//   useGetConversation,
//   useQueryUserBusiness,
// } from "@/api/conversation";
// import { IConversation } from "@/interfaces/IConversation";
// import useCampaignStore from "@/store/campaign";
// import { set } from "lodash";
// import useSessionToken from "@/hooks/useSessionToken";

// type IBusinessState = IBusinessResponse | undefined | null;

// export const initBusinessState: IBusinessState = undefined;

// enum BUSINESS_ACTION_TYPE {
//   SET = "SET",
// }

// interface BusinessAction {
//   type: BUSINESS_ACTION_TYPE;
//   payload: Partial<IBusinessState>;
// }

// function BusinessReducer(
//   state: IBusinessState,
//   action: BusinessAction
// ): IBusinessState {
//   const { type, payload } = action;
//   switch (type) {
//     case BUSINESS_ACTION_TYPE.SET:
//       return state;
//     default:
//       return state;
//   }
// }

// class Business {
//   id?: string;
//   name?: string;
//   social_pages?: SocialPageObject[];

//   constructor(data?: IBusinessResponse) {
//     this.id = data?.id;
//     this.name = data?.name;
//     this.social_pages = data?.social_pages;
//   }

//   getFacebookPage() {
//     return this.social_pages?.find(
//       (page) => page.type === SocialPageType.FACEBOOK_PAGE
//     );
//   }

//   getAdAccount() {
//     return this.social_pages?.find(
//       (page) => page.type === SocialPageType.FACEBOOK_AD_ACCOUNT
//     );
//   }

//   static fromData(data?: IBusinessResponse) {
//     return new Business(data);
//   }

//   static fromLocalStorage() {
//     const data = localStorage.getItem("business");
//     if (data) {
//       return Business.fromData(JSON.parse(data));
//     }
//     return null;
//   }

//   static setLocalStorage(data?: IBusinessResponse) {
//     localStorage.setItem("business", JSON.stringify(data));
//   }

//   static clearLocalStorage() {
//     localStorage.removeItem("business");
//   }

//   static getLocalStorage() {
//     const data = localStorage.getItem("business");
//     if (data) {
//       return JSON.parse(data);
//     }
//     return null;
//   }

//   static setLocalStorageId(id: string) {
//     localStorage.setItem("business_id", id);
//   }

//   static getLocalStorageId() {
//     return localStorage.getItem("business_id");
//   }

//   static clearLocalStorageId() {
//     localStorage.removeItem("business_id");
//   }
// }

// const useBusinessContext = (initState: IBusinessState) => {
// };

// type UseBusinessContextType = ReturnType<typeof useBusinessContext>;

// export const BusinessContext = createContext<UseBusinessContextType>({
//   business: null,
//   setBusiness: () => {},
//   state: initBusinessState,
//   dispatch: () => {},
//   businessMap: new Business(),
// });

// const BusinessContextProvider: FC<{ children: React.ReactElement }> = ({
//   children,
// }) => {
//   const context = useBusinessContext(null);

//   return (
//     <BusinessContext.Provider value={context}>
//       {children}
//     </BusinessContext.Provider>
//   );
// };

// type UseBusinessHookType = {
//   state: IBusinessState;
//   dispatch: (action: BusinessAction) => void;
//   business: IBusinessState;
//   businessMap: Business;
//   setBusiness: (business: IBusinessState) => void;
// };

// function useBusiness(): UseBusinessHookType {
//   const context = useContext(BusinessContext);
//   if (context === undefined) {
//     throw new Error(
//       "useBusiness must be used within a BusinessContextProvider"
//     );
//   }

//   return context;
// }

// export { useBusiness, BusinessContextProvider };


// Create a Link Context with reducer

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