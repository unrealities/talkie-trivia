import React, { memo } from "react"
import {
  ActivityIndicator,
  Pressable,
  FlatList,
  Text,
  TextInput,
  View,
  ListRenderItem,
  StyleProp,
  ViewStyle,
} from "react-native"
import Animated from "react-native-reanimated"
import { FontAwesome } from "@expo/vector-icons"
import { BasicMovie } from "../models/movie"
import { colors } from "../styles/global"
import { pickerStyles } from "../styles/pickerStyles"

type PickerState =
  | { status: "idle" }
  | { status: "searching"; query: string }
  | { status: "results"; query: string; results: readonly BasicMovie[] }
  | { status: "selected"; movie: BasicMovie }

interface PickerUIProps {
  pickerState: PickerState
  animatedInputStyle: StyleProp<ViewStyle>
  isInteractionsDisabled: boolean
  handleInputChange: (text: string) => void
  renderItem: ListRenderItem<BasicMovie>
  onPressCheck: () => void
  onClearSelectedMovie: () => void
}

export const PickerUI: React.FC<PickerUIProps> = memo(
  ({
    pickerState,
    animatedInputStyle,
    isInteractionsDisabled,
    handleInputChange,
    renderItem,
    onPressCheck,
    onClearSelectedMovie,
  }) => {
    const isMovieSelectedForGuess = pickerState.status === "selected"
    const selectedMovie = isMovieSelectedForGuess ? pickerState.movie : null

    const releaseYear = selectedMovie?.release_date
      ? ` (${selectedMovie.release_date.toString().substring(0, 4)})`
      : ""
    const selectedMovieTitleWithYear = selectedMovie
      ? `${selectedMovie.title}${releaseYear}`
      : ""

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
        {isMovieSelectedForGuess && (
          <View style={pickerStyles.selectionContainer}>
            <Text style={pickerStyles.selectionText} numberOfLines={2}>
              {selectedMovieTitleWithYear}
            </Text>
            {!isInteractionsDisabled && (
              <Pressable
                onPress={onClearSelectedMovie}
                style={pickerStyles.clearSelectionButton}
                hitSlop={10}
              >
                <FontAwesome
                  name="times-circle"
                  size={24}
                  color={colors.lightGrey}
                />
              </Pressable>
            )}
          </View>
        )}

        <Animated.View style={animatedInputStyle}>
          <View style={pickerStyles.inputContainer}>
            <TextInput
              accessible
              accessibilityRole="search"
              aria-label="Search for a movie"
              maxLength={100}
              onChangeText={handleInputChange}
              placeholder={
                isMovieSelectedForGuess
                  ? "Selection made. Press Submit."
                  : "Search for a movie title"
              }
              placeholderTextColor={colors.tertiary}
              style={[
                pickerStyles.input,
                (isInteractionsDisabled || isMovieSelectedForGuess) && {
                  backgroundColor: colors.grey,
                },
              ]}
              value={getSearchText()}
              editable={!isInteractionsDisabled && !isMovieSelectedForGuess}
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

        {!isMovieSelectedForGuess && (
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
                  <Text style={pickerStyles.noResultsText}>
                    No movies found
                  </Text>
                }
              />
            ) : null}
          </View>
        )}

        <Pressable
          accessible
          aria-label="Submit Guess"
          role="button"
          disabled={!isMovieSelectedForGuess || isInteractionsDisabled}
          onPress={onPressCheck}
          style={({ pressed }) => [
            pickerStyles.button,
            (!isMovieSelectedForGuess || isInteractionsDisabled) &&
              pickerStyles.disabledButton,
            pressed && { opacity: 0.8 },
          ]}
        >
          <Text style={pickerStyles.buttonText}>Submit Guess</Text>
        </Pressable>
      </View>
    )
  }
)
