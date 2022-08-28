import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'
import MoviesContainer from './src/components/movie'
import TitleHeader from './src/components/titleHeader'
import { colors } from './src/styles/global'

export default function App() {
  return (
    <View style={styles.container}>
      <TitleHeader />
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
