import { headers } from "next/headers";
import { firebaseConfig } from "../firebase";
import { getAuth } from "firebase/auth";
import { initializeServerApp } from "firebase/app";

export async function getAuthenticatedAppForUser() {
  const idToken = headers().get("Authorization")?.split("Bearer ")[1];
  const firebaseServerApp = initializeServerApp(
    firebaseConfig,
    idToken
      ? {
          authIdToken: idToken,
        }
      : {}
  );

  const auth = getAuth(firebaseServerApp);
  await auth.authStateReady();

  return { firebaseServerApp, currentUser: auth.currentUser };
}

import admin from "firebase-admin";
import { cert } from "firebase-admin/app";
import { getApp, getApps } from "firebase-admin/app";

const firebaseAdminConfig = {
  credential: cert({
    projectId: "minerva-0000",
    clientEmail: "firebase-adminsdk-zc3e6@minerva-0000.iam.gserviceaccount.com",
    privateKey:
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCodx+aTJr8tH/j\ncZjVLkOaOFvlAqzGYyfHSxcEq9f31xYlTgurJQnsakglS4DOYht0eGID8WywrFKo\nIFPEWijPSqEIu8K72AN6ix4nUnWR9hUFOQY+ab2hRc0Lqw8scXC+oZ51KL1q1qFa\nh137FCgNGSKvRG1ibnXDvd/h+HrgrfywdTcmWSTmIQ9AiGHIOy5+YvkSvQC/DJfD\nL+xLMfCpFXfPe96qzi2F1A9OsRm/XREaZir8k8hGUPA3wtRIvJxmrO+ogvGjr7H+\nT1lYoyqyyizRJrlO+YAiyHGjd7siYp5pYMlxKu08CHbU5uyK0bhjDE8v4g4yO2km\nI9NZLiQtAgMBAAECggEAEv261k4kerBuall3/TBF9rC7y0lN6N9ssI7KfYBRzGK2\n4GW38wct4zToBSxJzPpKVgrsIb2pnxEOEF30k4IGb7feB3oDLeHgIoRkVdJ55oZz\nQC95gLey5OdVgic6gqwXJaZakqKRF+YyMl5oPdG74h4fRtrT6fDB3dsdzf+Q+prz\nfGL008mWz9pLXBoocyHbdZ8i2FN0eEml5p09gvZhWmln++AD2AQIMJmV73RLV81w\ngSHJAcmppuxcO0AMGNft/B+idSf+3FNM5zpfaz+KeUAwOTa3ej7PfL9dkuaUvkkf\nQ1JM78f/i3vvUJ90k+kgv2wmhT+GGrcCjaF72kxygQKBgQDmAvcZz8J2pnikkf++\nHr9NH1yUO2FysngkIaEEYb8ZAO89B6tXMskCc4ZIEGMSAbnDti0cPIvfS/ZFvTO1\nXd9pcxYDk8XYWRM4yOoECXmfF4+XtGsJS5UC/ElmeprkDToBXgXgBFUsI95gd1EY\nHwOrWep1cTRPr2uMgdi1o+pvlQKBgQC7f/I40z9owi8HFOisEncT+rmXczTbZgtM\nHr8irDCURKzebSsL+Ozn07t20UkVCxcGeed8H2+ayRSP4WSXnCL0/nuqogdjtdCv\nLRrPxzqIqxNx/z9WKkK/jn0F0G2xWkHJGtMSYSjwg70MXeez3xBHyMoMJd4AIZzP\n3jpuqOscOQKBgEN+dUIGvBqTCO3JxdDlNt+Lp1/7+MFua2C22YfuouPUaV9wQ7AH\nwAJPIgU9gcTD6t3qNFyHy8ePg8m9FlJPJILN+ZS9JR4yLTjJhBoBKcYsZL9wesQ0\ngJpqq6M9sPvggbfq/jBZNSEJuXR3Lr20RCBg9zLVMDN910JYy92pJt7tAoGAVg+f\nHWgRBcODlGuLdFexYnFFuHc/vqhy7Qh70K1aSuPOuPVAuekSzEHKHPpo4gjKE8Xm\nc3l2X4SGNJhO9KvM+8jG+IYQgDrWw2Efmlkmy85CSaPP7XvOUWBUkFOf1bTI10bB\ntQD1qpe9MSz1CgGL1ncaDkNfR44mDN9C0MIl0DkCgYA+XcAO8KG/GwvMA/MHZVev\ny320Ki8NiPodTWGIok5t5T7ZPWRKFA/6bJiWOIFnX0AR2D0DOjKdKm5Qd/7KxRdM\nzv1Ve5wK8OeQKWDJ4Urh408B1APS1WJkR6GBYnOn1K2DRYajIE+vHD20e57EFoQ3\ntweERVYgS/1xUZsK0uMCkQ==\n-----END PRIVATE KEY-----\n",
  }),
};

export function customInit() {
  if (getApps().length === 0) {
    admin.initializeApp(firebaseAdminConfig);
  }
}
