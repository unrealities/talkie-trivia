import React from 'react'
import * as WebBrowser from 'expo-web-browser'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from "firebase/analytics"

import GoogleLogin from './src/components/googleLogin'
import MoviesContainer from './src/components/movie'
import { colors } from './src/styles/global'
import { firebaseConfig } from './src/config/firebase'

/* TODO: Firebase
https://docs.expo.dev/guides/using-firebase/
https://blog.logrocket.com/integrating-firebase-authentication-expo-mobile-app/
*/
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
WebBrowser.maybeCompleteAuthSession()

export default function App() {
  return (
    <View style={styles.container}>
      <MoviesContainer />
      <GoogleLogin />
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
    width: '100%'
  },
})
