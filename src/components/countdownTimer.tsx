import React, { useState, useEffect, useCallback, memo, useMemo } from "react"
import { View, Text } from "react-native"
import { getMovieStyles } from "../styles/movieStyles"
import { useTheme } from "../contexts/themeContext"

const CountdownTimer: React.FC = () => {
  const { colors } = useTheme()
  const movieStyles = useMemo(() => getMovieStyles(colors), [colors])

  const calculateTimeLeft = useCallback(() => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(now.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const difference = tomorrow.getTime() - now.getTime()

    let timeLeft = {
      hours: "00",
      minutes: "00",
      seconds: "00",
    }

    if (difference > 0) {
      const pad = (num: number) => num.toString().padStart(2, "0")
      timeLeft = {
        hours: pad(Math.floor((difference / (1000 * 60 * 60)) % 24)),
        minutes: pad(Math.floor((difference / 1000 / 60) % 60)),
        seconds: pad(Math.floor((difference / 1000) % 60)),
      }
    }

    return timeLeft
  }, [])

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    // Clear interval on component unmount
    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  return (
    <View style={movieStyles.countdownContainer}>
      <Text style={movieStyles.countdownText}>
        Next game in {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
      </Text>
    </View>
  )
}

export default memo(CountdownTimer)
