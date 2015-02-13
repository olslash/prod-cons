var cp = require('child_process');

class Consumer {
  constructor() {
    this.process = null;
    this.pid = null;
  }

  init(scriptPath) {
    this.process = cp.fork(scriptPath);
    this.pid = this.process.pid;

    this.process.on('message', this._handleProcessMessage);
    this.process.on('error', this._handleProcessError);
    this.process.on('exit', this._handleProcessExit);

    this._sendMessageToProcess('test')
  }

  _sendMessageToProcess(message) {
    this.process.send(message);
  }

  _handleProcessMessage(message) {
    process.emit('message', message, this.pid);
  }

  _handleProcessError(err) {
    console.error(`killing child process ${this.pid} because of an error: ${err}`);
  }

  _handleProcessExit() {
    console.info(`child process ${this.pid} is exiting.`);
  }
}

module.exports = Consumer;
// fork echo process
// listen to echo process for messages
// forward messages to echo process from core on global emitter
// emit register to the core on global emitter
//