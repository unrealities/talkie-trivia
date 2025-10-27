import React, { useEffect, useMemo } from "react"
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
import { useTheme } from "../contexts/themeContext"
import { useGameStore } from "../state/gameStore"
import { API_CONFIG } from "../config/constants"
import { getRevealSequenceStyles } from "../styles/revealSequenceStyles"

const defaultMovieImage = require("../../assets/movie_default.png")

interface RevealSequenceProps {
  onAnimationComplete: () => void
}

const RevealSequence: React.FC<RevealSequenceProps> = ({
  onAnimationComplete,
}) => {
  const movie = useGameStore((state) => state.playerGame.movie)
  const { colors } = useTheme()
  const styles = useMemo(() => getRevealSequenceStyles(colors), [colors])

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
        // Trigger the state transition back in the store after all animations are done
        setTimeout(() => {
          runOnJS(onAnimationComplete)()
        }, 1000) // Hold the final reveal for a second before transitioning
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

export default RevealSequence
