import React, { memo } from "react"
import { View, Pressable, Text } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"
import { hintStyles } from "../styles/hintStyles"
import { responsive, colors } from "../styles/global"

type HintType = "decade" | "director" | "actor" | "genre"

interface HintButtonProps {
  hintType: HintType
  iconName: keyof typeof Icon.glyphMap
  label: string
  onPress: (type: HintType) => void
  disabled: boolean
  accessibilityHintCount: number
}

const HintButton: React.FC<HintButtonProps> = ({
  hintType,
  iconName,
  label,
  onPress,
  disabled,
  accessibilityHintCount,
}) => (
  <Pressable
    style={[hintStyles.hintButton, disabled && hintStyles.disabled]}
    onPress={() => onPress(hintType)}
    disabled={disabled}
    accessible
    accessibilityRole="button"
    accessibilityState={{ disabled }}
    accessibilityLabel={
      disabled
        ? `${label} hint unavailable`
        : `Get the movie's ${label.toLowerCase()} hint. ${accessibilityHintCount} hints available.`
    }
  >
    <Icon
      name={iconName}
      size={responsive.scale(20)}
      color={disabled ? colors.grey : colors.secondary}
    />
    <Text
      style={[hintStyles.buttonTextSmall, disabled && { color: colors.grey }]}
    >
      {label}
    </Text>
  </Pressable>
)

interface HintUIProps {
  showHintOptions: boolean
  displayedHintText: string | null
  hintLabelText: string
  isToggleDisabled: boolean
  areHintButtonsDisabled: boolean
  hintsAvailable: number

  handleToggleHintOptions: () => void
  handleHintSelection: (type: HintType) => void
}

const HintUI: React.FC<HintUIProps> = memo(
  ({
    showHintOptions,
    displayedHintText,
    hintLabelText,
    isToggleDisabled,
    areHintButtonsDisabled,
    hintsAvailable,
    handleToggleHintOptions,
    handleHintSelection,
  }) => {
    return (
      <View style={hintStyles.container}>
        {/* Main Toggle Button */}
        <Pressable
          onPress={handleToggleHintOptions}
          disabled={isToggleDisabled}
          accessible={true}
          accessibilityRole="button"
          accessibilityState={{ disabled: isToggleDisabled }}
          accessibilityLabel={hintLabelText}
          style={isToggleDisabled ? hintStyles.disabled : {}}
        >
          <Text
            style={[
              hintStyles.hintLabel,
              isToggleDisabled && { color: colors.grey },
            ]}
            accessibilityLabelledBy="hintLabel"
          >
            {hintLabelText}
          </Text>
        </Pressable>

        {/* Hint Selection Buttons (Conditional) */}
        {showHintOptions && (
          <View style={hintStyles.hintButtonsContainer}>
            <View style={hintStyles.hintButtonArea}>
              <HintButton
                hintType="decade"
                iconName="calendar"
                label="Decade"
                onPress={handleHintSelection}
                disabled={areHintButtonsDisabled}
                accessibilityHintCount={hintsAvailable}
              />
              <HintButton
                hintType="director"
                iconName="video-camera"
                label="Director"
                onPress={handleHintSelection}
                disabled={areHintButtonsDisabled}
                accessibilityHintCount={hintsAvailable}
              />
              <HintButton
                hintType="actor"
                iconName="user"
                label="Actor"
                onPress={handleHintSelection}
                disabled={areHintButtonsDisabled}
                accessibilityHintCount={hintsAvailable}
              />
              <HintButton
                hintType="genre"
                iconName="folder-open"
                label="Genre"
                onPress={handleHintSelection}
                disabled={areHintButtonsDisabled}
                accessibilityHintCount={hintsAvailable}
              />
            </View>
          </View>
        )}

        {/* Displayed Hint Text (Conditional) */}
        {displayedHintText && (
          <Text style={hintStyles.hintText}>{displayedHintText}</Text>
        )}
      </View>
    )
  }
)

export default HintUI
