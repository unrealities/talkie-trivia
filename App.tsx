import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import MoviesContainer from './src/components/movie'
import TitleHeader from './src/components/titleHeader'
import Constants from 'expo-constants';

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
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
})
