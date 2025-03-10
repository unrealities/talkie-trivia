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
  const confettiRef = useRef<ConfettiCannonRef>(null)

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
  }, [startConfetti, start])

  return (
    <ConfettiCannon
      autoStart={false}
      colors={Object.values(colors)}
      count={250}
      explosionSpeed={500}
      fadeOut={true}
      fallSpeed={2000}
      origin={{ x: -100, y: 0 }}
      ref={confettiRef}
      onAnimationEnd={stop}
    />
  )
}

export default ConfettiCelebration
