import React, { useEffect } from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated"
import { hapticsService } from "../utils/hapticsService"
import { useStyles, Theme } from "../utils/hooks/useStyles"
import { Typography } from "./ui/typography"
import { Button } from "./ui/button"

interface TutorialTooltipProps {
  isVisible: boolean
  text: string
  onDismiss: () => void
  style?: object
}

const TutorialTooltip: React.FC<TutorialTooltipProps> = ({
  isVisible,
  text,
  onDismiss,
  style,
}) => {
  const styles = useStyles(themedStyles)
  const animation = useSharedValue(0)

  useEffect(() => {
    animation.value = withTiming(isVisible ? 1 : 0, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    })
  }, [isVisible, animation])

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: animation.value,
    transform: [{ translateY: interpolate(animation.value, [0, 1], [10, 0]) }],
  }))

  const handleDismiss = () => {
    hapticsService.medium()
    onDismiss()
  }

  if (!isVisible) return null

  return (
    <Animated.View style={[styles.container, animatedContainerStyle, style]}>
      <View style={styles.tooltipBox}>
        <Typography style={styles.text}>{text}</Typography>
        <Button
          title="Got it"
          onPress={handleDismiss}
          size="sm"
          variant="secondary"
          style={{alignSelf: 'center', backgroundColor: 'white'}} 
        />
      </View>
      <View style={styles.pointer} />
    </Animated.View>
  )
}

interface TutorialTooltipStyles {
  container: ViewStyle
  tooltipBox: ViewStyle
  text: TextStyle
  pointer: ViewStyle
}

const themedStyles = (theme: Theme): TutorialTooltipStyles => ({
  container: {
    position: "absolute",
    zIndex: 100,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    ...theme.shadows.medium,
  },
  tooltipBox: {
    backgroundColor: theme.colors.tertiary,
    borderRadius: theme.responsive.scale(8),
    padding: theme.spacing.medium,
    width: "100%",
  },
  text: {
    fontFamily: "Arvo-Regular",
    fontSize: theme.responsive.responsiveFontSize(15),
    color: theme.colors.background,
    lineHeight: theme.responsive.responsiveFontSize(21),
    textAlign: "center",
    marginBottom: theme.spacing.medium,
  },
  pointer: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: theme.responsive.scale(10),
    borderRightWidth: theme.responsive.scale(10),
    borderBottomWidth: theme.responsive.scale(10),
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: theme.colors.tertiary,
    transform: [{ rotate: "180deg" }],
  },
})

export default TutorialTooltip
