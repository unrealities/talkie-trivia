import React, { useMemo } from "react"
import { View, Text } from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { useTheme } from "../contexts/themeContext"
import { getAppStyles } from "../styles/appStyles"
import { responsive } from "../styles/global"

interface ProfileSectionProps {
  title: string
  icon: keyof typeof FontAwesome.glyphMap
  children: React.ReactNode
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  title,
  icon,
  children,
}) => {
  const { colors } = useTheme()
  const appStyles = useMemo(() => getAppStyles(colors), [colors])

  return (
    <View style={appStyles.profileSection}>
      <View style={appStyles.profileSectionHeader}>
        <FontAwesome
          name={icon}
          size={responsive.responsiveFontSize(16)}
          color={colors.primary}
        />
        <Text style={appStyles.profileSectionTitle}>{title}</Text>
      </View>
      <View style={appStyles.profileSectionContent}>{children}</View>
    </View>
  )
}

export default ProfileSection
