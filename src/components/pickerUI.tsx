import React, { memo } from "react"
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  View,
  ListRenderItem,
  StyleProp,
  ViewStyle,
} from "react-native"
import Animated from "react-native-reanimated"
import { BasicMovie } from "../models/movie"
import { colors } from "../styles/global"
import { pickerStyles } from "../styles/pickerStyles"

type PickerState =
  | { status: "idle" }
  | { status: "searching"; query: string }
  | { status: "results"; query: string; results: readonly BasicMovie[] }

interface PickerUIProps {
  pickerState: PickerState
  animatedInputStyle: StyleProp<ViewStyle>
  isInteractionsDisabled: boolean
  handleInputChange: (text: string) => void
  renderItem: ListRenderItem<BasicMovie>
}

export const PickerUI: React.FC<PickerUIProps> = memo(
  ({
    pickerState,
    animatedInputStyle,
    isInteractionsDisabled,
    handleInputChange,
    renderItem,
  }) => {
    const getSearchText = () => {
      if (
        pickerState.status === "searching" ||
        pickerState.status === "results"
      ) {
        return pickerState.query
      }
      return ""
    }

    return (
      <View style={pickerStyles.container}>
        <Animated.View style={animatedInputStyle}>
          <View style={pickerStyles.inputContainer}>
            <TextInput
              accessible
              accessibilityRole="search"
              aria-label="Search for a movie to make a guess"
              maxLength={100}
              onChangeText={handleInputChange}
              placeholder="Search for a movie title..."
              placeholderTextColor={colors.tertiary}
              style={[
                pickerStyles.input,
                isInteractionsDisabled && {
                  backgroundColor: colors.grey,
                },
              ]}
              value={getSearchText()}
              editable={!isInteractionsDisabled}
            />
            {pickerState.status === "searching" && (
              <ActivityIndicator
                size="small"
                color={colors.primary}
                style={pickerStyles.activityIndicator}
              />
            )}
          </View>
        </Animated.View>

        <View style={pickerStyles.resultsContainer}>
          {pickerState.status === "searching" ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : pickerState.status === "results" ? (
            <FlatList
              data={pickerState.results}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              style={pickerStyles.resultsShow}
              keyboardShouldPersistTaps="handled"
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={11}
              ListEmptyComponent={
                <Text style={pickerStyles.noResultsText}>No movies found</Text>
              }
            />
          ) : null}
        </View>
      </View>
    )
  }
)
