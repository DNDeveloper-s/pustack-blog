"use client";

import { useUser } from "@/context/UserContext";
import { auth, db, linkedinProvider } from "@/lib/firebase";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import {
  GoogleAuthProvider,
  OAuthProvider,
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

    // Determine which provider to use for re-authentication
    if (providerId === "google.com") {
      provider = new GoogleAuthProvider();
    } else if (providerId === "oidc.linkedin") {
      provider = linkedinProvider;
    } else {
      console.error("Unsupported provider");
      throw new Error("Unsupported provider");
    }

    if (!user) {
      throw new Error("User not found");
    }

    const credential = await reauthenticateWithPopup(user, provider);

    return true;
  } catch (e: any) {
    console.log("e - ", e, e?.message);
    return false;
  }
}

export const useDeleteAccount = (
  options?: UseMutationOptions<any, Error, void>
) => {
  const deleteUser = async () => {
    console.log("auth.currentUser - ", auth.currentUser);
    if (!auth.currentUser) {
      throw new Error("User not found");
    }

    let providerIds = auth.currentUser.providerData.map((c) => c.providerId);

    let providerId = providerIds[0];
    if (providerIds.includes("google.com")) {
      providerId = "google.com";
    }
    const isLoggedIN = await reauthenticateUser(providerId);

    if (isLoggedIN) {
      const uid = auth.currentUser.uid;
      const userRef = doc(db, "users", uid);
      await auth.currentUser.delete();
      await deleteDoc(userRef);
    } else {
      throw new Error("User not re-authenticated");
    }
  };

  return useMutation({
    mutationFn: deleteUser,
    onSettled: () => {},
    ...options,
  });
};
