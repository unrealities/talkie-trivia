import React, { memo } from "react"
import { View, Text } from "react-native"
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryLabel,
} from "victory-native"
import { colors, responsive } from "../styles/global"
import { winChartStyles } from "../styles/winChartStyles"

export interface WinChartProps {
  wins: number[] // e.g., [10, 20, 30, 15, 5]
}

const WinChart = memo(({ wins }: WinChartProps) => {
  const totalWins = wins.reduce((a, b) => a + b, 0)

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
      accessibilityLabel="Bar chart showing win distribution by number of guesses."
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
              fill: colors.secondary,
              fontFamily: "Arvo-Bold",
              fontSize: responsive.responsiveFontSize(12),
            },
          }}
          labelComponent={<VictoryLabel dy={-10} />}
          labels={({ datum }) => (datum.y > 0 ? datum.y : "")}
          labels={({ datum }) => `${datum.x}`}
          labelComponent={
            <VictoryLabel
              dy={15}
              style={{
                fill: colors.lightGrey,
                fontFamily: "Arvo-Regular",
                fontSize: responsive.responsiveFontSize(10),
              }}
            />
          }
        />
      </VictoryChart>
    </View>
  )
})
export default WinChart
