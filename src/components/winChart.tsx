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

const WinChart = (props: WinChartProps) => {
  const keys = ["1", "2", "3", "4", "5"]
  // const values = [props.wins[0], props.wins[1], props.wins[2], props.wins[3], props.wins[4]]
  const values = [1, 3, 4, 3, 7]
  const data = keys.map((key, index) => {
    return {
      key: key,
      x: key,
      y: values[index],
    }
  })

  return (
    <View style={winChartStyles.container}>
      <VictoryPie
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
