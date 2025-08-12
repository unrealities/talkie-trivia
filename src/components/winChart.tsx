import React, { memo, useMemo } from "react"
import { View, Text } from "react-native"
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryLabel,
} from "./victory-charts"
import { responsive } from "../styles/global"
import { getWinChartStyles } from "../styles/winChartStyles"
import { useTheme } from "../contexts/themeContext"

export interface WinChartProps {
  wins: number[] // e.g., [10, 20, 30, 15, 5]
}

const WinChart = memo(({ wins }: WinChartProps) => {
  const { colors } = useTheme()
  const winChartStyles = useMemo(() => getWinChartStyles(colors), [colors])
  const totalWins = wins.reduce((a, b) => a + b, 0)

  const accessibilityLabel = useMemo(() => {
    if (totalWins === 0) {
      return "Win distribution chart is empty. No wins recorded yet."
    }

    const descriptions = wins
      .map((count, index) => {
        if (count > 0) {
          const guessText = index === 0 ? "guess" : "guesses"
          const winText = count === 1 ? "win" : "wins"
          return `${count} ${winText} with ${index + 1} ${guessText}`
        }
        return ""
      })
      .filter(Boolean)
      .join(". ")

    return `Bar chart showing win distribution. ${descriptions}.`
  }, [wins, totalWins])

  // Show a message if the user hasn't won any games yet
  if (totalWins === 0) {
    return (
      <View style={winChartStyles.emptyContainer}>
        <Text style={winChartStyles.emptyText}>
          Your win distribution will appear here after your first win!
        </Text>
      </View>
    )
  }

  const chartData = wins.map((winCount, index) => ({
    x: index + 1,
    y: winCount,
  }))

  return (
    <View
      style={winChartStyles.container}
      accessibilityLabel={accessibilityLabel}
    >
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
            tickLabels: {
              fill: "transparent",
            },
            grid: { stroke: "transparent" },
          }}
        />
        <VictoryBar
          data={chartData}
          barWidth={responsive.scale(20)}
          style={{
            data: {
              fill: colors.primary,
              borderRadius: responsive.scale(4),
            },
            labels: {
              fill: colors.textSecondary,
              fontFamily: "Arvo-Bold",
              fontSize: responsive.responsiveFontSize(12),
            },
          }}
          labelComponent={<VictoryLabel dy={-10} />}
          labels={({ datum }) => (datum.y > 0 ? datum.y : "")}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: "transparent" },
            tickLabels: {
              fill: "transparent",
            },
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
export default WinChart
