import { FIREBASE_APIKEY, FIREBASE_APPID, FIREBASE_MEASUREMENTID, FIREBASE_MESSAGING_SENDERID, FIREBASE_PROJECTID } from '@env'

export const firebaseConfig = {
    apiKey: FIREBASE_APIKEY,
    authDomain: `${FIREBASE_PROJECTID}.firebaseapp.com`,
    projectId: FIREBASE_PROJECTID,
    storageBucket: `${FIREBASE_PROJECTID}.appspot.com`,
    messagingSenderId: FIREBASE_MESSAGING_SENDERID,
    appId: FIREBASE_APPID,
    measurementId: FIREBASE_MEASUREMENTID
}
