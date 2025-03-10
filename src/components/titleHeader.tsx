import React, { memo } from "react"
import { Text, View } from "react-native"
import { titleHeaderStyles } from "../styles/titleHeaderStyles"

const TitleHeader = memo(() => {
  return (
    <View style={titleHeaderStyles.container}>
      <Text style={titleHeaderStyles.header}>
        Match the plot to the movie!
      </Text>
    </View>
  )
})

export default TitleHeader
