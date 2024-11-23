import React from "react"
import { Text, View } from "react-native"

import { titleHeaderStyles } from "../styles/titleHeaderStyles"

const TitleHeader = () => {
  return (
    <View style={titleHeaderStyles.container}>
      <Text style={titleHeaderStyles.header}>TALKIE-TRIVIA</Text>
      <Text style={titleHeaderStyles.subHeader}>
        guess the movie, given its summary
      </Text>
    </View>
  )
}

export default TitleHeader
