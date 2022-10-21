import Constants from 'expo-constants'

export const firebaseConfig = {
    apiKey: `${Constants.expoConfig.extra.firebaseApiKey}`,
    authDomain: `${Constants.expoConfig.extra.firebaseProjectId}.firebaseapp.com`,
}
