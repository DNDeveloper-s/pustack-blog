"use client";

import { linkedinAuth } from "@/components/shared/LinkedinAuth";
import { useUser } from "@/context/UserContext";
import { auth, db, linkedinProvider } from "@/lib/firebase";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import {
  GoogleAuthProvider,
  OAuthProvider,
  User,
  reauthenticateWithPopup,
} from "firebase/auth";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { omitBy } from "lodash";

interface UseUpdateUserOptions {
  name?: string;
  email?: string;
  image_url?: string;
  phone?: string;
  phone_country_code?: string;
  company?: string;
  subscriber?: boolean;
  userId: string;
}
export const useUpdateUser = (
  options?: UseMutationOptions<any, Error, UseUpdateUserOptions>
) => {
  const updateUser = async (variables: UseUpdateUserOptions) => {
    if (!variables.userId) {
      throw new Error("User ID is required");
    }

    const userRef = doc(db, "users", variables.userId);

    await setDoc(
      userRef,
      omitBy(variables, (value) => value === undefined),
      { merge: true }
    );

    return true;
  };
  return useMutation({
    mutationFn: updateUser,
    onSettled: () => {},
    ...options,
  });
};

async function reauthenticateUser(providerId: string) {
  try {
    var user = auth.currentUser;
    var provider;

    if (!user) {
      throw new Error("User not found");
    }

    // Determine which provider to use for re-authentication
    if (providerId === "google.com") {
      provider = new GoogleAuthProvider();
      const credential = await reauthenticateWithPopup(user, provider);
    } else if (providerId === "oidc.linkedin") {
      provider = linkedinProvider;
      await linkedinAuth();
    } else {
      console.error("Unsupported provider");
      throw new Error("Unsupported provider");
    }

    return true;
  } catch (e: any) {
    console.log("e - ", e, e?.message);
    return false;
  }
}

export const useDeleteAccount = (
  options?: UseMutationOptions<any, Error, void>
) => {
  const deleteAuthUser = async (user: User) => {
    await user.delete();
    const userRef = doc(db, "users", user.uid);
    await deleteDoc(userRef);
  };

  const deleteUser = async () => {
    console.log("auth.currentUser - ", auth.currentUser);
    if (!auth.currentUser) {
      throw new Error("User not found");
    }

    try {
      await deleteAuthUser(auth.currentUser);
    } catch (e: any) {
      if (e.message && e.message.includes("auth/requires-recent-login")) {
        console.log(
          "auth.currentUser.providerData - ",
          auth.currentUser.providerData
        );
        let providerIds = auth.currentUser.providerData.map(
          (c) => c.providerId
        );
        let providerId = providerIds[0];
        const isLoggedIN = await reauthenticateUser(providerId);
        if (isLoggedIN) {
          await deleteAuthUser(auth.currentUser);
          return;
        } else {
          throw new Error("User not re-authenticated");
        }
      }
      throw e;
    }
  };

  return useMutation({
    mutationFn: deleteUser,
    onSettled: () => {},
    ...options,
  });
};
