import { StyleSheet } from "react-native"
import { spacing } from "./global"

/**
 * Utility Stylesheet (Atomic/Tailwind-inspired)
 * Provides a set of common, reusable styles for layout and spacing to reduce
 * the need for creating trivial named styles in component-specific stylesheets.
 *
 * Naming convention:
 * - `p` (padding), `m` (margin)
 * - `t, b, l, r` (top, bottom, left, right)
 * - `x` (horizontal), `y` (vertical)
 * - `Xs, Sm, Md, Lg, Xl` (extraSmall, small, medium, large, extraLarge sizes from spacing tokens)
 * - `0` (zero)
 *
 * Example: `mtMd` = margin-top: medium (spacing.medium)
 */
export const u = StyleSheet.create({
  /**
   * Display & Sizing
   */
  flex: { flex: 1 },
  wFull: { width: "100%" },
  hFull: { height: "100%" },

  /**
   * Flexbox
   */
  flexRow: { flexDirection: "row" },
  flexCol: { flexDirection: "column" },
  flexWrap: { flexWrap: "wrap" },
  flexGrow: { flexGrow: 1 },
  flexShrink: { flexShrink: 1 },

  // Justify Content
  justifyStart: { justifyContent: "flex-start" },
  justifyCenter: { justifyContent: "center" },
  justifyEnd: { justifyContent: "flex-end" },
  justifyBetween: { justifyContent: "space-between" },
  justifyAround: { justifyContent: "space-around" },

  // Align Items
  alignStart: { alignItems: "flex-start" },
  alignCenter: { alignItems: "center" },
  alignEnd: { alignItems: "flex-end" },
  alignStretch: { alignItems: "stretch" },

  /**
   * Spacing - Margin
   */
  m0: { margin: 0 },
  mXs: { margin: spacing.extraSmall },
  mSm: { margin: spacing.small },
  mMd: { margin: spacing.medium },
  mLg: { margin: spacing.large },
  mXl: { margin: spacing.extraLarge },

  mx0: { marginHorizontal: 0 },
  mxXs: { marginHorizontal: spacing.extraSmall },
  mxSm: { marginHorizontal: spacing.small },
  mxMd: { marginHorizontal: spacing.medium },
  mxLg: { marginHorizontal: spacing.large },
  mxXl: { marginHorizontal: spacing.extraLarge },

  my0: { marginVertical: 0 },
  myXs: { marginVertical: spacing.extraSmall },
  mySm: { marginVertical: spacing.small },
  myMd: { marginVertical: spacing.medium },
  myLg: { marginVertical: spacing.large },
  myXl: { marginVertical: spacing.extraLarge },

  mtSm: { marginTop: spacing.small },
  mtMd: { marginTop: spacing.medium },
  mbSm: { marginBottom: spacing.small },
  mbMd: { marginBottom: spacing.medium },
  mlSm: { marginLeft: spacing.small },
  mrSm: { marginRight: spacing.small },

  /**
   * Spacing - Padding
   */
  p0: { padding: 0 },
  pXs: { padding: spacing.extraSmall },
  pSm: { padding: spacing.small },
  pMd: { padding: spacing.medium },
  pLg: { padding: spacing.large },
  pXl: { padding: spacing.extraLarge },

  px0: { paddingHorizontal: 0 },
  pxXs: { paddingHorizontal: spacing.extraSmall },
  pxSm: { paddingHorizontal: spacing.small },
  pxMd: { paddingHorizontal: spacing.medium },
  pxLg: { paddingHorizontal: spacing.large },
  pxXl: { paddingHorizontal: spacing.extraLarge },

  py0: { paddingVertical: 0 },
  pyXs: { paddingVertical: spacing.extraSmall },
  pySm: { paddingVertical: spacing.small },
  pyMd: { paddingVertical: spacing.medium },
  pyLg: { paddingVertical: spacing.large },
  pyXl: { paddingVertical: spacing.extraLarge },

  ptSm: { paddingTop: spacing.small },
  ptMd: { paddingTop: spacing.medium },
  pbSm: { paddingBottom: spacing.small },
  pbMd: { paddingBottom: spacing.medium },

  /**
   * Typography
   */
  textCenter: { textAlign: "center" },
  textRight: { textAlign: "right" },
  textLeft: { textAlign: "left" },
  fontBold: { fontFamily: "Arvo-Bold" },
  fontItalic: { fontFamily: "Arvo-Italic" },

  /**
   * Borders
   */
  border: { borderWidth: 1 },
  borderT: { borderTopWidth: 1 },
  borderB: { borderBottomWidth: 1 },

  /**
   * Position
   */
  absolute: { position: "absolute" },
  relative: { position: "relative" },

  /**
   * Overflow
   */
  overflowHidden: { overflow: "hidden" },
})
