import React, { memo, useMemo } from "react"
import { View, Text, Platform } from "react-native"
import { getAppStyles } from "../styles/appStyles"
import CustomLoadingIndicator from "./customLoadingIndicator"
import { useTheme } from "../contexts/themeContext"
import Constants from "expo-constants"
import { DEVICE_CONFIG } from "../config/constants"

interface LoadingIndicatorProps {
  message?: string
}

const useDeviceCheck = () => {
  const isLowEndDevice = useMemo(() => {
    if (Platform.OS === "web") return false

    const deviceYearClass = Constants.deviceYearClass
    const threshold = DEVICE_CONFIG.LOW_END_DEVICE_THRESHOLD_YEAR

    if (deviceYearClass === null || typeof deviceYearClass === "undefined")
      return false

    // Expo's deviceYearClass maps roughly to year - 2011 + 1 (e.g., a 2018 device is class 8)
    // We want devices older than the threshold (e.g., older than 2018) to be considered low-end.
    // If the device year class is less than the calculated threshold class, it's low end.
    // Assuming 2011 is class 1, 2018 is class 8.
    const requiredClass = threshold - 2011

    return deviceYearClass < requiredClass
  }, [])

  return isLowEndDevice
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = memo(
  ({ message }) => {
    const { colors } = useTheme()
    const styles = useMemo(() => getAppStyles(colors), [colors])
    const isLowEndDevice = useDeviceCheck()

    return (
      <View
        style={styles.loadingContainer}
        testID="loading-indicator-container"
      >
        <CustomLoadingIndicator isLowEndDevice={isLowEndDevice} />
        {message && <Text style={styles.messageText}>{message}</Text>}
      </View>
    )
  }
)

export default LoadingIndicator
