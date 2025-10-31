import React, { useState, useEffect, useCallback, memo } from "react"
import { View, TextStyle, ViewStyle } from "react-native"
import { useStyles, Theme } from "../utils/hooks/useStyles"
import { Typography } from "./ui/typography"

const CountdownTimer: React.FC = () => {
  const styles = useStyles(themedStyles)

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
    <View style={styles.container}>
      <Typography style={styles.text}>
        Next game in {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
      </Typography>
    </View>
  )
}

interface CountdownStyles {
  container: ViewStyle
  text: TextStyle
}

const themedStyles = (theme: Theme): CountdownStyles => ({
  container: {
    marginTop: theme.spacing.large,
    padding: theme.spacing.small,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.responsive.scale(8),
  },
  text: {
    ...theme.typography.caption,
    fontFamily: "Arvo-Bold",
    color: theme.colors.textSecondary,
    fontSize: theme.responsive.responsiveFontSize(14),
  },
})

export default memo(CountdownTimer)
