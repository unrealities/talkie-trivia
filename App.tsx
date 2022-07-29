import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import MoviesContainer from './src/components/movie'
import TitleHeader from './src/components/titleHeader'
import Constants from 'expo-constants';

export default function App() {
  useEffect(() => {
    getMoviesFromApi(5)
  
    function getMoviesFromApi(id:number) {
      const movieURL = new URL('https://example.com')
      movieURL.protocol = 'https'
      movieURL.hostname = 'api.themoviedb.org'
      movieURL.pathname = `/3/movie/${id}`
      movieURL.search = `api_key=${Constants.manifest.extra.themoviedb_key}`

      fetch(movieURL.href)
            .then(response => response.json())
            .then((responseJson) => {
                console.log('getting data from fetch', responseJson)
            })
            .catch(error => console.log(error))
    }
  });

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
