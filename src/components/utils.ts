import { StyleSheet } from "react-native"
import { spacing } from "../styles/global"

/**
 * Utility Stylesheet (Atomic/Tailwind-inspired)
 * Provides a set of common, reusable styles for layout and spacing to reduce
 * the need for creating trivial named styles in component-specific stylesheets.
 *
 * Naming convention:
 * - `p` for padding, `m` for margin.
 * - `t, b, l, r` for top, bottom, left, right.
 * - `x, y` for horizontal, vertical.
 * - `sm, md, lg, xl` for small, medium, large, extra-large sizes from spacing tokens.
 *
 * Example: `mtMd` = margin-top: medium
 */
export const u = StyleSheet.create({
  // Flexbox
  flex: { flex: 1 },
  flexRow: { flexDirection: "row" },
  flexCol: { flexDirection: "column" },
  alignCenter: { alignItems: "center" },
  justifyCenter: { justifyContent: "center" },
  justifyBetween: { justifyContent: "space-between" },

  // Sizing
  wFull: { width: "100%" },
  hFull: { height: "100%" },

  // Spacing - Margins
  mSm: { margin: spacing.small },
  mMd: { margin: spacing.medium },
  mLg: { margin: spacing.large },
  mxSm: { marginHorizontal: spacing.small },
  mxMd: { marginHorizontal: spacing.medium },
  mySm: { marginVertical: spacing.small },
  myMd: { marginVertical: spacing.medium },
  mtSm: { marginTop: spacing.small },
  mtMd: { marginTop: spacing.medium },
  mbSm: { marginBottom: spacing.small },
  mbMd: { marginBottom: spacing.medium },

  // Spacing - Paddings
  pSm: { padding: spacing.small },
  pMd: { padding: spacing.medium },
  pxSm: { paddingHorizontal: spacing.small },
  pxMd: { paddingHorizontal: spacing.medium },
  pySm: { paddingVertical: spacing.small },
  pyMd: { paddingVertical: spacing.medium },

  // Text
  textCenter: { textAlign: "center" },
  textRight: { textAlign: "right" },
  textLeft: { textAlign: "left" },
})
