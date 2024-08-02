"use client";

import { auth, linkedinProvider } from "@/lib/firebase";
import { signInWithCredential } from "firebase/auth";
import { ReactNode, useEffect, useRef } from "react";

export function linkedinAuth() {
  let completed = false;
  return new Promise((resolve, reject) => {
    const handleMessage = async (event: any) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      console.log("event.data - ", event.data);

      try {
        const accessToken = event.data.accessToken;
        const idToken = event.data.idToken;

        if (accessToken && idToken) {
          const credential = linkedinProvider.credential({
            accessToken,
            idToken,
          });

          await signInWithCredential(auth, credential);
          completed = true;
          resolve(true);
        }
      } catch (error: any) {
        completed = true;
        reject(new Error("Couldn't sign in with LinkedIn"));
      }
    };

    window.addEventListener("message", handleMessage);

    const linkedInAuth = () => {
      const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86t7tfffgkiqe8&redirect_uri=https://pustack-blog.vercel.app/api/linkedin&scope=openid%20profile%20email`;

      const width = 600;
      const height = 600;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;

      const newAuthWindow = window.open(
        linkedInAuthUrl,
        "LinkedIn Auth",
        `width=${width},height=${height},top=${top},left=${left}`
      );

      const checkWindowClosed = setInterval(() => {
        if (newAuthWindow && newAuthWindow.closed) {
          clearInterval(checkWindowClosed);
          if (!completed) {
            completed = true;
            reject(new Error("Couldn't sign in with LinkedIn"));
          }
        }
      }, 5000);
    };

    linkedInAuth();
  });
}

interface LinkedinAuthProps {
  onSuccess?: () => void;
  onError?: () => void;
  children: (signIn: () => any) => ReactNode;
}
export default function LinkedinAuth(props: LinkedinAuthProps) {
  const completed = useRef(false);

  useEffect(() => {
    const handleMessage = async (event: any) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      try {
        const accessToken = event.data.accessToken;
        const idToken = event.data.idToken;

        if (accessToken && idToken) {
          const credential = linkedinProvider.credential({
            accessToken,
            idToken,
          });

          await signInWithCredential(auth, credential);
          completed.current = true;
          props.onSuccess?.();
        } else {
          completed.current = true;
          props.onError?.();
        }
      } catch (error: any) {
        completed.current = true;
        console.error("Error signing in with LinkedIn:", error);
        props.onError?.();
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const linkedInAuth = () => {
    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86t7tfffgkiqe8&redirect_uri=https://pustack-blog.vercel.app/api/linkedin&scope=openid%20profile%20email`;

    const width = 600;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const newAuthWindow = window.open(
      linkedInAuthUrl,
      "LinkedIn Auth",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    const checkWindowClosed = setInterval(() => {
      if (newAuthWindow && newAuthWindow.closed) {
        clearInterval(checkWindowClosed);
        if (!completed.current) {
          completed.current = true;
          props.onError?.();
        }
      }
    }, 500);
  };

  return props.children(linkedInAuth);
}
