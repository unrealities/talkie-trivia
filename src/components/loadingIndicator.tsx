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

// Helper to determine if the device is considered low-end
const useDeviceCheck = () => {
  const isLowEndDevice = useMemo(() => {
    // Check if we are in a test environment or web (handled in CustomLoadingIndicator directly)
    if (Platform.OS === "web") return false

    // Use deviceYearClass as a proxy for hardware capability
    const deviceYearClass = Constants.deviceYearClass
    const threshold = DEVICE_CONFIG.LOW_END_DEVICE_THRESHOLD_YEAR

    // If deviceYearClass is null or older than the threshold, consider it low-end for demanding animations.
    if (deviceYearClass === null) return false

    // We treat devices whose model year is strictly older than the threshold as low-end.
    // E.g., if threshold is 2018, a device from 2017 (class 7) is considered low-end here.
    return deviceYearClass < threshold - 2011 // Expo's class starts around year 2011 (class 1)
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
