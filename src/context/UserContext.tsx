import { auth, db, firebaseConfig } from "@/lib/firebase";
import { onAuthStateChanged } from "@/lib/firebase/auth";
import { User } from "firebase/auth";
import {
  DocumentData,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext<{
  user: UserDocumentData | null;
  setUser: React.Dispatch<React.SetStateAction<UserDocumentData | null>>;
}>({
  user: null,
  setUser: () => {},
});

export interface UserDocumentData {
  email: string;
  image_url: string;
  name: string;
  sign_up_ts: string;
  uid: string;
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

  useEffect(() => {
    async function checkUser() {
      await auth.authStateReady();
      if (auth.currentUser) {
        const user = await getDoc(doc(db, "users", auth.currentUser.uid));
        setUser(user.data() as UserDocumentData);
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
          setUser(user.data() as UserDocumentData);
        } else {
          await setDoc(userRef, {
            name: authUser.displayName,
            email: authUser.email,
            image_url: authUser.photoURL,
            uid: authUser.uid,
            sign_up_ts: serverTimestamp(),
          });
          const user = await getDoc(userRef);
          console.log("Setting User | 85 : ");
          setUser(user.data() as UserDocumentData);
        }
      } else {
        console.log("Setting User | 89 : ");
        setUser(null);

        // router.push("/");
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
