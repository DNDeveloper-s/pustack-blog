import { Issuer, custom } from "openid-client";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { auth as firebaseAuth, firestore } from "firebase-admin";
import { setCookie } from "cookies-next";
import { customInit } from "@/lib/firebase/serverApp";

customInit(); // initialize firebase admin sdk
const JWKS_URI = "https://www.linkedin.com/oauth/openid/jwks";
const jwks = createRemoteJWKSet(new URL(JWKS_URI));

export async function GET(request: Request, response: any) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const code = params.get("code");

  if (!code) {
    return new Response(
      JSON.stringify({ error: "Authorization code not found." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const redirectUrl = `${process.env.SITE_URL}/api/linkedin`;
    const issuer = await Issuer.discover("https://www.linkedin.com/oauth");
    const client = new issuer.Client({
      client_id: process.env.LINKEDIN_CLIENT_ID ?? "",
      client_secret: process.env.LINKEDIN_CLIENT_SECRET ?? "",
      redirect_uris: [redirectUrl],
      response_types: ["code"],
      token_endpoint_auth_method: "client_secret_post",
    });

    const tokenSet = await client.callback(redirectUrl, { code });

    if (tokenSet.id_token) {
      const { payload } = await jwtVerify(tokenSet.id_token, jwks, {
        algorithms: ["RS256"],
      });

      const email = payload.email || payload.email_verified;
      const name =
        payload.name || `${payload.given_name} ${payload.family_name}`;
      const picture = payload.picture || payload.picture_url;

      const docRef = firestore().collection("users").doc();

      const uid = docRef.id;
      const additionalClaims = {
        name: name,
        picture: picture,
        email: email,
        providerId: "ocid.linkedin",
      };

      const customToken = await firebaseAuth().createCustomToken(
        uid,
        additionalClaims
      );

      const response = new Response(null, { status: 302 });
      response.headers.append(
        "Location",
        `${process.env.SITE_URL}/linkedin-redirect?access_token=${tokenSet.access_token}&id_token=${tokenSet.id_token}`
      );

      //   setCookie("token", customToken, { req: request, res: response });
      response.headers.append(
        "Set-Cookie",
        `token=${customToken}; Path=/; HttpOnly`
      );

      return response;
    } else {
      return new Response(
        JSON.stringify({ error: "ID token not present in token set." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Server error during authentication.",
        info: error,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
