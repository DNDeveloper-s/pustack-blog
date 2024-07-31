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
        } else {
          completed = true;
          reject();
        }
      } catch (error: any) {
        console.error("Error signing in with LinkedIn:", error);
        completed = true;
        reject();
      }
    };

    window.addEventListener("message", handleMessage);

    const linkedInAuth = () => {
      const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86t7tfffgkiqe8&redirect_uri=http://localhost:3000/api/linkedin&scope=openid%20profile%20email`;

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
            reject();
          }
        }
      }, 1000);
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
    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86t7tfffgkiqe8&redirect_uri=http://localhost:3000/api/linkedin&scope=openid%20profile%20email`;

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
