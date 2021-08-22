import dotenv from "dotenv";

dotenv.config();

const SERVER_PORT = Number(process.env.SERVER_PORT) || 3001;
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";

const apiKey = process.env.REACT_APP_API_KEY || "";
const authDomain = process.env.REACT_APP_AUTH_DOMAIN || "";
const databaseURL = process.env.REACT_APP_DATABASE_URL || "";
const projectId = process.env.REACT_APP_PROJECT_ID || "";
const storageBucket = process.env.REACT_APP_STORAGE_BUCKET || "";
const messagingSenderId = process.env.REACT_APP_MESSAGEIN_ID || "";
const appId = process.env.REACT_APP_APP_ID || "";
const measurementId = process.env.REACT_APP_MEASUREMENT_ID || "";

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT,
};

const FIREBASE_CONFIG = {
  apiKey,
  authDomain,
  databaseURL,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
};

const config = {
  server: SERVER,
  firebaseConfig: FIREBASE_CONFIG,
};

export default config;
