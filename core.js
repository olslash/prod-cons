var path = require('path');

var producer = require('./producer'),
    Consumer = require('./Consumer');

class Core {
  constructor() {
    this.allConsumers = [];
    process.on('register', this._handleRegistration);
    process.on('keepalive', this._handleKeepalive);
  }

  init(numConsumers, consumerScriptPath) {
    for(var i = 0; i < numConsumers; i++) {
      var consumer = new Consumer()
      consumer.init( path.join(__dirname, consumerScriptPath) )
    }
  }

  _handleRegistration() {

  }

  _handleKeepalive() {

  }
}

// core is singleton
module.exports = new Core();
