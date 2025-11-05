import { TriviaItem, Hint } from "../models/trivia";

interface ImplicitHintResult {
  feedback: string | null;
  revealedHints: Partial<Record<string, boolean>>;
  hintInfo: Hint[] | null;
}

const getHintValue = (type: string, item: TriviaItem): any => {
  return item.hints.find(h => h.type === type)?.value || null;
}

/**
 * Compares a guessed item with the correct item to generate implicit hints.
 * It finds all matching attributes for display and marks new matches as revealed.
 */
export function generateImplicitHint(
  guessedItem: TriviaItem,
  correctItem: TriviaItem,
  usedHints: Partial<Record<string, boolean>> = {}
): ImplicitHintResult {
  const result: ImplicitHintResult = {
    feedback: null,
    revealedHints: {},
    hintInfo: [],
  };

  const hintsFound: Hint[] = [];
  let newHintRevealed = false;
  let firstNewMatchMessage: string | null = null;

  if (!guessedItem || !correctItem) {
    return {
      feedback: "An unexpected error occurred with trivia data.",
      revealedHints: {},
      hintInfo: null,
    };
  }
  
  // Generic hint checking
  for (const correctHint of correctItem.hints) {
    const guessedHintValue = getHintValue(correctHint.type, guessedItem);
    let isMatch = false;

    // Different comparison logic based on hint type
    switch (correctHint.type) {
      case 'actors':
        const correctActorIds = new Set((correctHint.value || []).slice(0, 5).map((a: any) => a.id));
        const guessedActorIds = new Set((guessedHintValue || []).slice(0, 5).map((a: any) => a.id));
        for (const id of correctActorIds) {
          if (guessedActorIds.has(id)) {
            isMatch = true;
            break;
          }
        }
        break;
      case 'director':
      case 'developer':
        isMatch = (guessedHintValue as any)?.id === (correctHint.value as any)?.id && !!(correctHint.value as any)?.id;
        break;
      case 'genre':
      case 'decade':
        isMatch = guessedHintValue === correctHint.value && !!correctHint.value;
        break;
      default:
        isMatch = guessedHintValue === correctHint.value;
        break;
    }

    if (isMatch) {
      hintsFound.push({ type: correctHint.type, label: correctHint.label, value: getHintValue(correctHint.type, correctItem) });
      
      if (!usedHints[correctHint.type]) {
        result.revealedHints[correctHint.type] = true;
        newHintRevealed = true;
        if (!firstNewMatchMessage) {
          firstNewMatchMessage = `You're on the right track with the ${correctHint.label}! (Hint Revealed)`;
        }
      }
    }
  }

  result.hintInfo = hintsFound;

  if (newHintRevealed) {
    result.feedback = firstNewMatchMessage;
  } else if (hintsFound.length > 0) {
    result.feedback = "You're getting warmer! Try another movie.";
  } else {
    result.feedback = "Not quite! Try again.";
  }

  return result;
}
