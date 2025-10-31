import React, { useMemo } from "react"
import { Text, TextProps } from "react-native"
import { useTheme } from "../../contexts/themeContext"
import { getTypography } from "../../styles/global"

type TypographyVariant = "h1" | "h2" | "body" | "caption" | "button" | "error"

interface TypographyProps extends TextProps {
  variant?: TypographyVariant
}

export const Typography: React.FC<TypographyProps> = ({
  variant = "body",
  style,
  ...props
}) => {
  const { colors } = useTheme()
  const typographyStyles = useMemo(() => getTypography(colors), [colors])

  const getStyleForVariant = () => {
    switch (variant) {
      case "h1":
        return typographyStyles.heading1
      case "h2":
        return typographyStyles.heading2
      case "button":
        return typographyStyles.button
      case "caption":
        return typographyStyles.caption
      case "error":
        return { ...typographyStyles.bodyText, color: colors.error }
      case "body":
      default:
        return typographyStyles.bodyText
    }
  }

  const variantStyle = getStyleForVariant()

  return <Text style={[variantStyle, style]} {...props} />
}
