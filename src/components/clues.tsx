import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface CluesProps {
    guessNumber: number
    summary: string
}

const CluesContainer = (props: CluesProps) => {
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

    return (
        <View style={styles.container}>
            {clues.map((clue, i) => {
                if (i <= props.guessNumber) {
                    return (
                        <Text key={i}>{clue}</Text>
                    )
                }
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        justifyContent: 'center'
    },
});

export default CluesContainer
