import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text } from 'react-native'
import AppLoading from 'expo-app-loading';
import { useFonts, Arvo_400Regular } from '@expo-google-fonts/arvo'

import { colors } from '../styles/global'

interface CluesProps {
    correctGuess: boolean
    guesses: number[]
    summary: string
}

const CluesContainer = (props: CluesProps) => {
    let [fontsLoaded] = useFonts({ Arvo_400Regular })
    const fadeAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
      Animated.timing(
        fadeAnim,
        {
          duration: 1000,
          toValue: 1,
          useNativeDriver: true
        }
      ).start();
    }, [fadeAnim])

    let splits = 5
    let summarySplit = props.summary.split(' ')
    let summarySubLength = Math.floor(summarySplit.length / splits)
    let clueLength = summarySubLength
    let clues: string[] = ["", "", "", "", ""]
    let wordTrack = 0
    for (let i = 0; i < splits; i++) {
        for (let j = 0; j < clueLength; j++) {
            if (wordTrack >= summarySplit.length) {
                clueLength = summarySubLength
                break
            }
            if (j > clueLength - 2 && (summarySplit[wordTrack].endsWith('.') || summarySplit[wordTrack].endsWith(','))) {
                clues[i] = clues[i] + summarySplit[wordTrack]
                wordTrack++
                clueLength += clueLength - j
                break
            }
            clues[i] = clues[i] + summarySplit[wordTrack] + " "
            wordTrack++
        }
    }

    while (wordTrack < summarySplit.length) {
        clues[splits - 1] = clues[splits - 1] + summarySplit[wordTrack] + " "
        wordTrack++
    }

    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return (
            <Animated.View style={[{...styles.container, opacity: fadeAnim}]}>
                <Text style={styles.textContainer}>
                    {clues.map((clue, i) => {
                        if ((i <= props.guesses.length) || (props.correctGuess)) {
                            return (
                                <Text key={i} style={styles.text}>{clue}</Text>
                            )
                        }
                    })}
                </Text>
            </Animated.View>
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
    }
})

export default CluesContainer
