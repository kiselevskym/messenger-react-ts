import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {firebaseConfig} from "./config";


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
export default auth
export const db = getFirestore()
