import React, { useEffect, useLayoutEffect } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import AppLoading from 'expo-app-loading';
import { useFonts, Arvo_400Regular, Arvo_700Bold } from '@expo-google-fonts/arvo'

import { colors } from '../styles/global'

interface CluesProps {
    correctGuess: boolean
    guesses: number[]
    summary: string
}

const CluesContainer = (props: CluesProps) => {
    let [fontsLoaded] = useFonts({ Arvo_400Regular, Arvo_700Bold })
    let fadeAnim = new Animated.Value(0)
    let fadeAnimTiming = Animated.timing(
        fadeAnim,
        {
            duration: 1500,
            toValue: 1,
            useNativeDriver: true
        }
    )

    let animateClue = () => {
        fadeAnimTiming.reset()
        fadeAnimTiming.start()
    }
    useEffect(animateClue, [props.guesses])
    useEffect(animateClue, [fontsLoaded])

    let splits = 5
    let summarySplit = props.summary.split(' ')
    let summarySubLength = Math.floor(summarySplit.length / splits)
    let clueLength = summarySubLength
    let clues: string[] = ["", "", "", "", ""]
    let wordTrack = 0
    let wordCount = [0, 0, 0, 0, 0]
    for (let i = 0; i < splits; i++) {
        for (let j = 0; j < clueLength; j++) {
            if (wordTrack >= summarySplit.length) {
                clueLength = summarySubLength
                break
            }
            if (j > clueLength - 2 && (summarySplit[wordTrack].endsWith('.') || summarySplit[wordTrack].endsWith(','))) {
                clues[i] = clues[i] + summarySplit[wordTrack] + " "
                wordTrack++
                clueLength += clueLength - j
                break
            }
            clues[i] = clues[i] + summarySplit[wordTrack] + " "
            wordTrack++
        }
        wordCount[i] = wordTrack
    }

    while (wordTrack < summarySplit.length) {
        clues[splits - 1] = clues[splits - 1] + summarySplit[wordTrack] + " "
        wordTrack++
    }

    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return (
            <View style={styles.container}>
                <Text style={styles.textContainer}>
                    {clues.map((clue, i) => {
                        if ((i <= props.guesses.length) || (props.correctGuess)) {
                            return (
                                <Animated.Text
                                    key={i}
                                    style={
                                        {
                                            ...styles.text,
                                            fontFamily: props.guesses.length == i ? 'Arvo_700Bold' : 'Arvo_400Regular',
                                            fontWeight: props.guesses.length == i ? '700' : '400',
                                            opacity: props.guesses.length == i ? fadeAnim : 1
                                        }}>
                                    {clue}
                                </Animated.Text>
                            )
                        }
                    })}
                </Text>
                <Text style={styles.wordCountText}>{wordCount[props.guesses.length]}/{wordCount[4]}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        minHeight: 200,
        paddingBottom: 20,
        paddingTop: 20
    },
    text: {
        color: colors.secondary,
        fontFamily: 'Arvo_400Regular',
        fontSize: 16
    },
    textContainer: {
        flex: 1,
        flexWrap: 'wrap',
        maxWidth: 300
    },
    wordCountText: {
        color: colors.primary,
        flex: 1,
        fontSize: 10,
        textAlign: 'right'
    }
})

export default CluesContainer
