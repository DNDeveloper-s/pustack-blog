"use client";

import { linkedinAuth } from "@/components/shared/LinkedinAuth";
import { API_QUERY } from "@/config/api-query";
import { useUser } from "@/context/UserContext";
import { auth, db, linkedinProvider } from "@/lib/firebase";
import {
  QueryFunctionContext,
  UseMutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  GoogleAuthProvider,
  OAuthProvider,
  User,
  reauthenticateWithPopup,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { omitBy } from "lodash";

interface UseUpdateUserOptions {
  name?: string;
  email?: string;
  image_url?: string;
  phone?: string;
  phone_country_code?: string;
  company?: string;
  subscriber?: boolean;
  about?: string;
  userId: string;
  app_rating?: number;
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
    await unsubscribeFromEveryWhere(user.uid, user.email);
    await user.delete();
    const userRef = doc(db, "users", user.uid);
    await deleteDoc(userRef);
  };

  const unsubscribeFromEveryWhere = async (
    userId: string,
    userEmail: string | null
  ) => {
    window.sessionStorage.removeItem("sessionEmail");

    // Unsubscribe from all the events
    const rsvpRef = collection(db, "events", "collections", "rsvp");
    const _query = query(rsvpRef, where("uid", "==", userId));

    const docs = await getDocs(_query);

    const batch = writeBatch(db);

    docs.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Unsubscribe from all the topics
    if (userEmail) {
      const newsLettersRef = collection(db, "newsletters");

      const _docs = await getDocs(newsLettersRef);

      for (let i = 0; i < _docs.docs.length; i++) {
        const doc = _docs.docs[i];

        const subscriberCollectionRef = collection(doc.ref, "subscribers");
        const _query = query(
          subscriberCollectionRef,
          where("email", "==", userEmail)
        );

        const docs = await getDocs(_query);

        docs.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
      }
    }

    await batch.commit();
  };

  const deleteUser = async () => {
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

interface AppRatingDocument {
  app_rating: number;
  app_rating_history: {
    rate_ts: Timestamp;
    rating: number;
  }[];
  has_rated_app: boolean;
}

export const useGetAppRating = (userId?: string) => {
  const getAppRating = async ({ queryKey }: QueryFunctionContext) => {
    const [, userId] = queryKey;
    if (!userId) {
      throw new Error("User ID is required");
    }

    const ratingRef = doc(db, "app_rating", userId as string);
    const ratingSnap = await getDoc(ratingRef);
    const ratingData = ratingSnap.data();
    return ratingData as AppRatingDocument;
  };

  return useQuery({
    queryKey: API_QUERY.APP_RATING(userId),
    queryFn: getAppRating,
    enabled: !!userId,
  });
};

export const useUpdateAppRating = (
  options?: UseMutationOptions<any, Error, { userId: string; rating: number }>
) => {
  const qc = useQueryClient();
  const updateAppRating = async ({
    userId,
    rating,
  }: {
    userId: string;
    rating: number;
  }) => {
    if (!userId) {
      throw new Error("User ID is required");
    }

    console.log("userId - ", userId);
    console.log("rating - ", rating);

    const ratingRef = doc(db, "app_rating", userId);
    const ratingSnap = await getDoc(ratingRef);
    const ratingData = ratingSnap.data() as AppRatingDocument;

    const newRating = {
      app_rating: rating,
      app_rating_history: [
        ...(ratingData?.app_rating_history ?? []),
        {
          rate_ts: Timestamp.now(),
          rating,
        },
      ],
    };

    await setDoc(ratingRef, newRating, { merge: true });
  };

  return useMutation({
    mutationFn: updateAppRating,
    onSettled: (data, error, variables) => {
      qc.invalidateQueries({
        queryKey: API_QUERY.APP_RATING(variables?.userId),
      });
    },
    ...options,
  });
};
