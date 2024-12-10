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

  // Cap scaling based on screen size
  if (isLargeScreen()) {
    return PixelRatio.roundToNearestPixel(size * Math.min(scale, 1.3)) // Cap at 30% increase for large screens
  }
  return PixelRatio.roundToNearestPixel(size * scale)
}

const responsiveFontSize = (size: number) => {
  let scaleFactor = 1

  if (isSmallScreen()) {
    scaleFactor = SCREEN_WIDTH / baseWidth
  } else if (isMediumScreen()) {
    scaleFactor = 1.1
  } else {
    scaleFactor = 1.2
  }

  return Math.min(
    PixelRatio.roundToNearestPixel(size * scaleFactor),
    size * 1.3 // Maximum font size increase
  )
}

export const colors = {
  background: "#003049",
  primary: "#f77f00",
  secondary: "#eae2b7",
  tertiary: "#fcbf49",
  quaternary: "#d62828",
  quinary: "#29d7d7",
  white: "#fff",
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
