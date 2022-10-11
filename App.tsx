import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'
import MoviesContainer from './src/components/movie'
import { colors } from './src/styles/global'

/* TODO: Auth
https://medium.com/@csaba.ujvari/expo-google-login-f83e2b7885b0
*/

export default function App() {
  return (
    <View style={styles.container}>
      <MoviesContainer />
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
