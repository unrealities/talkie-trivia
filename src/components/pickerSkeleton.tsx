import React from "react"
import { View } from "react-native"
import Animated from "react-native-reanimated"
import { pickerStyles } from "../styles/pickerStyles"
import { colors } from "../styles/global"
import { useSkeletonAnimation } from "../utils/hooks/useSkeletonAnimation"

const PickerSkeleton = () => {
  const animatedStyle = useSkeletonAnimation()

  return (
    <Animated.View style={[pickerStyles.container, animatedStyle]}>
      <View style={pickerStyles.inputContainer}>
        <View
          style={[
            pickerStyles.input,
            { backgroundColor: colors.grey, borderColor: colors.grey },
          ]}
        />
      </View>
      <View style={pickerStyles.resultsContainer} />
      <View style={[pickerStyles.button, pickerStyles.disabledButton]} />
    </Animated.View>
  )
}

export default PickerSkeleton
