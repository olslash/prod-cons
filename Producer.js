var _ = require('lodash');

class Producer {
  constructor() {
    this._registeredConsumers = {};
  }

  init() {
    // start the time loop
    const ONE_SECOND = 1000;
    setInterval(this._tick.bind(this), ONE_SECOND);
  }

  // Register a consumer callback that the producer should call with time data each second
  registerConsumer(id, callback) {
    this._registeredConsumers[id] = { callback };
  }

  unregisterConsumer(id) {
    delete this._registeredConsumers[id];
    console.log(id, 'unregistered with the producer');
  }

  _tick() {
    _.forEach(this._registeredConsumers, function(consumer) {
      consumer.callback(this._getTime());
    }, this);
  }

  _getTime() {
    return Date.now();
  }
}


module.exports = Producer;
