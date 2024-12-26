import { jest } from '@jest/globals';

jest.mock('react-native/Libraries/vendor/emitter/EventEmitter', () => {
    const { EventEmitter } = require('events');
    return EventEmitter;
});

// Optional: Filter out specific console.warn messages (if needed)
const originalWarn = console.warn;
console.warn = (...args) => {
    const warningMessage = args[0];
    if (
        typeof warningMessage === "string" &&
        warningMessage.includes("defaultProps") &&
        (warningMessage.includes("VictoryPie") ||
            warningMessage.includes("Slice") ||
            warningMessage.includes("VictoryLabel"))
    ) {
        return; // Suppress the warning
    }
    originalWarn.apply(console, args);
};
