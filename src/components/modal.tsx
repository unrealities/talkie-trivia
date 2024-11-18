import React, { Dispatch, SetStateAction } from "react"
import { Modal, Pressable, StyleSheet, Text, View } from "react-native"

import { colors } from "../styles/global"
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
        style={styles.centeredView}
        onPress={() => toggleModal(false)}
        accessibilityLabel="Close modal by tapping outside"
      >
        <View style={styles.modalView}>
          {movie ? <Facts movie={movie} /> : <Text>Loading...</Text>}
          <Pressable
            style={styles.button}
            onPress={() => toggleModal(false)}
            accessibilityLabel="Close modal"
          >
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: 20,
    borderWidth: 4,
    padding: 12,
    elevation: 2,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 20,
    elevation: 5,
    justifyContent: "space-evenly",
    margin: 8,
    maxHeight: "80%",
    padding: 16,
  },
  buttonText: {
    color: colors.white,
    fontFamily: "Arvo-Bold",
    textAlign: "center",
  },
})

export default MovieModal
