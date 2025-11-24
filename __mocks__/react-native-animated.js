require('react-native-reanimated/lib/reanimated2/jestUtils').setUpTests();
const Reanimated = require('react-native-reanimated/mock');

// Silent success for worklet calls
Reanimated.default.call = () => { };

module.exports = {
  ...Reanimated,
  useSharedValue: jest.fn((initialValue) => ({ value: initialValue })),
  useAnimatedStyle: jest.fn((styleFactory) => styleFactory()),
  useAnimatedReaction: jest.fn(),
  withTiming: jest.fn((toValue, _, cb) => {
    if (cb) cb(true);
    return toValue;
  }),
  withSpring: jest.fn((toValue) => toValue),
  withSequence: jest.fn((...args) => args[args.length - 1]),
  withDelay: jest.fn((_, animation) => animation),
  withRepeat: jest.fn((animation) => animation),
  runOnJS: (fn) => fn,
  Easing: {
    linear: (t) => t,
    inOut: (fn) => fn,
    ease: (t) => t,
    out: (fn) => fn,
    exp: (t) => t,
    poly: (n) => (t) => t,
  },
};
