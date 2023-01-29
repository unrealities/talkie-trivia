import React from 'react'
import { View, Dimensions } from 'react-native'
import { VictoryPie } from 'victory'
import { colors } from '../styles/global'

export interface WinChartProps {
    wins: number[]
}

interface selectedSlice {
    label: string
    value: number
}

const WinChart = (props: WinChartProps) => {
    console.log(props.wins)

    const keys = ['1', '2', '3', '4', '5']
    const values = [props.wins[0], props.wins[1], props.wins[2], props.wins[3], props.wins[4]]
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
                colorScale={[colors.primary, colors.secondary, colors.tertiary, colors.quaternary, colors.quinary]}
                data={data} />
        </View>
    )
}

export default WinChart
