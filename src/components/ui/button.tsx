import React, { useMemo } from "react"
import {
  Pressable,
  Text,
  StyleSheet,
  PressableProps,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native"
import { useTheme } from "../../contexts/themeContext"
import { getButtonStyles } from "../../styles/global"

type ButtonVariant = "primary" | "secondary" | "error" | "tertiary"
type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps extends PressableProps {
  title: string
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  style?: ViewStyle
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  style,
  ...props
}) => {
  const { colors } = useTheme()
  const baseStyles = useMemo(() => getButtonStyles(colors), [colors])
  const variantStyles = useMemo(
    () => getVariantStyles(colors, variant),
    [colors, variant]
  )
  const sizeStyles = useMemo(() => getSizeStyles(size), [size])

  const isDisabled = disabled || isLoading

  return (
    <Pressable
      style={({ pressed }) => [
        baseStyles.base,
        sizeStyles.button,
        variantStyles.button,
        pressed && !isDisabled && baseStyles.pressed,
        isDisabled && baseStyles.disabled,
        style,
      ]}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variantStyles.text.color as string} />
      ) : (
        <Text style={[baseStyles.text, sizeStyles.text, variantStyles.text]}>
          {title}
        </Text>
      )}
    </Pressable>
  )
}

const getVariantStyles = (
  colors: any,
  variant: ButtonVariant
): { button: ViewStyle; text: TextStyle } => {
  switch (variant) {
    case "secondary":
      return {
        button: {
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: colors.primary,
        },
        text: {
          color: colors.primary,
        },
      }
    case "error":
      return {
        button: {
          backgroundColor: colors.error,
        },
        text: {
          color: colors.background,
        },
      }
    case "tertiary":
      return {
        button: {
          backgroundColor: colors.tertiary,
        },
        text: {
          color: colors.background,
        },
      }
    case "primary":
    default:
      return {
        button: {
          backgroundColor: colors.primary,
        },
        text: {
          color: colors.background,
        },
      }
  }
}

const getSizeStyles = (
  size: ButtonSize
): { button: ViewStyle; text: TextStyle } => {
  switch (size) {
    case "sm":
      return StyleSheet.create({
        button: { paddingVertical: 8 },
        text: { fontSize: 14 },
      })
    case "lg":
      return StyleSheet.create({
        button: { paddingVertical: 16 },
        text: { fontSize: 18 },
      })
    case "md":
    default:
      return StyleSheet.create({ button: {}, text: {} })
  }
}
