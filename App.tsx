import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import Constants from 'expo-constants'
import PopularMovies from './data/popular_movies_05_24_2022.json'


export default function App() {
  useEffect(() => {
    const fetchData = async () => {
      const movieURL = new URL('https://example.com')
      movieURL.protocol = 'https'
      movieURL.hostname = 'api.themoviedb.org'
      movieURL.search = `api_key=${Constants.manifest.extra.themoviedb_key}`
      let data = '['
      
      // for (const movie of PopularMovies) {
      //   movieURL.pathname = `/3/movie/${movie.id}`
      //   let response = await fetch(movieURL.href)
      //   data += JSON.stringify(response.json()) + ","
      // }
      data += ']'
      return data
    }

    let result = fetchData()
    console.log(result)
  })

  return (
    <View style={styles.container}>
      <Text>Check the console</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
