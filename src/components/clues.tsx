import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface CluesProps {
    summary: string
}

const CluesContainer = (props: CluesProps) => {
    let splits = 5
    let summarySplit = props.summary.split(' ')
    let summarySubLength = Math.floor(summarySplit.length / splits)
    let clues: string[] = ["", "", "", "", ""]
    let wordTrack = 0
    for (let i = 0; i < splits; i++) {
        for (let j = 0; j <= summarySubLength; j++) {
            // TODO: handle being near the end of a sentence or comma
            if (j > summarySubLength - 2 && summarySplit[wordTrack].endsWith('.') ) {
                continue
            }
            if (wordTrack >= summarySplit.length) {
                break
            }
            clues[i] = clues[i] + summarySplit[wordTrack] + " "
            wordTrack++
        }
    }

    return (
        <View style={styles.container}>
            {clues.map((clue) => {
                return (
                    <Text>{clue}</Text>
                );
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
