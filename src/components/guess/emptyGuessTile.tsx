import React from "react"
import { View, Text, ViewStyle, TextStyle } from "react-native"
import { useStyles, Theme } from "../../utils/hooks/useStyles"

export const EmptyGuessTile = ({ index }: { index: number }) => {
  const styles = useStyles(themedStyles)
  return (
    <View style={styles.emptyGuessTile}>
      <Text style={styles.guessNumber}>{index + 1}</Text>
    </View>
  )
}

interface EmptyGuessTileStyles {
  emptyGuessTile: ViewStyle
  guessNumber: TextStyle
}

const themedStyles = (theme: Theme): EmptyGuessTileStyles => ({
  emptyGuessTile: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.responsive.scale(8),
    paddingHorizontal: theme.spacing.medium,
    minHeight: theme.responsive.scale(44),
    marginBottom: theme.spacing.small,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
  },
  guessNumber: {
    color: theme.colors.textSecondary,
    fontFamily: "Arvo-Bold",
    fontSize: theme.responsive.responsiveFontSize(14),
    marginRight: theme.spacing.small,
  },
})
