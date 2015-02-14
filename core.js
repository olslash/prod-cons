'use strict';

var path = require('path'),
    cp = require('child_process'),
    _  = require('lodash');

var Producer = require('./Producer');

class Core {
  constructor() {
    this._consumers = {};
    this._producer = new Producer();
  }

  init(numConsumers, consumerScriptPath) {
    // start the producer-- it's now listening for registration messages
    this._producer.init();
    // fork [numConsumers] consumer processes
    _.times(numConsumers, this._forkConsumer.bind(this, consumerScriptPath));
  }

  _forkConsumer(scriptPath) {
    var consumerProcess = cp.fork(scriptPath);

    // Retain the consumer's process object
    this._consumers[consumerProcess.pid] = { process: consumerProcess };

    // Listen to events from the consumer processes.
    // Binding the handler's first argument to the processes' PIDs lets us
    // do bookkeeping later, since the events don't carry any process info.
    consumerProcess.on('message', this._handleConsumerMessage.bind(this, consumerProcess.pid));
    consumerProcess.on('error',   this._handleConsumerError.bind(this, consumerProcess.pid));
    consumerProcess.on('exit',    this._handleProcessExit.bind(this, consumerProcess.pid));
  }

  _handleConsumerMessage(pid, message) {
    switch (message.type) {
      case 'register':
        // Give the producer a callback to use for messaging this consumer
        this._producer.registerConsumer(pid, this._consumerCallback.bind(this, pid));

        break;
      case 'keepalive':
        console.info('keepalive message');
        // The consumer sends a heartbeat every 5 seconds. If one is missed

        break;
    }
    // For simplicity we're ignoring message.content, which says that
    // the consumer is interested in 'ntp' messages. In a more complicated system,
    // the consumer could subscribe to one of many producers by specifying the
    // producer's name.
  }

  // Handler for error events from any consumer
  _handleConsumerError(pid, err) {
    console.error(`killing child process ${pid} because of an error: ${err}`);
    this._consumers[pid].process.kill('SIGKILL');
    this._producer.unregisterConsumer(pid);

    delete this._consumers[pid];
  }

  // Handler for process exit events from any consumer
  _handleProcessExit(pid) {
    console.info(`child process ${pid} is exiting normally.`);
    this._producer.unregisterConsumer(pid);

    delete this._consumers[pid];
  }

  // Generic callback for messaging a consumer. Never called here directly; the
  // producer is sent a partially-applied reference for each consumer, with the
  // pid pre-filled.
  _consumerCallback(pid, message) {
    this._consumers[pid].process.send(message);
  }
}

module.exports = Core;

// core instantiates producer
// core spawns consumers
// consumer process.sends to core saying 'register:ntp' where ntp is the producer name
// core looks for a producer called 'ntp', and calls its register method, providing a callback
// when the producer ticks, it calls each callback in turn with the payload (time)
// the callbacks are tied to process.send on the core, which forwards the payload to each consumer in turn.
