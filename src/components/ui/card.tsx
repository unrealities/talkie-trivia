import React, { useMemo } from "react"
import { View, ViewProps, StyleSheet, Platform } from "react-native"
import { useTheme } from "../../contexts/themeContext"
import { responsive, shadows } from "../../styles/global"

interface CardProps extends ViewProps {}

export const Card: React.FC<CardProps> = ({ style, ...props }) => {
  const { colors } = useTheme()
  const cardStyles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.surface,
          borderRadius: responsive.scale(12),
          ...shadows.light,
          ...Platform.select({
            android: {
              borderWidth: 1,
              borderColor: colors.border,
            },
          }),
        },
      }),
    [colors]
  )

  return <View style={[cardStyles.card, style]} {...props} />
}
