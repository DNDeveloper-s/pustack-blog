import { useUser } from "@/context/UserContext";
import { db } from "@/lib/firebase";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { omitBy } from "lodash";

interface UseUpdateUserOptions {
  name?: string;
  email?: string;
  image_url?: string;
  phone?: string;
  phone_country_code?: string;
  company?: string;
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
      omitBy(variables, (value) => !value),
      { merge: true }
    );

    return true;
  };
  return useMutation({
    mutationFn: updateUser,
    ...options,
  });
};
