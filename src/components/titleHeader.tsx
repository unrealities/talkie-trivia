import React, { memo } from "react"
import { Text, View } from "react-native"
import { titleHeaderStyles } from "../styles/titleHeaderStyles"

const TitleHeader = memo(() => {
  return (
    <View style={titleHeaderStyles.container}>
      <Text style={titleHeaderStyles.header}>TALKIE TRIVIA</Text>
      <Text style={titleHeaderStyles.subHeader}>
        Guess the Movie from its Summary
      </Text>
    </View>
  )
})

export default TitleHeader
