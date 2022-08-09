import React, { useState } from 'react'
import { Button, View } from 'react-native'
import { Picker } from '@react-native-picker/picker'

import { BasicMovie } from './movie'

interface PickerContainerProps {
    guesses: number[]
    movieID: number
    movies : BasicMovie[]
    updateGuesses: Dispatch<SetStateAction<number[]>>
  }

const PickerContainer = (props: PickerContainerProps) => {
    const [selectedMovieID, setSelectedMovieID] = useState<number>(0)

    return (
        <View>
            <Picker
                selectedValue={selectedMovieID}
                onValueChange={(itemValue, itemIndex) => {
                    setSelectedMovieID(itemValue)
                }}>
                <Picker.Item key="0" label="" value={0} />
                {props.movies.map((movie) => (
                    <Picker.Item key={movie.id} label={movie.title} value={movie.id} />
                ))}
            </Picker>
            <Button
                onPress={() => { if (selectedMovieID > 0) { props.updateGuesses([...props.guesses, selectedMovieID]) } }}
                title="Submit"
                color="red"
                accessibilityLabel="Submit your guess"
            />
        </View>
    )
}

export default PickerContainer
