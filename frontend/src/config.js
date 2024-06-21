const NODE_ENV = process.env.NODE_ENV;
const local_backend_uri = process.env.NEXT_PUBLIC_BE_URI;
const local_react_uri = process.env.NEXT_PUBLIC_URI;

const prod_backend_uri = process.env.NEXT_PUBLIC_PROD_BE_URI;
const prod_react_uri = process.env.NEXT_PUBLIC_PROD_URI;

export const node_env = NODE_ENV;
export const website_name = process.env.NEXT_PUBLIC_WEBSITE_NAME;
export const discord_clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
export const discord_clientSecret =
  process.env.NEXT_PUBLIC_DISCORD_CLIENT_SECRET;

export const API_URL =
  NODE_ENV === "development" ? local_backend_uri : prod_backend_uri;
export const REACT_URL =
  NODE_ENV === "development" ? local_react_uri : prod_react_uri;

export const productionHost = ["charsi.co"];

export const inProduction = NODE_ENV === "production";

export const listingsPerPage = Number(
  process.env.NEXT_PUBLIC_LISTINGS_PER_PAGE
);

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const firebaseFCMVapidKey =
  process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY;
export const stripePubKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

export const devlog = (...params) => {
  if (inProduction) {
    // do nothing
    // save to logs
  } else {
    console.log(...params);
  }
};

export const errorLog = (msg) => {};
