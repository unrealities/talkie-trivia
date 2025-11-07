import React, { memo } from "react"
import { View } from "react-native"
import { Typography } from "./ui/typography"
import { useStyles, Theme } from "../utils/hooks/useStyles"

interface TitleHeaderProps {
  title: string
}

const TitleHeader: React.FC<TitleHeaderProps> = memo(({ title }) => {
  const styles = useStyles(themedStyles)

  return (
    <View style={styles.container}>
      <Typography variant="h2" style={styles.header}>
        {title}
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
