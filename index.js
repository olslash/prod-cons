var core = require('./core');

var numConsumers = process.env['NUM_CONSUMERS'] || 5;
var consumerScriptPath = process.env['CONSUMER_SCRIPT'] || 'echo.js';

core.init(numConsumers, consumerScriptPath);
//producer.init()
// core

// instantiate producer
// producer listens to global emitter for
// 'register'(consumer id)
// 'keepalive'(consumer id)

// instantiate n consumers
// consumers fork the echo server process - consumer ID is process.PID
// consumers emit 'register'(ID)
