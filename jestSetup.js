import { jest } from '@jest/globals';

jest.mock('react-native/Libraries/vendor/emitter/EventEmitter', () => {
    const { EventEmitter } = require('events');
    return EventEmitter;
});
