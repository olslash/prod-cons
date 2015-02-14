var _ = require('lodash');

class Consumer {
  constructor() {
    // The consumer will send [ttl] keepalive mesages to the producer before exiting.
    this.ttl = _.random(0, 12);

    process.on('message', this._handleMessage.bind(this));
  }

  init() {
    // this consumer is hard-coded to be interested in NTP messages
    process.send({
      type: 'register',
      content: 'ntp'
    });
  }

  _handleMessage(message) {
    console.log(`The consumer at PID ${process.pid} received the ${message.type} message ${message.content}`)
  }
}

var consumer = new Consumer().init();
