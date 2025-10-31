import React from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { FontAwesome5 } from "@expo/vector-icons"
import { useStyles, Theme } from "../utils/hooks/useStyles"
import { Typography } from "./ui/typography"

const WhereToWatch: React.FC = () => {
  const styles = useStyles(themedStyles)

  const mockProviders = [
    { name: "Netflix", icon: "netflix", color: "#E50914" },
    { name: "Prime Video", icon: "amazon", color: "#00A8E1" },
    { name: "Disney+", icon: "plus", color: "#113CCF" },
    {
      name: "Rent",
      icon: "ticket-alt",
      color: styles.rawTheme.colors.tertiary,
    },
  ]

  return (
    <View style={styles.container}>
      <Typography style={styles.title}>Where to Watch</Typography>
      <View style={styles.providersContainer}>
        {mockProviders.map((provider) => (
          <View key={provider.name} style={styles.provider}>
            <FontAwesome5
              name={provider.icon as any}
              size={24}
              color={provider.color}
            />
            <Typography style={styles.providerText}>{provider.name}</Typography>
          </View>
        ))}
      </View>
      <Typography style={styles.disclaimer}>
        *Streaming availability is illustrative and may change.
      </Typography>
    </View>
  )
}

interface WhereToWatchStyles {
  container: ViewStyle
  title: TextStyle
  providersContainer: ViewStyle
  provider: ViewStyle
  providerText: TextStyle
  disclaimer: TextStyle
  rawTheme: Theme
}

const themedStyles = (theme: Theme): WhereToWatchStyles => ({
  container: {
    width: "100%",
    padding: theme.spacing.medium,
    marginTop: theme.spacing.large,
    backgroundColor: theme.colors.background,
    borderRadius: theme.responsive.scale(8),
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontFamily: "Arvo-Bold",
    fontSize: theme.responsive.responsiveFontSize(16),
    color: theme.colors.textPrimary,
    textAlign: "center",
    marginBottom: theme.spacing.medium,
  },
  providersContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: theme.spacing.small,
  },
  provider: {
    alignItems: "center",
  },
  providerText: {
    fontFamily: "Arvo-Regular",
    fontSize: theme.responsive.responsiveFontSize(10),
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.extraSmall,
  },
  disclaimer: {
    fontFamily: "Arvo-Italic",
    fontSize: theme.responsive.responsiveFontSize(10),
    color: theme.colors.textDisabled,
    textAlign: "center",
    marginTop: theme.spacing.small,
  },
  rawTheme: theme,
})

export default WhereToWatch
