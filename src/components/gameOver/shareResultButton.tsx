import React, { useMemo, useState } from "react"
import { View, Pressable, Text, ActivityIndicator, Alert } from "react-native"
import { useTheme } from "../../contexts/themeContext"
import { getMovieStyles } from "../../styles/movieStyles"
import { shareGameResult } from "../../utils/shareUtils"
import { PlayerGame } from "../../models/game"

interface ShareResultButtonProps {
  playerGame: PlayerGame
}

const ShareResultButton: React.FC<ShareResultButtonProps> = ({
  playerGame,
}) => {
  const { colors } = useTheme()
  const movieStyles = useMemo(() => getMovieStyles(colors), [colors])
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    if (isSharing) return
    setIsSharing(true)
    try {
      await shareGameResult(playerGame)
    } catch (error) {
      console.error("Error during sharing process:", error)
      Alert.alert(
        "Sharing Failed",
        "An error occurred while trying to share your results."
      )
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <View style={movieStyles.gameOverButtonsContainer}>
      <Pressable
        onPress={handleShare}
        style={({ pressed }) => [
          movieStyles.gameOverButton,
          (pressed || isSharing) && movieStyles.pressedButton,
          isSharing && movieStyles.disabledButton,
        ]}
        disabled={isSharing}
      >
        {isSharing ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Text style={movieStyles.gameOverButtonText}>Share Your Result</Text>
        )}
      </Pressable>
    </View>
  )
}

export default ShareResultButton
