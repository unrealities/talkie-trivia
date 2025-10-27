import React, { useMemo } from "react"
import { View, Text, StyleProp, TextStyle } from "react-native"
import { useTheme } from "../contexts/themeContext"
import { getPlayerStatsStyles } from "../styles/playerStatsStyles"

interface StatItemProps {
  label: string
  value: string | number
  valueStyle?: StyleProp<TextStyle>
}

const StatItem: React.FC<StatItemProps> = ({ label, value, valueStyle }) => {
  const { colors } = useTheme()
  const playerStatsStyles = useMemo(
    () => getPlayerStatsStyles(colors),
    [colors]
  )

  return (
    <View style={playerStatsStyles.statContainer}>
      <Text style={playerStatsStyles.header}>{label}</Text>
      <Text style={[playerStatsStyles.text, valueStyle]}>{value}</Text>
    </View>
  )
}

export default StatItem
