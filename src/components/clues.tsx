import React, { useEffect, useState } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'

import { colors } from '../styles/global'

interface CluesProps {
    correctGuess: boolean
    guesses: number[]
    summary: string
}

interface CountContainerProps {
    currentWordLength: number
    guessNumber: number
    totalWordLength: number
}

const   CluesContainer = (props: CluesProps) => {
    let [fadeAnim] = useState<Animated.Value>(new Animated.Value(0))

    let fadeAnimTiming = Animated.timing(
        fadeAnim,
        {
            duration: 1000,
            toValue: 1,
            useNativeDriver: false
        }
    )
    useEffect(() => { fadeAnimTiming.start(() => { fadeAnimTiming.reset() }) }, [props.guesses])

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
                                        fontFamily: props.guesses.length == i ? 'Arvo-Bold' : 'Arvo-Regular',
                                        fontWeight: props.guesses.length == i ? '700' : '400',
                                        opacity: props.guesses.length == i ? fadeAnim : 1
                                    }}>
                                {clue}
                            </Animated.Text>
                        )
                    }
                })}
            </Text>
            <CountContainer
                currentWordLength={wordCount[props.guesses.length]}
                guessNumber={props.guesses.length}
                totalWordLength={summarySplit.length}
            />
        </View>
    )
}

const CountContainer = (props: CountContainerProps) => {
    return (
        <View style={styles.countContainer}>
            <Text style={styles.wordCountText}>
                {props.guessNumber < 4 ? props.currentWordLength : props.totalWordLength}/{props.totalWordLength}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        minWidth: 300,
        minHeight: 200,
        paddingBottom: 20,
        paddingTop: 20
    },
    countContainer: {
        flex: 1,
        textAlign: 'right',
        justifyContent: 'flex-end'
    },
    text: {
        color: colors.secondary,
        fontFamily: 'Arvo-Regular',
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
        fontFamily: 'Arvo-Regular',
        fontSize: 10,
        textAlign: 'right'
    }
})

export default CluesContainer
