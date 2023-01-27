import React, { useState } from 'react'
import { Text, View, Dimensions } from 'react-native'
import { VictoryPie } from "victory"

export interface WinChartProps {
    wins: number[]
}

interface selectedSlice {
    label: string
    value: number
}

const WinChart = (props: WinChartProps) => {
    const [wins] = useState<number[]>(props.wins)

    const keys = ['1', '2', '3', '4', '5']
    // const values = [wins[0], wins[1], wins[2], wins[3], wins[4]]
    const values = [3, 5, 1, 9, 2]
    const data = keys.map((key, index) => {
        return {
            key: key,
            x: key,
            y: values[index]
        }
    })
    const deviceWidth = Dimensions.get('window').width

    return (
        <View style={{ justifyContent: 'center', flex: 1 }}>
            <VictoryPie
                colorScale={['#600080', '#9900cc', '#c61aff', '#d966ff', '#ecb3ff']}
                data={data} />
        </View>
    )
}

export default WinChart
