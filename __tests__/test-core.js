'use strict';
// assertions
//
var should = require('should'),
    sinon = require('sinon'),
    cp = require('child_process'),
    EE = require('events').EventEmitter;

var Core = require('../Core');

describe('core', function () {
  beforeEach(function () {
    this.core = new Core();
  });

  it('should fork the correct number of consumers', function () {
    var forkSpy = sinon.spy(cp, 'fork');
    this.core.init(3, '__tests__/empty.js');
    forkSpy.calledThrice.should.be.true;

    forkSpy.restore()
  });

  it('should route registration and keepalive messages from consumer to producer', function(done) {
    var fakeProcess = new EE();
    fakeProcess.pid = '1234';
    var fakeFork = sinon.stub(cp, 'fork').returns(fakeProcess);

    var pidRegisterCalledWith = 0;
    var pidKeepAliveCalledWith = 0;

    var fakeProducer = {
      init: function() {},
      registerConsumer: function(pid, callback) {
        pidRegisterCalledWith = pid;
      },
      keepAlive: function(pid) {
        pidKeepAliveCalledWith = pid;
      }
    };
    this.core._producer = fakeProducer;

    this.core.init(3, '__tests__/empty.js');

    fakeProcess.emit('message', { type: 'register' });
    pidRegisterCalledWith.should.equal('1234');

    fakeProcess.emit('message', {type: 'keepalive'});
    pidKeepAliveCalledWith.should.equal('1234');

    done();
  });
});


