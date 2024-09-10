import { auth, db, firebaseConfig } from "@/lib/firebase";
import { onAuthStateChanged } from "@/lib/firebase/auth";
import { DocumentSnapshot } from "firebase-admin/firestore";
import { User } from "firebase/auth";
import {
  DocumentData,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export const UserContext = createContext<{
  user: UserDocumentData | null;
  setUser: React.Dispatch<React.SetStateAction<UserDocumentData | null>>;
  getUserAsync: () => Promise<UserDocumentData | undefined>;
}>({
  user: null,
  setUser: () => {},
  getUserAsync: (async () => {}) as any,
});

export interface UserDocumentData {
  email: string;
  image_url: string;
  name: string;
  sign_up_ts: string;
  uid: string;
  phone?: string;
  phone_country_code?: string;
  company?: string;
  subscriber?: boolean;
  is_author?: boolean;
  is_event_creator?: boolean;
  is_admin?: boolean;
  about?: string;
  app_rating?: number;
}

export function transformUserData(user?: any): UserDocumentData {
  return {
    ...(user?.data() ?? {}),
    uid: user?.id ?? user?.data()?.uid,
    sign_up_ts: user?.data()?.sign_up_ts?.toDate().toISOString(),
  } as UserDocumentData;
}

export function UserProvider({
  children,
}: {
  children: React.ReactNode;
  // currentUser: User | null;
}) {
  const [user, setUser] = useState<UserDocumentData | null>(null);

  const router = useRouter();

  // Register the service worker that sends auth state back to server
  // The service worker is built with npm run build-service-worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const serializedFirebaseConfig = encodeURIComponent(
        JSON.stringify(firebaseConfig)
      );
      const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`;

      // navigator.serviceWorker
      //   .register(serviceWorkerUrl)
      //   .then((registration) => console.log("scope is: ", registration.scope));
    }
  }, []);

  const getUserAsync = useCallback(async () => {
    await auth.authStateReady();
    if (auth.currentUser) {
      const user = await getDoc(doc(db, "users", auth.currentUser.uid));
      return transformUserData(user);
    }
  }, []);

  useEffect(() => {
    async function checkUser() {
      await auth.authStateReady();
      if (auth.currentUser) {
        const user = await getDoc(doc(db, "users", auth.currentUser.uid));
        setUser(transformUserData(user));
      }
    }
    checkUser();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const userRef = doc(db, "users", authUser.uid);
        const user = await getDoc(userRef);
        if (user.exists()) {
          console.log("Setting User | 74 : ");
          setUser(transformUserData(user));
        } else {
          await setDoc(userRef, {
            name: authUser.displayName,
            email: authUser.email,
            image_url: authUser.photoURL,
            uid: authUser.uid,
            sign_up_ts: serverTimestamp(),
            subscriber: true,
          });
          const user = await getDoc(userRef);
          console.log("Setting User | 85 : ");
          setUser(transformUserData(user));
        }
      } else {
        console.log("Setting User | 89 : ");
        setUser(null);

        // router.push("/");
      }
    });

    if (user) {
      let userRef = doc(db, "users", user.uid);
      const unsub = onSnapshot(userRef, (user) => {
        setUser(transformUserData(user));
      });

      return () => {
        unsub();
        unsubscribe();
      };
    }

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  useEffect(() => {
    onAuthStateChanged((authUser) => {
      if (user === undefined) return;

      // refresh when user changed to ease testing
      if (user?.email !== authUser?.email) {
        router.refresh();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, getUserAsync }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
