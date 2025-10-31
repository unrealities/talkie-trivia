import React, { useEffect } from "react"
import { Image } from "expo-image"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  interpolate,
  runOnJS,
  Easing,
} from "react-native-reanimated"
import { useGameStore } from "../state/gameStore"
import { API_CONFIG } from "../config/constants"
import { useStyles, Theme } from "../utils/hooks/useStyles"
import { ViewStyle, ImageStyle, TextStyle } from "react-native"

const defaultMovieImage = require("../../assets/movie_default.png")

interface RevealSequenceProps {
  onAnimationComplete: () => void
}

const RevealSequence: React.FC<RevealSequenceProps> = ({
  onAnimationComplete,
}) => {
  const movie = useGameStore((state) => state.playerGame.movie)
  const styles = useStyles(themedStyles)

  const containerOpacity = useSharedValue(0)
  const posterRotate = useSharedValue(0)
  const titleOpacity = useSharedValue(0)

  useEffect(() => {
    containerOpacity.value = withTiming(1, { duration: 300 })
    posterRotate.value = withDelay(
      300,
      withTiming(1, { duration: 800, easing: Easing.out(Easing.poly(4)) })
    )
    titleOpacity.value = withDelay(
      1200,
      withTiming(1, { duration: 500 }, () => {
        setTimeout(() => {
          runOnJS(onAnimationComplete)()
        }, 1000)
      })
    )
  }, [containerOpacity, posterRotate, titleOpacity, onAnimationComplete])

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }))

  const posterStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(posterRotate.value, [0, 1], [180, 360])
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
    }
  })

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [
      { translateY: interpolate(titleOpacity.value, [0, 1], [20, 0]) },
    ],
  }))

  const imageSource = movie.poster_path
    ? { uri: `${API_CONFIG.TMDB_IMAGE_BASE_URL_W500}${movie.poster_path}` }
    : defaultMovieImage

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={posterStyle}>
        <Image source={imageSource} style={styles.poster} contentFit="cover" />
      </Animated.View>
      <Animated.Text style={[styles.title, titleStyle]}>
        {movie.title}
      </Animated.Text>
    </Animated.View>
  )
}

interface RevealSequenceStyles {
  container: ViewStyle
  poster: ImageStyle
  title: TextStyle
}

const themedStyles = (theme: Theme): RevealSequenceStyles => ({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  poster: {
    width: theme.responsive.scale(180),
    height: theme.responsive.scale(270),
    borderRadius: theme.responsive.scale(10),
    ...theme.shadows.medium,
  },
  title: {
    fontFamily: "Arvo-Bold",
    fontSize: theme.responsive.responsiveFontSize(24),
    color: theme.colors.primary,
    textAlign: "center",
    marginTop: theme.spacing.large,
    paddingHorizontal: theme.spacing.small,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
})

export default RevealSequence
