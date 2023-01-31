import React from 'react'
import { View, Dimensions, StyleSheet } from 'react-native'
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
    // const values = [props.wins[0], props.wins[1], props.wins[2], props.wins[3], props.wins[4]]
    const values = [1,3,4,3,7]
    const data = keys.map((key, index) => {
        return {
            key: key,
            x: key,
            y: values[index]
        }
    })

    return (
        <VictoryPie
                colorScale={[colors.primary, colors.secondary, colors.tertiary, colors.quaternary, colors.quinary]}
                data={data}/>
    )
}

export default WinChart
