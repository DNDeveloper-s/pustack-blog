import axios from "axios";
import { auth, db, getDoc, linkedinProvider } from "../firebase";
import {
  GoogleAuthProvider,
  NextOrObserver,
  OAuthProvider,
  User,
  signInWithPopup,
} from "firebase/auth";
import { linkedinAuth } from "@/components/shared/LinkedinAuth";
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";

export function onAuthStateChanged(callback: NextOrObserver<User | null>) {
  return auth.onAuthStateChanged(callback);
}

export async function signInWithGoogleAsync() {
  const provider = new GoogleAuthProvider();

  return signInWithPopup(auth, provider);
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

export async function attachUIDToAllThePosts() {
  const postsRef = collection(db, "posts");
  const _postsQuery = query(postsRef, limit(100));
  const posts = await getDocs(_postsQuery);

  const batch = writeBatch(db);

  for (let i = 0; i < posts.docs.length; i++) {
    const post = posts.docs[i];
    const authorOfThePost = post.data().author;
    const usersColRef = collection(db, "users");
    const _query = query(
      usersColRef,
      where("email", "==", authorOfThePost.email),
      limit(1)
    );
    const users = getDocs(_query);
    const user = (await users).docs[0];

    if (!user) {
      // batch.delete(doc(db, "posts", post.id));
    } else {
      batch.set(
        doc(db, "posts", post.id),
        {
          author: {
            email: authorOfThePost.email,
            uid: user.id,
            name: authorOfThePost.name,
            photoURL: authorOfThePost.photoURL,
          },
        },
        { merge: true }
      );
    }

    // await setDoc(
    //   doc(db, "posts", post.id),
    //   {
    //     author: {
    //       email: authorOfThePost.email,
    //       uid: user.id,
    //       name: authorOfThePost.name,
    //       photoURL: authorOfThePost.photoURL,
    //     },
    //   },
    //   { merge: true }
    // );

    // await db.collection("posts").doc(post.id).update({
    //   uid: "123",
    // });
  }

  await batch.commit();
}
