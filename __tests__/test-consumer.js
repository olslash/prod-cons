'use strict';

var should = require('should'),
    sinon  = require('sinon'),
    cp     = require('child_process');

describe('consumer', function() {
  beforeEach(function() {
    this.consumerProcess = cp.fork('consumer.js');
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
    // also prints to the console.
    this.consumerProcess.send({
      type: 'test',
      content: '123'
    });
  });

});

