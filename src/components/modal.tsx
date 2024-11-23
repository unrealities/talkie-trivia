import React, { Dispatch, SetStateAction } from "react"
import { Modal, Pressable, Text, View } from "react-native"

import { modalStyles } from "../styles/modalStyles"
import Facts from "./facts"
import { Movie } from "../models/movie"

interface MovieModalProps {
  movie: Movie
  show: boolean
  toggleModal: Dispatch<SetStateAction<boolean>>
}

const MovieModal = ({ movie, show, toggleModal }: MovieModalProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      onRequestClose={() => toggleModal(false)}
    >
      <Pressable
        style={modalStyles.centeredView}
        onPress={() => toggleModal(false)}
        accessibilityLabel="Close modal by tapping outside"
      >
        <View style={modalStyles.modalView}>
          {movie ? <Facts movie={movie} /> : <Text>Loading...</Text>}
          <Pressable
            style={modalStyles.button}
            onPress={() => toggleModal(false)}
            accessibilityLabel="Close modal"
          >
            <Text style={modalStyles.buttonText}>Close</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  )
}

export default MovieModal
