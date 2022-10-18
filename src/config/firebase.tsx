import {FIREBASE_APIKEY, FIREBASE_PROJECTID} from "@env"

export const firebaseConfig = {
    apiKey: `${FIREBASE_APIKEY}`,
    authDomain: `${FIREBASE_PROJECTID}.firebaseapp.com`,
}
