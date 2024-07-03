// // Service Worker script

// let firebaseConfig;
// let firebaseInitialized = false;

// // Function to load Firebase App and Auth SDKs
// function loadFirebaseScripts() {
//   return new Promise((resolve, reject) => {
//     try {
//       importScripts(
//         "https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js",
//         "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth-compat.js",
//         "https://www.gstatic.com/firebasejs/10.12.1/firebase-installations-compat.js"
//       );
//       console.log("Firebase scripts loaded");
//       resolve();
//     } catch (error) {
//       reject(error);
//     }
//   });
// }

// self.addEventListener("install", (event) => {
//   const serializedFirebaseConfig = new URL(location).searchParams.get(
//     "firebaseConfig"
//   );
//   if (!serializedFirebaseConfig) {
//     throw new Error(
//       "Firebase Config object not found in service worker query string."
//     );
//   }
//   firebaseConfig = JSON.parse(serializedFirebaseConfig);
//   console.log("Service worker installed with Firebase config", firebaseConfig);
//   event.waitUntil(loadFirebaseScripts());
//   self.skipWaiting();
// });

// self.addEventListener("activate", (event) => {
//   event.waitUntil(
//     (async () => {
//       if (!firebaseInitialized) {
//         await loadFirebaseScripts();
//         firebase.initializeApp(firebaseConfig);
//         firebaseInitialized = true;
//         console.log("Firebase initialized");
//       }
//       await self.clients.claim();
//       console.log("Service worker activated");
//     })()
//   );
// });

// self.addEventListener("fetch", (event) => {
//   const { origin } = new URL(event.request.url);
//   if (origin !== self.location.origin) return;

//   event.respondWith(
//     (async () => {
//       try {
//         return await fetchWithFirebaseHeaders(event.request);
//       } catch (error) {
//         console.error("Error in fetch handler:", error);
//         return fetch(event.request);
//       }
//     })()
//   );
// });

// async function fetchWithFirebaseHeaders(request) {
//   if (!firebaseInitialized || !firebase) {
//     throw new Error("Firebase is not initialized");
//   }
//   const auth = firebase.auth();
//   const installations = firebase.installations();
//   const headers = new Headers(request.headers);

//   const [authIdToken, installationToken] = await Promise.all([
//     getAuthIdToken(auth),
//     installations.getToken(),
//   ]);

//   if (installationToken) {
//     headers.append("Firebase-Instance-ID-Token", installationToken);
//   }

//   if (authIdToken) {
//     headers.append("Authorization", `Bearer ${authIdToken}`);
//   }

//   const newRequest = new Request(request, { headers });
//   return await fetch(newRequest);
// }

// async function getAuthIdToken(auth) {
//   return new Promise((resolve) => {
//     const unsubscribe = auth.onAuthStateChanged(async (user) => {
//       unsubscribe();
//       if (user) {
//         const idToken = await user.getIdToken();
//         resolve(idToken);
//       } else {
//         resolve(null);
//       }
//     });
//   });
// }
