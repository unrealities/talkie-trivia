import { Dimensions, PixelRatio, Platform } from "react-native"

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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

const baseWidth = 375
const baseHeight = 812

const isSmallScreen = () => SCREEN_WIDTH < 375
const isMediumScreen = () => SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768
const isLargeScreen = () => SCREEN_WIDTH >= 768

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

export const typography = {
  heading1: {
    fontFamily: "Arvo-Bold",
    fontSize: responsiveFontSize(28),
    lineHeight: responsiveFontSize(34),
  },
  heading2: {
    fontFamily: "Arvo-Bold",
    fontSize: responsiveFontSize(22),
    lineHeight: responsiveFontSize(28),
  },
  bodyText: {
    fontFamily: "Arvo-Regular",
    fontSize: responsiveFontSize(16),
    lineHeight: responsiveFontSize(20),
  },
  caption: {
    fontFamily: "Arvo-Regular",
    fontSize: responsiveFontSize(12),
    lineHeight: responsiveFontSize(16),
  },
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

export const spacing = {
  extraSmall: responsive.scale(4),
  small: responsive.scale(8),
  medium: responsive.scale(16),
  large: responsive.scale(24),
  extraLarge: responsive.scale(32),
}

export const shadows = {
  light: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
}
