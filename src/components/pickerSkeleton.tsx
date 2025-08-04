import React, { useMemo } from "react"
import { View } from "react-native"
import Animated from "react-native-reanimated"
import { getPickerStyles } from "../styles/pickerStyles"
import { useSkeletonAnimation } from "../utils/hooks/useSkeletonAnimation"
import { useTheme } from "../contexts/themeContext"

const PickerSkeleton = () => {
  const { colors } = useTheme()
  const pickerStyles = useMemo(() => getPickerStyles(colors), [colors])
  const animatedStyle = useSkeletonAnimation()

  return (
    <Animated.View style={[pickerStyles.container, animatedStyle]}>
      <View style={pickerStyles.inputContainer}>
        <View
          style={[
            pickerStyles.input,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        />
      </View>
      <View style={pickerStyles.resultsContainer} />
      <View style={[pickerStyles.button, pickerStyles.disabledButton]} />
    </Animated.View>
  )
}

export default PickerSkeleton
