'use strict';
// assertions
//
var should = require('should'),
    sinon = require('sinon'),
    cp = require('child_process');

var Producer = require('../Producer');

describe('producer', function () {
  beforeEach(function () {
    this.producer = new Producer();
  });

  afterEach(function() {
    this.producer.stop();
  });

  it('should send a registered consumer a message every second', function (done) {
    this.timeout(4000);
    var calledCount = 0;

    this.producer.registerConsumer('123', function() {
      calledCount++;
    });

    this.producer.init();

    setTimeout(function() {
      calledCount.should.equal(3);
      done();
    }, 3050)
  });

  it('should not send messages to a consumer after the consumer has been unregistered', function(done) {
    this.timeout(4000);
    var calledCount = 0;

    this.producer.registerConsumer('123', function () {
      calledCount++;
    });

    this.producer.init();

    // verify it's ticked twice
    setTimeout(function () {
      calledCount.should.equal(2);
      this.producer._unregisterConsumer('123');
    }.bind(this), 2050);

    // verify it wasn't called again after being unregistered
    setTimeout(function () {
      calledCount.should.equal(2);
      done();
    }, 3050)
  });

  it('should call multiple consumers correctly', function(done) {
    this.timeout(4000);
    var sum = 0;

    this.producer.registerConsumer('123', function () {
      sum++;
    });

    this.producer.registerConsumer('456', function () {
      sum = sum + 3;
    });

    this.producer.init();

    setTimeout(function () {
      sum.should.equal(12);
      done();
    }, 3050)
  });

  it('should unregister a consumer, and continue messaging others', function(done) {
    this.timeout(4000);
    var sum = 0;

    this.producer.registerConsumer('123', function () {
      sum++;
    });

    this.producer.registerConsumer('456', function () {
      sum = sum + 3;
    });

    this.producer.init();

    // unregister 123
    setTimeout(function () {
      sum.should.equal(8);
      this.producer._unregisterConsumer('123');
    }.bind(this), 2050);

    // 456 should have been called once more, but not 123
    setTimeout(function () {
      sum.should.equal(11);
      done();
    }, 3050)
  });

  it('should return a valid and correct time', function(done) {
    this.producer.registerConsumer('123', function (message) {
      var dateDifference = Date.now() - new Date(message.content);
      (dateDifference < 100).should.be.true;
      done()
    });

    this.producer.init();
  });

  it('should stop sending messages to consumers after the specified inactivity period', function(done) {
    this.timeout(4000);

    var calledCount = 0;
    this.producer.registerConsumer('123', function() {
      calledCount++;
    });

    this.producer._timeout = 2000;
    this.producer.init();

    setTimeout(function() {
      calledCount.should.equal(2);
      done()
    }, 3050);
  })
});


