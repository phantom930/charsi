import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/messaging";

import { firebaseConfig } from "@/config";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export const db = firebase.firestore();
//export const messaging = firebase.messaging();
