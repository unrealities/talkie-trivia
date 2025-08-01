import { StyleSheet } from "react-native"
import { colors, responsive, spacing } from "./global"

export const gameHistoryStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    marginTop: spacing.large,
  },
  title: {
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(20),
    color: colors.primary,
    marginBottom: spacing.medium,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: spacing.large,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.grey,
    borderRadius: responsive.scale(8),
    marginBottom: spacing.small,
    padding: spacing.small,
    overflow: "hidden",
  },
  posterImage: {
    width: responsive.scale(60),
    height: responsive.scale(90),
    borderRadius: responsive.scale(4),
  },
  infoContainer: {
    flex: 1,
    marginLeft: spacing.medium,
  },
  movieTitle: {
    fontFamily: "Arvo-Bold",
    fontSize: responsive.responsiveFontSize(16),
    color: colors.secondary,
    marginBottom: spacing.extraSmall,
  },
  dateText: {
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(12),
    color: colors.textSecondary,
    marginBottom: spacing.small,
  },
  resultText: {
    fontFamily: "Arvo-Regular",
    fontSize: responsive.responsiveFontSize(14),
  },
  winText: {
    color: colors.quinary,
  },
  lossText: {
    color: colors.quaternary,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.large,
  },
  emptyText: {
    fontFamily: "Arvo-Italic",
    fontSize: responsive.responsiveFontSize(16),
    color: colors.textSecondary,
    textAlign: "center",
  },
})
