import React, { memo } from "react"
import { View } from "react-native"
import { Typography } from "./ui/typography"
import { useStyles, Theme } from "../utils/hooks/useStyles"

const TitleHeader = memo(() => {
  const styles = useStyles(themedStyles)

  return (
    <View style={styles.container}>
      <Typography variant="h2" style={styles.header}>
        Match the plot to the movie!
      </Typography>
    </View>
  )
})

const themedStyles = (theme: Theme) => ({
  container: {
    justifyContent: "center",
    alignItems: "flex-start",
    paddingVertical: theme.responsive.scale(4),
    flex: 1,
  },
  header: {
    fontSize: theme.responsive.responsiveFontSize(18),
    color: theme.colors.primary,
    textAlign: "left",
  },
})

export default TitleHeader
