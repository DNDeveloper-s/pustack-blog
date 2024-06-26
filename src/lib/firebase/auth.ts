import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  NextOrObserver,
  User,
  signInWithPopup,
} from "firebase/auth";

export function onAuthStateChanged(callback: NextOrObserver<User | null>) {
  return auth.onAuthStateChanged(callback);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error signing in with Google - ", error);
  }
}

export async function signOut() {
  try {
    await auth.signOut();
    // @ts-ignore
    if (typeof window !== undefined) window.location = "/";
  } catch (error) {
    console.error("Error signing out - ", error);
  }
}
