import NextAuth from "next-auth";
import LinkedInProvider from "next-auth/providers/linkedin";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { db, doc, getDoc, serverTimestamp, setDoc } from "@/lib/firebase";
// import {
//   firestore,
//   doc,
//   getDoc,
//   setDoc,
//   serverTimestamp,
// } from "../../../firebase";

const createUserDocument = async (user: any) => {
  const userRef = doc(db, "users", user.id);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      name: user.displayName,
      email: user.email,
      image_url: user.photoURL,
      uid: user.uid,
      sign_up_ts: serverTimestamp(),
      subscriber: true,
    });
  }
};

const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID ?? "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          redirect_uri: "https://minerva-0000.firebaseapp.com/__/auth/handler",
        },
      },
    }),
  ],
  // @ts-ignore
  adapter: FirestoreAdapter(db),
  secret: process.env.NEXTAUTH_SECRET ?? "this_is_generated_secret",
  callbacks: {
    async signIn({ user, account, profile }: any) {
      // Ensure the user document is created only on the first sign in
      await createUserDocument(user);
      return true;
    },
    async session({ session, token }: any) {
      session.user.id = token.id;
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};

const handler = (req: any, res: any) => NextAuth(req, res, options);

export { handler as GET, handler as POST };
