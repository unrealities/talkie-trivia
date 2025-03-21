import React, { useRef, useEffect, useCallback } from "react"
import ConfettiCannon from "react-native-confetti-cannon"
import { colors } from "../styles/global"

interface ConfettiCelebrationProps {
  startConfetti: boolean
  onConfettiStop?: () => void
}

const ConfettiCelebration: React.FC<ConfettiCelebrationProps> = ({
  startConfetti,
  onConfettiStop,
}) => {
  const confettiRef = useRef<ConfettiCannon>(null)

  const start = useCallback(() => {
    confettiRef.current?.start()
  }, [])

  const stop = useCallback(() => {
    onConfettiStop?.()
  }, [onConfettiStop])

  useEffect(() => {
    if (startConfetti) {
      start()
    }

    return () => {
      confettiRef.current?.stop?.()
    }
  }, [startConfetti, start])

  return (
    <ConfettiCannon
      testID="confetti-cannon"
      count={250}
      origin={{ x: -100, y: 0 }}
      colors={Object.values(colors)}
      fallSpeed={2000}
      fadeOut={true}
      explosionSpeed={500}
      ref={confettiRef}
      onAnimationEnd={stop}
    />
  )
}

export default ConfettiCelebration
