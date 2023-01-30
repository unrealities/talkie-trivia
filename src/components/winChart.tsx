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
    const deviceWidth = Dimensions.get('window').width

    return (
        <View style={styles.container}>
            <VictoryPie
                colorScale={[colors.primary, colors.secondary, colors.tertiary, colors.quaternary, colors.quinary]}
                data={data}
                style={{data: {width: 300}}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 8
    }
})

export default WinChart
