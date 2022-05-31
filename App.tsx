import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import Constants from 'expo-constants'
import fs from 'browserify-fs'

export default function App() {
  useEffect(() => {
    // let movies = require('./data/popular_movies_05_24_2022.json');
    // for (var id in movies.id) {
    //   getMoviesFromApi(id)
    // }
    
    getMoviesFromApi('5')

    function getMoviesFromApi(id:string) {
      const movieURL = new URL('https://example.com')
      movieURL.protocol = 'https'
      movieURL.hostname = 'api.themoviedb.org'
      movieURL.pathname = `/3/movie/${id}`
      movieURL.search = `api_key=${Constants.manifest.extra.themoviedb_key}`

      fetch(movieURL.href)
            .then(response => response.json())
            .then((responseJson) => {
              const data = JSON.stringify(responseJson)
              fs.writeFile('detailed_movies.json', data, (err) => {
                if (err) {
                    throw err;
                }
                console.log("JSON data is saved.");
            });
            })
            .catch(error => console.log(error))
    }
  });

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
