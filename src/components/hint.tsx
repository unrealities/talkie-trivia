import React, { useState, memo, useCallback, useEffect } from "react";
import { View, Pressable, Text } from "react-native";
import { PlayerGame } from "../models/game";
import { hintStyles } from "../styles/hintStyles";

interface HintProps {
    playerGame: PlayerGame;
    updatePlayerGame: (updatedPlayerGame: PlayerGame) => void;
    isInteractionsDisabled: boolean;
}

const HintContainer = memo(
    ({ playerGame, updatePlayerGame, isInteractionsDisabled }: HintProps) => {
        const [hintUsed, setHintUsed] = useState<boolean>(false);
        const [hintType, setHintType] = useState<
            "decade" | "director" | "actor" | "genre" | null
        >(null);

      useEffect(() => {
            // Reset hint after every guess
            setHintUsed(false)
            setHintType(null)
        }, [playerGame.guesses.length]);

       const handleHintSelection = useCallback(
            (hint: "decade" | "director" | "actor" | "genre") => {
                if (isInteractionsDisabled || hintUsed) {
                    return;
                }

                setHintType(hint);
                setHintUsed(true);
                updatePlayerGame({
                    ...playerGame,
                    hintsUsed: { ...playerGame.hintsUsed, [playerGame.guesses.length]: hint },
                });
            },
            [isInteractionsDisabled, hintUsed, playerGame, updatePlayerGame]
        );
        const resetHint = useCallback(() => {
            setHintUsed(false);
            setHintType(null);
        }, []);

        const hintText = () => {
            if (hintType) {
                switch (hintType) {
                    case "decade":
                        return `📅 ${playerGame.game.movie.release_date.substring(0, 3)}0s`;
                    case "director":
                        return `🎬 ${playerGame.game.movie.director.name}`;
                    case "actor":
                        return `🎭 ${playerGame.game.movie.actors[0].name}`;
                    case "genre":
                        return `🗂️ ${playerGame.game.movie.genres[0].name}`;
                    default:
                         return null
                }
            }
            return null;
        };

        const renderHintButtons = () => {
           if(hintUsed) {
                return null
            }
            return (
                 <View style={hintStyles.hintButtons}>
                      <Pressable
                            style={({ pressed }) => [
                                hintStyles.hintButton,
                                isInteractionsDisabled && hintStyles.disabled,
                                 { opacity: pressed || isInteractionsDisabled ? 0.7 : 1 },
                            ]}
                            onPress={() => handleHintSelection("decade")}
                            disabled={isInteractionsDisabled || hintUsed}
                            accessible
                            accessibilityRole="button"
                             accessibilityLabel={
                                isInteractionsDisabled
                                    ? "Hint button disabled"
                                    : "Get the movie's release decade"
                            }
                        >
                            <Text style={hintStyles.buttonText}>📅</Text>
                        </Pressable>
                        <Pressable
                           style={({ pressed }) => [
                                hintStyles.hintButton,
                                isInteractionsDisabled && hintStyles.disabled,
                               { opacity: pressed || isInteractionsDisabled ? 0.7 : 1 },
                            ]}
                           onPress={() => handleHintSelection("director")}
                           disabled={isInteractionsDisabled || hintUsed}
                            accessible
                            accessibilityRole="button"
                            accessibilityLabel={
                                isInteractionsDisabled
                                    ? "Hint button disabled"
                                    : "Get the movie's director"
                            }
                        >
                            <Text style={hintStyles.buttonText}>🎬</Text>
                        </Pressable>
                        <Pressable
                             style={({ pressed }) => [
                                hintStyles.hintButton,
                                isInteractionsDisabled && hintStyles.disabled,
                                 { opacity: pressed || isInteractionsDisabled ? 0.7 : 1 },
                            ]}
                           onPress={() => handleHintSelection("actor")}
                           disabled={isInteractionsDisabled || hintUsed}
                            accessible
                           accessibilityRole="button"
                            accessibilityLabel={
                                isInteractionsDisabled
                                    ? "Hint button disabled"
                                    : "Get the movie's first billed actor"
                            }
                        >
                            <Text style={hintStyles.buttonText}>🎭</Text>
                        </Pressable>
                       <Pressable
                           style={({ pressed }) => [
                                hintStyles.hintButton,
                                isInteractionsDisabled && hintStyles.disabled,
                                 { opacity: pressed || isInteractionsDisabled ? 0.7 : 1 },
                            ]}
                           onPress={() => handleHintSelection("genre")}
                           disabled={isInteractionsDisabled || hintUsed}
                            accessible
                           accessibilityRole="button"
                           accessibilityLabel={
                                isInteractionsDisabled
                                    ? "Hint button disabled"
                                    : "Get the movie's first listed genre"
                            }
                        >
                            <Text style={hintStyles.buttonText}>🗂️</Text>
                        </Pressable>
                   </View>
            );
        };

        return (
            <View style={hintStyles.container}>
               {renderHintButtons()}
                 <Text style={hintStyles.hintText}>
                      {hintText()}
                </Text>
            </View>
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.playerGame === nextProps.playerGame &&
            prevProps.isInteractionsDisabled === nextProps.isInteractionsDisabled
        );
    }
);

export default HintContainer;