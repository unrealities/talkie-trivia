import React, { memo, useMemo } from "react"
import { View, Text } from "react-native"
import Animated from "react-native-reanimated"
import { useTheme } from "../../contexts/themeContext"
import { getGuessesStyles } from "../../styles/guessesStyles"
import { useSkeletonAnimation } from "../../utils/hooks/useSkeletonAnimation"

const SkeletonRow = memo(({ index }: { index: number }) => {
  const { colors } = useTheme()
  const guessesStyles = useMemo(() => getGuessesStyles(colors), [colors])
  const animatedStyle = useSkeletonAnimation()
  return (
    <Animated.View style={[guessesStyles.skeletonRow, animatedStyle]}>
      <Text style={guessesStyles.guessNumber}>{index + 1}</Text>
      <View style={guessesStyles.skeletonTextContainer}>
        <View style={guessesStyles.skeletonText} />
      </View>
    </Animated.View>
  )
})

export default SkeletonRow
