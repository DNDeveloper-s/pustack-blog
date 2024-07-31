import axios from "axios";
import { auth, linkedinProvider } from "../firebase";
import {
  GoogleAuthProvider,
  NextOrObserver,
  OAuthProvider,
  User,
  signInWithPopup,
} from "firebase/auth";
import { linkedinAuth } from "@/components/shared/LinkedinAuth";

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

export async function signInWithLinkedin() {
  // linkedinProvider.addScope("openid");
  // linkedinProvider.addScope("profile");
  // linkedinProvider.addScope("email");
  // signInWithPopup(auth, linkedinProvider)
  //   .then((result) => {
  //     // User is signed in.
  //     // IdP data available using getAdditionalUserInfo(result)
  //     // Get the OAuth access token and ID Token
  //     const credential = OAuthProvider.credentialFromResult(result);
  //     if (!credential) throw new Error("No credential found");
  //     const accessToken = credential.accessToken;
  //     const idToken = credential.idToken;
  //     console.log("accessToken - ", accessToken);
  //     console.log("idToken - ", idToken);
  //   })
  //   .catch((error) => {
  //     // Handle error.
  //     console.log("Error signing in with LinkedIn - ", error);
  //   });
  /** Working */
  linkedinAuth();
  // const state = Math.random().toString(36).substring(7);
  // const origin = window.location.origin;
  // const params = new URLSearchParams({
  //   response_type: "code",
  //   client_id: "86t7tfffgkiqe8",
  //   redirect_uri: `${origin}/api/linkedin`,
  //   scope: "email openid profile",
  //   state: state,
  // });
  // const authUrl = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  // window.location.href = authUrl;
}
