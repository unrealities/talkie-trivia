import React, { useRef, useEffect, useCallback, useMemo } from "react"
import ConfettiCannon from "react-native-confetti-cannon"
import { useTheme } from "../contexts/themeContext"

interface ConfettiCelebrationProps {
  startConfetti: boolean
  onConfettiStop?: () => void
}

const ConfettiCelebration: React.FC<ConfettiCelebrationProps> = ({
  startConfetti,
  onConfettiStop,
}) => {
  const { colors } = useTheme()
  const confettiRef = useRef<any>(null)
  const start = useCallback(() => {
    confettiRef.current?.start()
  }, [])
  const stop = useCallback(() => {
    onConfettiStop?.()
  }, [onConfettiStop])

  useEffect(() => {
    if (startConfetti) start()
  }, [startConfetti, start])

  const confettiColors = useMemo(
    () => [colors.primary, colors.secondary, colors.tertiary, colors.quinary],
    [colors]
  )

  const confettiCannon = startConfetti ? (
    <ConfettiCannon
      testID="confetti-cannon"
      count={250}
      origin={{ x: -100, y: 0 }}
      colors={confettiColors}
      fallSpeed={2000}
      fadeOut={true}
      explosionSpeed={500}
      ref={confettiRef}
    />
  ) : null
  return confettiCannon
}

export default ConfettiCelebration
