import React, { useRef, useState } from 'react'
import { Button, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as Linking from 'expo-linking'
import { Picker } from '@react-native-picker/picker'
import ConfettiCannon from 'react-native-confetti-cannon'

import CluesContainer from './clues'
import Explosion from 'react-native-confetti-cannon'

export interface Movie {
  actors: Actor[]
  director: Director
  id: number
  imdb_id: number
  overview: string
  poster_path: string
  popularity: number
  release_date: string
  tagline: string
  title: string
  vote_average: number
  vote_count: number
}

export interface Actor {
  id: number
  order: number
  name: string
  popularity: number
  profile_path: string
}

export interface Director {
  id: number
  name: string
  popularity: number
  profile_path: string
}

const MoviesContainer = () => {
  let movies: Movie[] = require('../../data/popularMovies.json')
  let randomMovieIndex = Math.floor(Math.random() * movies.length)
  let randomMovie = movies[randomMovieIndex] as Movie

  const [guesses, setGuesses] = useState<number[]>([])
  const [movie] = useState(randomMovie)

  const ref = useRef<ConfettiCannon>(null);
  guesses.forEach(guess => {
    if (guess == movie.id) {
      ref.current?.start()
    }
  })

  return (
    <View style={styles.container}>
      <CluesContainer summary={movie.overview} guesses={guesses} />
      <MoviesPicker movieID={movie.id} guesses={guesses} updateGuesses={setGuesses}/>
      <GuessesDisplay guesses={guesses} movie={movie} movies={movies} />
      <MovieModal show={false} />
      <ConfettiCannon autoStart={false} count={100} fallSpeed={2000} origin={{x: -10, y: 0}} ref={ref} />
    </View>
  )
}

interface GuessesDisplayProps {
  guesses: number[]
  movie: Movie
  movies: Movie[]
}

interface MoviePickerProps {
  guesses: number[]
  movieID: number
  updateGuesses: Dispatch<SetStateAction<number[]>>
}

interface MovieFactsProps {
  movie: Movie
}

interface MovieModalProps {
  show: SetStateAction
}

const GuessesDisplay = (props: GuessesDisplayProps) => {
  let getMovieTitle = (id:number) => {
    let movie = props.movies.find(m => m.id == id) as Movie
    return movie.title
  }
  let GuessesText:Element[] = []
  props.guesses.forEach((guess, i) => {
    GuessesText.push(<Text key={i}>Guess {i+1}: {getMovieTitle(guess)}</Text>)
  })

  return (
    <View>
      <>
      { GuessesText }
      {props.guesses.forEach(guess => {
        if (guess == props.movie.id) {
          console.log("correct. movie was: " + props.movie.title)
        }
        if (props.guesses.length >= 5) {
          console.log("fail. movie was: " + props.movie.title)
        }
        if (props.guesses.length >= 5 || guess == props.movie.id) {
          <MovieFacts movie={props.movie} />
        }
      })}
      </>
    </View>
  )
}

const MoviesPicker = (props: MoviePickerProps) => {
  let movies: Movie[] = require('../../data/popularMovies.json')
  const [selectedMovieID, setSelectedMovieID] = useState<number>(0)
  let sortedMovies = movies.sort(function (a, b) {
    return a.title < b.title ? -1 : a.title > b.title ? 1 : 0
  })

  return (
    <View>
      <Picker
        selectedValue={selectedMovieID}
        onValueChange={(itemValue, itemIndex) => {
          setSelectedMovieID(itemValue)
        }}>
        <Picker.Item key="0" label="" value={0} />
        {sortedMovies.map((movie) => (  
          <Picker.Item key={movie.id} label={movie.title} value={movie.id} />
        ))}
      </Picker>
      <Button
        onPress={() => props.updateGuesses([...props.guesses, selectedMovieID])}
        title="Submit"
        color="red"
        accessibilityLabel="Submit your guess"
      />
    </View>
  )
}

const MovieFacts = (props: MovieFactsProps) => {
  let imdbURI = 'https://www.imdb.com/title/'
  let imageURI = 'https://image.tmdb.org/t/p/original'
  let movie = props.movie

  let displayActors = ""
  movie.actors.forEach((actor) => {
    displayActors = displayActors + " | " + actor.name
  })

  return (
    <View>
      <Text>{movie.title} ({movie.id})</Text>
      <Text>Release Date: {movie.release_date}</Text>
      <Text>Popularity: {movie.popularity}</Text>
      <Text>Vote Average: {movie.vote_average}</Text>
      <Text>Vote Count: {movie.vote_count}</Text>
      <Text>Tagline: {movie.tagline}</Text>
      <Text>Director: {movie.director.name}</Text>
      <Text>Actors: {displayActors}</Text>
      <TouchableOpacity onPress={() => { Linking.openURL(`${imdbURI}${movie.imdb_id}`) }}>
        <Text>IMDB Link: https://www.imdb.com/title/{movie.imdb_id}/</Text>
      </TouchableOpacity>
      <Image
        source={{ uri: `${imageURI}${movie.poster_path}` }}
        style={{ width: '200px', height: '300px' }}
      />
    </View>
  )
}

const MovieModal = (props: MovieModalProps) => {
  const [modalVisible, setModalVisible] = useState(props.show);
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Hello World!</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable style={[styles.button, styles.buttonOpen]} onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}>Show Modal</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    justifyContent: 'center'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default MoviesContainer
