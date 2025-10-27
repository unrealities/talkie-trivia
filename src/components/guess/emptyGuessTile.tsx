import React, { useMemo } from "react"
import { View, Text } from "react-native"
import { useTheme } from "../../contexts/themeContext"
import { getGuessesStyles } from "../../styles/guessesStyles"

const EmptyGuessTile = ({ index }: { index: number }) => {
  const { colors } = useTheme()
  const guessesStyles = useMemo(() => getGuessesStyles(colors), [colors])
  return (
    <View style={guessesStyles.emptyGuessTile}>
      <Text style={guessesStyles.guessNumber}>{index + 1}</Text>
    </View>
  )
}

export default EmptyGuessTile
