import React from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { useStyles, Theme } from "../../utils/hooks/useStyles"
import { Typography } from "../ui/typography"
import { useGameStore } from "../../state/gameStore"
import { GAME_MODE_CONFIG } from "../../config/difficulty"

interface FullPlotSectionProps {
  overview: string
}

const FullPlotSection: React.FC<FullPlotSectionProps> = ({ overview }) => {
  const gameMode = useGameStore((state) => state.gameMode)
  const styles = useStyles(themedStyles)

  return (
    <View style={styles.container}>
      <Typography variant="body" style={styles.title}>
        {GAME_MODE_CONFIG[gameMode].fullDescriptionTitle}
      </Typography>
      <Typography variant="body" style={styles.text}>
        {overview}
      </Typography>
    </View>
  )
}

interface FullPlotStyles {
  container: ViewStyle
  title: TextStyle
  text: TextStyle
}

const themedStyles = (theme: Theme): FullPlotStyles => ({
  container: {
    width: "100%",
    marginTop: theme.spacing.extraLarge,
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.background,
    borderRadius: theme.responsive.scale(8),
  },
  title: {
    fontFamily: "Arvo-Bold",
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.small,
  },
  text: {
    color: theme.colors.textPrimary,
    fontFamily: "Arvo-Regular",
    fontSize: theme.responsive.responsiveFontSize(14),
    lineHeight: theme.responsive.responsiveFontSize(20),
  },
})

export default FullPlotSection
