import React from "react"
import { StyleSheet, Text, View } from "react-native"

import { colors } from "../styles/global"

const TitleHeader = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>TALKIE-TRIVIA</Text>
      <Text style={styles.subHeader}>guess the movie, given its summary.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: colors.primary,
    borderBottomWidth: 2,
    borderTopColor: colors.primary,
    borderTopWidth: 2,
    borderStyle: "solid",
    flex: 1,
    justifyContent: "center",
    paddingBottom: 6,
    paddingTop: 6,
    marginTop: 30,
    maxHeight: 75,
    minHeight: 60,
    minWidth: 300,
  },
  header: {
    color: colors.primary,
    flex: 1,
    fontFamily: "Arvo-Bold",
    fontSize: 24,
    minHeight: 40,
    paddingTop: 6,
    textAlign: "center",
  },
  subHeader: {
    color: colors.secondary,
    flex: 1,
    fontFamily: "Arvo-Italic",
    fontSize: 14,
    minHeight: 30,
    paddingBottom: 6,
    textAlign: "center",
  },
})

export default TitleHeader
