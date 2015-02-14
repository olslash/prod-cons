'use strict';

var _ = require('lodash');

class Consumer {
  constructor() {
    // The consumer will send [ttl] keepalive mesages to the producer before exiting.
    this._ttl = process.env.NODE_ENV === 'test' ? 4 : _.random(0, 12);
    this._interval = null;
    process.on('message', this._handleMessage.bind(this));
  }

  init() {
    // this consumer is hard-coded to be interested in NTP messages
    process.send({
      type: 'register',
      content: 'ntp'
    });

    const ONE_SECOND = 1000;
    this._interval = setInterval(this._tick.bind(this), ONE_SECOND);
  }

  _handleMessage(message) {
    console.log(`The consumer at PID ${process.pid} received the ${message.type} message ${message.content}`)
  }

  _tick() {
    if(this._ttl <= 0) {
      return process.exit();
    }
    this._ttl--;

    process.send({
      type: 'keepalive',
      content: ''
    });
  }
}

var consumer = new Consumer().init();
