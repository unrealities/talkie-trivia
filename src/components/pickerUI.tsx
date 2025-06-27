import React, { memo } from "react"
import {
  ActivityIndicator,
  Pressable,
  FlatList,
  Text,
  TextInput,
  View,
  ListRenderItem,
} from "react-native"
import Animated from "react-native-reanimated"
import { FontAwesome } from "@expo/vector-icons"
import { BasicMovie } from "../models/movie"
import { colors } from "../styles/global"
import { pickerStyles } from "../styles/pickerStyles"

interface PickerUIProps {
  searchText: string
  isSearching: boolean
  isLoading: boolean
  error: string | null
  foundMovies: readonly BasicMovie[]
  selectedMovie: BasicMovie | null
  animatedInputStyle: any
  isInteractionsDisabled: boolean

  handleInputChange: (text: string) => void
  renderItem: ListRenderItem<BasicMovie>
  onPressCheck: () => void
  handleFocus: () => void
  handleBlur: () => void
  onClearSelectedMovie: () => void
}

export const PickerUI: React.FC<PickerUIProps> = memo(
  ({
    searchText,
    isSearching,
    isLoading,
    error,
    foundMovies,
    selectedMovie,
    animatedInputStyle,
    isInteractionsDisabled,
    handleInputChange,
    renderItem,
    onPressCheck,
    handleFocus,
    handleBlur,
    onClearSelectedMovie,
  }) => {
    const isMovieSelectedForGuess = selectedMovie !== null
    const releaseYear = selectedMovie?.release_date
      ? ` (${selectedMovie.release_date.toString().substring(0, 4)})`
      : ""
    const selectedMovieTitleWithYear = selectedMovie
      ? `${selectedMovie.title}${releaseYear}`
      : ""

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
              onBlur={handleBlur}
              onChangeText={handleInputChange}
              onFocus={handleFocus}
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
              value={searchText}
              editable={!isInteractionsDisabled && !isMovieSelectedForGuess}
            />
            {isSearching && (
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
            {isLoading ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : error ? (
              <Text accessibilityRole="text" style={pickerStyles.errorText}>
                {error}
              </Text>
            ) : foundMovies.length > 0 ? (
              <FlatList
                data={foundMovies}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                style={pickerStyles.resultsShow}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={null}
              />
            ) : searchText.length > 0 ? (
              <Text style={pickerStyles.noResultsText}>No movies found</Text>
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
