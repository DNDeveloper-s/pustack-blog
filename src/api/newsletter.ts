import { API_QUERY } from "@/config/api-query";
import { useUser } from "@/context/UserContext";
import { db } from "@/lib/firebase";
import { SHA256 } from "crypto-js";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { toDashCase } from "@/firebase/signal";

interface SignUpNewsLetter {
  // id: item.key,
  // title: item.title,
  // description: item.description,
  // frequency: item.frequency,

  id: string;
  title: string;
  description: string;
  frequency: string;
}

interface NewsLetterVariables {
  email: string;
  newsLetters: SignUpNewsLetter[];
}
export const useSignupNewsLetters = (
  options?: UseMutationOptions<any, Error, NewsLetterVariables>
) => {
  const qc = useQueryClient();
  const { user } = useUser();

  const updateNewsLetters = async (variables: NewsLetterVariables) => {
    // const newPost = await post.saveToFirestore();
    // return newPost;
    if (!variables.email || !variables.newsLetters.length)
      throw new Error("Invalid data");

    const batch = writeBatch(db);
    const hashedEmail = SHA256(variables.email).toString();

    variables.newsLetters.forEach((letter) => {
      const subscriberRef = collection(
        db,
        "newsletters",
        toDashCase(letter.title),
        "subscribers"
      );
      const docRef = doc(subscriberRef, hashedEmail);
      batch.set(docRef, {
        email: variables.email,
        signed_up_at: serverTimestamp(),
      });
    });

    await batch.commit();
  };

  return useMutation({
    mutationFn: updateNewsLetters,
    onSettled: () => {
      //   qc.invalidateQueries({
      //     queryKey: API_QUERY.QUERY_POSTS,
      //   });
    },
    ...(options ?? {}),
  });
};
