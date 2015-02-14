var Core = require('./Core');

var numConsumers = process.env['NUM_CONSUMERS'] || 5;
var consumerScriptPath = process.env['CONSUMER_SCRIPT'] || 'consumer.js';

// kick things off by making a core and initializing it with the process args
var core = new Core().init(numConsumers, consumerScriptPath);
