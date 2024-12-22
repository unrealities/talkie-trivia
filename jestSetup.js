jest.mock('react-native/Libraries/vendor/emitter/EventEmitter', () =>
    require('events').EventEmitter
)
