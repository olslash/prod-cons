'use strict';

var _ = require('lodash');

class Producer {
  constructor() {
    this._registeredConsumers = {};
    this._interval = null;

    const TEN_SECONDS_IN_MS = 10 * 1000;
    this._timeout = TEN_SECONDS_IN_MS;
  }

  init() {
    // start the time loop
    const ONE_SECOND = 1000;
    this._interval = setInterval(this._tick.bind(this), ONE_SECOND);
  }

  // Register a consumer callback that the producer should call with time data each second
  registerConsumer(id, callback) {
    this._registeredConsumers[id] = {
      id: id,
      callback: callback,
      lastKeepAlive: Date.now()
    };
  }

  unregisterConsumer(id) {
    delete this._registeredConsumers[id];
  }

  keepAlive(id) {
    if(this._registeredConsumers[id]) { // prevent error if we already culled this consumer
      this._registeredConsumers[id].lastKeepAlive = Date.now();
    }
  }

  stop() {
    clearInterval(this._interval);
  }

  _tick() {
    _.each(this._registeredConsumers, function(consumer) {
      consumer.callback({
        type: 'time',
        content: this._getTime()
      });
    }, this);

    this._cullDeadConsumers();
  }

  _cullDeadConsumers() {
    // Check if any consumers last sent a keepalive >= 10 seconds ago
    _.each(this._registeredConsumers, function(consumer) {
      if(Date.now() - consumer.lastKeepAlive >= this._timeout) {
        console.info('culling', consumer.id, 'after', this._timeout, 'seconds of inactivity');
        delete this._registeredConsumers[consumer.id];
      }
    }, this);
  }

  _getTime() {
    return Date.now();
  }
}


module.exports = Producer;
