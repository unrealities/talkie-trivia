require("dotenv").config();

const myValue = 'talkie-trivia';

export default ({ config }) => ({
  ...config,
  expo: {
    name: myValue,
    slug: "talkie-trivia",
    version: process.env.MY_CUSTOM_PROJECT_VERSION || '1.0.0',
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ["**/*"],
    plugins: [
      "@react-native-google-signin/google-signin",
      "expo-font",
      "expo-secure-store"
    ],
    ios: {
      googleServicesFile: "./GoogleService-Info.plist",
      supportsTablet: true
    },
    android: {
      googleServicesFile: "./google-services.json",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      firebaseApiKey: process.env.FIREBASE_APIKEY,
      firebaseAppId: process.env.FIREBASE_APPID,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENTID,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDERID,
      firebaseProjectId: process.env.FIREBASE_PROJECTID,
      themoviedb_key: process.env.THEMOVIEDB_APIKEY,
      expoClientId: process.env.CLIENTID_EXPO,
      iosClientId: process.env.CLIENTID_IOS,
      webClientId: process.env.CLIENTID_WEB
    }
  }
});
