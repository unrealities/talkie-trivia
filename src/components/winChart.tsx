import React, { memo, useMemo } from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { VictoryBar, VictoryChart, VictoryAxis } from "victory-native"
import { Typography } from "./ui/typography"
import { useStyles, Theme, useThemeTokens } from "../utils/hooks/useStyles"

export interface WinChartProps {
  wins: number[]
}

const WinChart = memo(({ wins }: WinChartProps) => {
  const styles = useStyles(themedStyles)
  const theme = useThemeTokens()
  const { colors, responsive } = theme
  const totalWins = wins.reduce((a, b) => a + b, 0)

  const accessibilityLabel = useMemo(() => {
    if (totalWins === 0) {
      return "Win distribution chart is empty. No wins recorded yet."
    }
    const descriptions = wins
      .map((count, index) =>
        count > 0
          ? `${count} ${count === 1 ? "win" : "wins"} with ${index + 1} ${
              index === 0 ? "guess" : "guesses"
            }`
          : ""
      )
      .filter(Boolean)
      .join(". ")
    return `Bar chart showing win distribution. ${descriptions}.`
  }, [wins, totalWins])

  if (totalWins === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Typography style={styles.emptyText}>
          Your win distribution will appear here after your first win!
        </Typography>
      </View>
    )
  }

  const chartData = wins.map((winCount, index) => ({
    x: index + 1,
    y: winCount,
  }))

  if (!VictoryBar || !VictoryChart || !VictoryAxis) {
    console.warn("Victory Native components failed to load. Skipping chart.")
    return null
  }

  return (
    <View style={styles.container} accessibilityLabel={accessibilityLabel}>
      <VictoryChart
        domainPadding={{ x: responsive.scale(25) }}
        height={responsive.scale(220)}
        padding={{
          top: responsive.scale(30),
          bottom: responsive.scale(30),
          left: responsive.scale(50),
          right: responsive.scale(30),
        }}
      >
        <VictoryAxis
          style={{
            axis: { stroke: "transparent" },
            tickLabels: { fill: "transparent" },
            grid: { stroke: "transparent" },
          }}
        />
        <VictoryBar
          data={chartData}
          barWidth={responsive.scale(20)}
          style={{
            data: { fill: colors.primary, borderRadius: responsive.scale(4) },
            labels: {
              fill: colors.textSecondary,
              fontFamily: "Arvo-Bold",
              fontSize: responsive.responsiveFontSize(12),
            },
          }}
          labels={({ datum }: { datum: any }) =>
            datum.y > 0 ? datum.y.toString() : ""
          }
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: "transparent" },
            tickLabels: { fill: "transparent" },
            grid: { stroke: colors.border, strokeDasharray: "4, 8" },
          }}
        />
        <VictoryAxis
          style={{
            axis: { stroke: colors.border },
            tickLabels: {
              fill: colors.textSecondary,
              fontFamily: "Arvo-Regular",
              fontSize: responsive.responsiveFontSize(10),
            },
            grid: { stroke: "transparent" },
          }}
        />
      </VictoryChart>
    </View>
  )
})

interface WinChartStyles {
  container: ViewStyle
  emptyContainer: ViewStyle
  emptyText: TextStyle
}

const themedStyles = (theme: Theme): WinChartStyles => ({
  container: {
    alignItems: "center",
    alignSelf: "center",
    flex: 1,
    flexDirection: "column",
    padding: theme.responsive.scale(15),
    width: "100%",
    backgroundColor: theme.colors.background,
  },
  emptyContainer: {
    padding: theme.spacing.large,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontFamily: "Arvo-Italic",
    textAlign: "center",
    color: theme.colors.textSecondary,
  },
})

export default WinChart
