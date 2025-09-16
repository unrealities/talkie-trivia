import React, { useEffect, useMemo } from "react"
import { View, Text, StyleSheet } from "react-native"
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
import { responsive, shadows } from "../styles/global"
import { API_CONFIG } from "../config/constants"

const defaultMovieImage = require("../../assets/movie_default.png")

interface RevealSequenceProps {
  onAnimationComplete: () => void
}

const RevealSequence: React.FC<RevealSequenceProps> = ({
  onAnimationComplete,
}) => {
  const movie = useGameStore((state) => state.playerGame.movie)
  const { colors } = useTheme()

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

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "rgba(0,0,0,0.7)",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 100,
        },
        poster: {
          width: responsive.scale(180),
          height: responsive.scale(270),
          borderRadius: responsive.scale(10),
          ...shadows.medium,
        },
        title: {
          fontFamily: "Arvo-Bold",
          fontSize: responsive.responsiveFontSize(24),
          color: colors.primary,
          textAlign: "center",
          marginTop: responsive.scale(20),
          paddingHorizontal: responsive.scale(10),
          textShadowColor: "rgba(0, 0, 0, 0.75)",
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 2,
        },
      }),
    [colors]
  )

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
