import React from "react"
import { View, ViewStyle } from "react-native"
import Animated from "react-native-reanimated"
import { useSkeletonAnimation } from "../utils/hooks/useSkeletonAnimation"
import { useStyles, Theme } from "../utils/hooks/useStyles"

const PickerSkeleton = () => {
  const styles = useStyles(themedStyles)
  const animatedStyle = useSkeletonAnimation()

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.inputContainer}>
        <View style={styles.input} />
      </View>
    </Animated.View>
  )
}

interface SkeletonStyles {
  container: ViewStyle
  inputContainer: ViewStyle
  input: ViewStyle
}

const themedStyles = (theme: Theme): SkeletonStyles => ({
  container: {
    width: "100%",
    marginTop: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
  },
  inputContainer: {
    flexDirection: "row",
    position: "relative",
    width: "100%",
  },
  input: {
    flex: 1,
    height: 50, // Approximate height of the TextInput
    borderRadius: theme.responsive.scale(8),
    backgroundColor: theme.colors.surface,
  },
})

export default PickerSkeleton
