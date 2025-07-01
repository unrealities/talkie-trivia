import React from "react"
import { View } from "react-native"
import { pickerStyles } from "../styles/pickerStyles"
import { colors } from "../styles/global"

const PickerSkeleton = () => {
  return (
    <View style={pickerStyles.container}>
      <View style={pickerStyles.inputContainer}>
        <View
          style={[
            pickerStyles.input,
            { backgroundColor: colors.grey, borderColor: colors.grey },
          ]}
        />
      </View>
      <View style={pickerStyles.resultsContainer} />
      <View style={[pickerStyles.button, pickerStyles.disabledButton]} />
    </View>
  )
}

export default PickerSkeleton
