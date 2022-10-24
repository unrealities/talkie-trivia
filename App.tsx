import React from 'react'
import * as WebBrowser from 'expo-web-browser'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'
import { initializeApp } from 'firebase/app'

import GoogleLogin from './src/components/googleLogin'
import MoviesContainer from './src/components/movie'
import { colors } from './src/styles/global'
import { firebaseConfig } from './src/config/firebase'

/* TODO: Auth
https://medium.com/@csaba.ujvari/expo-google-login-f83e2b7885b0
https://docs.expo.dev/guides/authentication/#web-apps
*/
initializeApp(firebaseConfig)
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
