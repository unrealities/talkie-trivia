const myValue = 'talkie-trivia'

export default {
  name: myValue,
  version: process.env.MY_CUSTOM_PROJECT_VERSION || '1.0.0',
  extra: {
    firebaseApiKey: process.env.FIREBASE_APIKEY,
    firebaseAppId: process.env.FIREBASE_APPID,
    firebaseAppId: process.env.FIREBASE_MEASUREMENTID,
    firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDERID,
    firebaseProjectId: process.env.FIREBASE_PROJECTID,
    themoviedb_key: process.env.THEMOVIEDB_APIKEY,
    expoClientId: process.env.CLIENTID_EXPO,
    webClientId: process.env.CLIENTID_WEB
  }
}
