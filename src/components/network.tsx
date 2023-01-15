import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { colors } from '../styles/global'

interface NetworkContainerProps {
    isConnected: boolean
}

const NetworkContainer = (props: NetworkContainerProps) => {
    const [isConnected, setIsConnected] = useState<boolean>(props.isConnected)
    const [text, setText] = useState<string>('not connected')

    useEffect(() => {
        setIsConnected(props.isConnected)
        let connectionStatus = isConnected ? 'connected' : 'not connected'
        setText(connectionStatus)
    })

    return (
        <View style={isConnected ? styles.containerConnected : styles.containerNotConnected}>
            <Text style={isConnected ? styles.connected : styles.notConnected}>Network is {text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    containerConnected: {
        borderBottomColor: colors.primary,
        borderBottomWidth: 2,
        borderTopColor: colors.primary,
        borderTopWidth: 2,
        borderStyle: 'solid',
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 4,
        paddingTop: 4,
        marginTop: 20,
        maxHeight: 75,
        minHeight: 20,
        minWidth: 300
    },
    containerNotConnected: {
        borderBottomColor: colors.quaternary,
        borderBottomWidth: 2,
        borderTopColor: colors.quaternary,
        borderTopWidth: 2,
        borderStyle: 'solid',
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 4,
        paddingTop: 4,
        marginTop: 20,
        maxHeight: 75,
        minHeight: 20,
        minWidth: 300
    },
    connected: {
        color: colors.primary,
        flex: 1,
        fontFamily: 'Arvo-Bold',
        fontSize: 24,
        marginTop: 6,
        textAlign: 'center'
    },
    notConnected: {
        color: colors.quaternary,
        flex: 1,
        fontFamily: 'Arvo-Bold',
        fontSize: 24,
        marginTop: 6,
        textAlign: 'center'
    },
})

export default NetworkContainer
