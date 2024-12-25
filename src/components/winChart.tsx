import React from "react"
import { View } from "react-native"

import Victory from "../utils/victory/victory"
import { colors } from "../styles/global"
import { winChartStyles } from "../styles/winChartStyles"

const VictoryPie = Victory.VictoryPie
const VictoryTheme = Victory.VictoryTheme

export interface WinChartProps {
  wins: number[]
}

const WinChart = ({ wins }: WinChartProps) => {
  const keys = ["1", "2", "3", "4", "5"]
  const data = keys.map((key, index) => ({
    key: key,
    x: key,
    y: wins[index] || 0, // Ensure y is 0 for undefined values
    label:
      wins[index] > 0
        ? `${(wins[index] / wins.reduce((a, b) => a + b, 0)) * 100}%`
        : "",
  }))

  return (
    <View style={winChartStyles.container}>
      <VictoryPie
        testID="victory-pie-chart"
        colorScale={[
          colors.primary,
          colors.secondary,
          colors.tertiary,
          colors.quaternary,
          colors.quinary,
        ]}
        data={data}
        innerRadius={({ datum }) => datum.y * 25}
        style={{
          labels: winChartStyles.victoryLabels,
          data: { fill: colors.white },
        }}
        theme={VictoryTheme.material}
      />
    </View>
  )
}

export default WinChart
