import React, { memo, useMemo } from "react"
import { Text, View } from "react-native"
import { getTitleHeaderStyles } from "../styles/titleHeaderStyles"
import { useTheme } from "../contexts/themeContext"

const TitleHeader = memo(() => {
  const { colors } = useTheme()
  const titleHeaderStyles = useMemo(() => getTitleHeaderStyles(colors), [colors])

  return (
    <View style={titleHeaderStyles.container}>
      <Text style={titleHeaderStyles.header}>
        Match the plot to the movie!
      </Text>
    </View>
  )
})

export default TitleHeader