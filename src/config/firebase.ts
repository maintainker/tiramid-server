import firebase from "firebase/app";
// import 'firebase/auth';
import "firebase/firestore";
// import 'firebase/storage';
import config from "./config";

const { firebaseConfig } = config;
firebase.initializeApp(firebaseConfig);

const firedb = firebase.firestore();

export const firebaseInstance = firebase;
// export const authService = firebase.auth();
export const dbService = firedb;
// export const storageService = firebase.storage();
