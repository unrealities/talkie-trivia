import React, { useMemo } from "react"
import { View, Text, StyleSheet } from "react-native"
import { FontAwesome5 } from "@expo/vector-icons"
import { useTheme } from "../contexts/themeContext"
import { getWhereToWatchStyles } from "../styles/whereToWatchStyles"

// NOTE: This is a STUB component. In a real application, use an API
// like the JustWatch API or The Movie Database's /watch/providers endpoint
// to get a dynamic list of streaming services for the given movie.

const WhereToWatch: React.FC = () => {
  const { colors } = useTheme()
  const styles = useMemo(() => getWhereToWatchStyles(colors), [colors])

  const mockProviders = [
    { name: "Netflix", icon: "netflix", color: "#E50914" },
    { name: "Prime Video", icon: "amazon", color: "#00A8E1" },
    { name: "Disney+", icon: "plus", color: "#113CCF" },
    { name: "Rent", icon: "ticket-alt", color: colors.tertiary },
  ]

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Where to Watch</Text>
      <View style={styles.providersContainer}>
        {mockProviders.map((provider) => (
          <View key={provider.name} style={styles.provider}>
            <FontAwesome5
              name={provider.icon as any}
              size={24}
              color={provider.color}
            />
            <Text style={styles.providerText}>{provider.name}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.disclaimer}>
        *Streaming availability is illustrative and may change.
      </Text>
    </View>
  )
}

export default WhereToWatch
