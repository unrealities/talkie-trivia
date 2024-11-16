import React from "react"
import { StyleSheet, Text, View } from "react-native"

import { colors } from "../styles/global"

const TitleHeader = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>TALKIE-TRIVIA</Text>
      <Text style={styles.subHeader}>guess the movie, given its summary</Text>
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
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
    marginTop: 30,
    minHeight: 60,
    minWidth: 300,
  },
  header: {
    color: colors.primary,
    fontFamily: "Arvo-Bold",
    fontSize: 24,
    paddingTop: 6,
    textAlign: "center",
  },
  subHeader: {
    color: colors.secondary,
    fontFamily: "Arvo-Italic",
    fontSize: 14,
    paddingBottom: 6,
    textAlign: "center",
  },
})

export default TitleHeader
