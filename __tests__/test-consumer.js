'use strict';

var should = require('should'),
    cp     = require('child_process');

describe('consumer', function() {
  beforeEach(function() {
    this.consumerProcess = cp.fork('consumer.js', [], { env: { 'NODE_ENV': 'test' } });
  });

  afterEach(function() {
    this.consumerProcess.kill();
  });

  it('should make a registration request for NTP on init', function(done) {
    this.consumerProcess.on('message', function (message) {
      message.type.should.equal('register');
      message.content.should.equal('ntp');
      done();
    });
  });

  xit('should log to the console messages sent to it', function(done) {
    // fixme: difficult to test for console.log being called, since mocha
    // also prints to the console. Also doesn't seem to stub correctly w/ Sinon.
    this.consumerProcess.send({
      type: 'test',
      content: '123'
    });
  });

  it('should send a keepalive message every second', function(done) {
    this.timeout(4000);
    var keepaliveCount = 0;

    this.consumerProcess.on('message', function (message) {
      if(message.type === 'keepalive') {
        keepaliveCount++;
      }
    });

    setTimeout(function() {
      keepaliveCount.should.equal(3);
      done();
    }, 3200);
  });

  it('should stop sending messages after 4 seconds when _ttl is 4 ', function(done) {
    // The consumer's TTL is hardcoded to 4 for tests
    this.timeout(6100);
    var keepaliveCount = 0;

    this.consumerProcess.on('message', function (message) {
      if (message.type === 'keepalive') {
        keepaliveCount++;
      }
    });

    setTimeout(function () {
      keepaliveCount.should.equal(4);
      done();
    }, 5200);
  });

});


