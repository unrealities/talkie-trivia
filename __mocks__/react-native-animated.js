import React from 'react';

const Reanimated = jest.requireActual('react-native-reanimated/mock');

module.exports = {
  ...Reanimated,
  // Mock useAnimatedReaction with a working implementation using useEffect
  useAnimatedReaction: (preparer, reaction, deps) => {
    // We use React.useEffect to simulate the behavior of the hook.
    // It will run the reaction function whenever the dependencies change.
    React.useEffect(() => {
      const preparedValue = preparer();
      reaction(preparedValue, null); // prevValue is null for simplicity
    }, deps);
  },
  // Keep the runOnJS mock as it's also necessary
  runOnJS: (func) => {
    'worklet';
    return (...args) => func(...args);
  },
};
