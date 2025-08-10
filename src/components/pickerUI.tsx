import React, { memo, useMemo } from "react"
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  View,
  ListRenderItem,
  StyleProp,
  ViewStyle,
  Pressable,
} from "react-native"
import Animated from "react-native-reanimated"
import Ionicons from "@expo/vector-icons/Ionicons"
import { BasicMovie } from "../models/movie"
import { getPickerStyles } from "../styles/pickerStyles"
import { responsive } from "../styles/global"
import { useTheme } from "../contexts/themeContext"

type PickerState =
  | { status: "idle" }
  | { status: "searching"; query: string }
  | { status: "results"; query: string; results: readonly BasicMovie[] }

interface PickerUIProps {
  pickerState: PickerState
  animatedInputStyle: StyleProp<ViewStyle>
  isInteractionsDisabled: boolean
  stagedGuess: BasicMovie | null
  handleInputChange: (text: string) => void
  onConfirmGuess: () => void
  onClearStagedGuess: () => void
  renderItem: ListRenderItem<BasicMovie>
}

export const PickerUI: React.FC<PickerUIProps> = memo(
  ({
    pickerState,
    animatedInputStyle,
    isInteractionsDisabled,
    stagedGuess,
    handleInputChange,
    onConfirmGuess,
    onClearStagedGuess,
    renderItem,
  }) => {
    const { colors } = useTheme()
    const pickerStyles = useMemo(() => getPickerStyles(colors), [colors])

    const getSearchText = () => {
      if (
        pickerState.status === "searching" ||
        pickerState.status === "results"
      ) {
        return pickerState.query
      }
      return ""
    }

    const showResults =
      (pickerState.status === "results" ||
        pickerState.status === "searching") &&
      !stagedGuess

    const inputValue = stagedGuess
      ? `${stagedGuess.title} (${new Date(
          stagedGuess.release_date
        ).getFullYear()})`
      : getSearchText()

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
              placeholderTextColor={colors.textSecondary}
              style={[
                pickerStyles.input,
                (isInteractionsDisabled || !!stagedGuess) && {
                  backgroundColor: colors.border,
                },
              ]}
              value={inputValue}
              editable={!isInteractionsDisabled && !stagedGuess}
            />
            {stagedGuess && (
              <Pressable
                onPress={onClearStagedGuess}
                style={pickerStyles.clearButton}
                accessibilityLabel="Clear selected movie"
              >
                <Ionicons
                  name="close-circle"
                  size={responsive.scale(22)}
                  color={colors.textSecondary}
                />
              </Pressable>
            )}
          </View>
        </Animated.View>

        {stagedGuess && (
          <Pressable
            onPress={onConfirmGuess}
            disabled={isInteractionsDisabled}
            style={({ pressed }) => [
              pickerStyles.submitButton,
              isInteractionsDisabled && pickerStyles.disabledButton,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={pickerStyles.submitButtonText}>Submit Guess</Text>
          </Pressable>
        )}

        {/* The results container will now render as an overlay due to the styles */}
        {showResults && (
          <View style={pickerStyles.resultsContainer}>
            {pickerState.status === "searching" ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : pickerState.status === "results" ? (
              <>
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
                      No movies found for "{pickerState.query}"
                    </Text>
                  }
                />
                {pickerState.status === "results" &&
                  pickerState.results.length > 0 && (
                    <View style={pickerStyles.previewHintContainer}>
                      <Text style={pickerStyles.previewHintText}>
                        💡 Hold any result to preview
                      </Text>
                    </View>
                  )}
              </>
            ) : null}
          </View>
        )}
      </View>
    )
  }
)
