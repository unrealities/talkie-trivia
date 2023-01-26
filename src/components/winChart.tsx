import React, { useState } from 'react'
import {
    Text,
    View,
    Dimensions
} from 'react-native'
import { PieChart } from 'react-native-svg-charts'

export interface WinChartProps {
    wins: number[]
}

interface selectedSlice {
    label: string
    value: number
}

const WinChart = (props: WinChartProps) => {
    const [selectedSlice, setSelectedSlice] = useState<selectedSlice>({ label: '', value: 0 })
    const [labelWidth, setLabelWidth] = useState<number>(0)
    const [wins] = useState<number[]>(props.wins)

    const { label, value } = selectedSlice
    const keys = ['1', '2', '3', '4', '5']
    const values = [wins[0], wins[1], wins[2], wins[3], wins[4]]
    const colors = ['#600080', '#9900cc', '#c61aff', '#d966ff', '#ecb3ff']
    const data = keys.map((key, index) => {
        return {
            key,
            value: values[index],
            svg: { fill: colors[index] },
            arc: { outerRadius: (70 + values[index]) + '%', padAngle: label === key ? 0.1 : 0 },
            onPress: () => setSelectedSlice({label: key, value: values[index] })
        }
    })
    const deviceWidth = Dimensions.get('window').width

    return (
        <View style={{ justifyContent: 'center', flex: 1 }}>
            <PieChart
                style={{ height: 200 }}
                outerRadius={'80%'}
                innerRadius={'45%'}
                data={data}
            />
            <Text
                onLayout={({ nativeEvent: { layout: { width } } }) => {
                    setLabelWidth(width)
                }}
                style={{
                    position: 'absolute',
                    left: deviceWidth / 2 - labelWidth / 2,
                    textAlign: 'center'
                }}>
                {`${label} \n ${value}`}
            </Text>
        </View>
    )
}

export default WinChart
