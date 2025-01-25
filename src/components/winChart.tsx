import React, { memo } from "react"
import { View, Dimensions } from "react-native"
import { PieChart } from "react-native-chart-kit"
import { colors } from "../styles/global"
import { winChartStyles } from "../styles/winChartStyles"

const screenWidth = Dimensions.get("window").width

export interface WinChartProps {
  wins: number[]
}

const WinChart = memo(
  ({ wins }: WinChartProps) => {
    const keys = ["1", "2", "3", "4", "5"]
    const data = keys.map((key, index) => ({
      name: key,
      x: key,
      y: wins[index] || 0, // Ensure y is 0 for undefined values
      label:
        wins[index] > 0
          ? `${(wins[index] / wins.reduce((a, b) => a + b, 0)) * 100}%`
          : "",
      color: [
        colors.primary,
        colors.secondary,
        colors.tertiary,
        colors.quaternary,
        colors.quinary,
      ][index],
      legendFontColor: colors.secondary,
      legendFontSize: 15,
    }))

    const chartConfig = {
      backgroundGradientFrom: colors.background,
      backgroundGradientTo: colors.background,
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    }

    return (
      <View style={winChartStyles.container}>
        <PieChart
          testID="victory-pie-chart"
          data={data}
          width={screenWidth * 0.6} // Use 60% of the screen width
          height={220}
          chartConfig={chartConfig}
          accessor="y"
          backgroundColor="transparent"
          paddingLeft="0"
          center={[0, 0]}
          absolute
        />
      </View>
    )
  },
  (prevProps, nextProps) => prevProps.wins === nextProps.wins
)
export default WinChart
