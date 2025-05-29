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
import { BasicMovie } from "../models/movie"
import { colors } from "../styles/global"
import { pickerStyles } from "../styles/pickerStyles"

interface PickerUIProps {
  searchText: string
  isSearching: boolean
  isLoading: boolean
  error: string | null
  foundMovies: readonly BasicMovie[]
  selectedMovieTitle: string
  isInteractionsDisabled: boolean
  DEFAULT_BUTTON_TEXT: string
  isMovieSelectedForGuess: boolean
  animatedButtonStyle: any

  handleInputChange: (text: string) => void
  renderItem: ListRenderItem<BasicMovie>
  onPressCheck: () => void
  handleFocus: () => void
  handleBlur: () => void
}

export const PickerUI: React.FC<PickerUIProps> = memo(
  ({
    searchText,
    isSearching,
    isLoading,
    error,
    foundMovies,
    selectedMovieTitle,
    isInteractionsDisabled,
    DEFAULT_BUTTON_TEXT,
    isMovieSelectedForGuess,
    animatedButtonStyle,
    handleInputChange,
    renderItem,
    onPressCheck,
    handleFocus,
    handleBlur,
  }) => {
    return (
      <View style={pickerStyles.container}>
        <View style={pickerStyles.inputContainer}>
          <TextInput
            accessible
            accessibilityRole="search"
            aria-label="Search for a movie"
            maxLength={100}
            onBlur={handleBlur}
            onChangeText={handleInputChange}
            onFocus={handleFocus}
            placeholder="Search for a movie title"
            placeholderTextColor={colors.tertiary}
            style={pickerStyles.input}
            value={searchText}
            readOnly={isInteractionsDisabled}
          />
          {isSearching && (
            <ActivityIndicator
              size="small"
              color={colors.primary}
              style={pickerStyles.activityIndicator}
            />
          )}
        </View>

        {/* Search Results Area */}
        <View style={pickerStyles.resultsContainer}>
          {/* Search Results List */}
          {!isLoading &&
            !error &&
            !isMovieSelectedForGuess &&
            foundMovies.length > 0 && (
              <FlatList
                data={foundMovies}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                style={pickerStyles.resultsShow}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={null}
              />
            )}
          {/* Loading Indicator */}
          {isLoading && !isMovieSelectedForGuess && (
            <ActivityIndicator size="large" color={colors.primary} />
          )}
          {/* Error Message */}
          {!isLoading && error && !isMovieSelectedForGuess && (
            <Text accessibilityRole="text" style={pickerStyles.errorText}>
              {error}
            </Text>
          )}
        </View>

        {/* Submit Button */}
        <Animated.View style={[pickerStyles.button, animatedButtonStyle]}>
          <Pressable
            accessible
            aria-label={
              isInteractionsDisabled || isMovieSelectedForGuess
                ? "Submit button disabled"
                : "Submit button enabled"
            }
            role="button"
            disabled={
              isInteractionsDisabled ||
              selectedMovieTitle === DEFAULT_BUTTON_TEXT
            }
            onPress={onPressCheck}
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={[
                pickerStyles.buttonText,
                selectedMovieTitle.length > 35 && pickerStyles.buttonTextSmall,
              ]}
            >
              {isMovieSelectedForGuess
                ? selectedMovieTitle
                : DEFAULT_BUTTON_TEXT}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    )
  }
)
