import React, { Dispatch, SetStateAction } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import uuid from "react-native-uuid"

import { Movie } from "../models/movie"
import { Game, PlayerGame } from "../models/game"
import { resetStyles } from "../styles/resetStyles"

export interface ResetContainerProps {
  playerGame: PlayerGame
  updatePlayerGame: Dispatch<SetStateAction<PlayerGame>>
}

const ResetContainer = (props: ResetContainerProps) => {
  let movies: Movie[] = require("../../data/popularMovies.json")

  let newMovie = movies[Math.floor(Math.random() * movies.length)]

  // init new game
  // TODO: This should be initiated separately on a global level for all users
  let game: Game = {
    date: new Date(),
    guessesMax: 5,
    id: uuid.v4().toString(),
    movie: newMovie,
  }

  let playerGame: PlayerGame = {
    correctAnswer: false,
    endDate: new Date(),
    game: game,
    guesses: [],
    id: uuid.v4().toString(),
    playerID: props.playerGame.playerID,
    startDate: new Date(),
  }

  return (
    <View style={resetStyles.container}>
      <Pressable
        onPress={() => {
          props.updatePlayerGame(playerGame)
        }}
      >
        <Text style={resetStyles.text}>Play Again?</Text>
      </Pressable>
    </View>
  )
}

export default ResetContainer
