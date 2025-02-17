export const colors = {
  background: "#1A1A1A",
  primary: "#F77F00",
  secondary: "#F0F0F0",
  tertiary: "#FCBF49",
  quaternary: "#D62828",
  quinary: "#29D7D7",
  white: "#FFFFFF",
  grey: "#555555",
  lightGrey: "#AAAAAA",
}
import { Dimensions, PixelRatio, Platform } from "react-native"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

// Base design dimensions (use a standard design width)
const baseWidth = 375
const baseHeight = 812

// Screen size categories
const isSmallScreen = () => SCREEN_WIDTH < 375
const isMediumScreen = () => SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768
const isLargeScreen = () => SCREEN_WIDTH >= 768

// Responsive scaling function (refined)
const scale = (size: number) => {
  const scaleWidth = SCREEN_WIDTH / baseWidth
  const scaleHeight = SCREEN_HEIGHT / baseHeight
  const scale = Math.min(scaleWidth, scaleHeight)

  return PixelRatio.roundToNearestPixel(size * scale)
}

const responsiveFontSize = (size: number) => {
  let scaleFactor = 1

  if (isSmallScreen()) {
    scaleFactor = (SCREEN_WIDTH / baseWidth) * 0.9
  } else if (isMediumScreen()) {
    scaleFactor = 1.0
  } else {
    scaleFactor = 1.1
  }

  return Math.min(
    PixelRatio.roundToNearestPixel(size * scaleFactor),
    size * 1.2
  )
}

export const responsive = {
  scale,
  responsiveFontSize,
  isSmallDevice: SCREEN_WIDTH < 375,
  isTablet: SCREEN_WIDTH >= 768,
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  platform: Platform.OS,
  isSmallScreen,
  isMediumScreen,
  isLargeScreen,
}
