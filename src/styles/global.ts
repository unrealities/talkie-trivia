import { Dimensions, PixelRatio, Platform } from "react-native"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

// Base design dimensions (use a standard design width)
const baseWidth = 375
const baseHeight = 812

// Responsive scaling function
const scale = (size: number) => {
  const scaleWidth = SCREEN_WIDTH / baseWidth
  const scaleHeight = SCREEN_HEIGHT / baseHeight
  const scale = Math.min(scaleWidth, scaleHeight)
  return PixelRatio.roundToNearestPixel(size * scale)
}

// Responsive font size
const responsiveFontSize = (size: number) => {
  const scaleFactor = Math.min(SCREEN_WIDTH / baseWidth, 1.2) // Cap scaling at 20% increase
  return PixelRatio.roundToNearestPixel(size * scaleFactor)
}

export const colors = {
  // Same colors as before
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
}
