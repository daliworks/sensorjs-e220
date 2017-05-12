'use strict';

var _ = require('lodash');
var should = require('chai').should();
var exec = require('child_process').exec;

describe('Get free memory size', function () {
  it('should be a number.', function (done) {
    exec('cat /proc/meminfo | grep MemFree', function execCb(err, stdout, stderr) {
      var tokens;

      if (err) {
        done(err);
      } else if (stderr) {
        done(new Error(stderr));
      } else {
        tokens = stdout.split(/\s+/);
        (+tokens[1]).should.be.a('number');
        (+tokens[1]).should.be.above(0);

        done();
      }
    });
  });
});

describe('Get free storage size', function () {
  it('should be a number.', function (done) {
    exec('df .', function execCb(err, stdout, stderr) {
      var lines;
      var tokens;
      var indexOfFree;

      if (err) {
        done(err);
      } else if (stderr) {
        done(new Error(stderr));
      } else {
        lines = stdout.split('\n');
        lines.should.have.length.of(3);   // The last line is an empty string.
        tokens = lines[0].split(/\s+/);
        indexOfFree = tokens.indexOf('Available');
        tokens = lines[1].split(/\s+/);
        (+tokens[indexOfFree]).should.be.a('number');
        (+tokens[indexOfFree]).should.be.above(0);

        done();
      }
    });
  });
});

describe('Get idle CPU', function () {
  var cpuPattern = '^%Cpu';
  var idlePattern = 'id,';
  var index;
  var lines;
  var tokens;

  before(function (done) {
    exec('\ls -l `which top`', function execCb(err, stdout, stderr) {
      if (err) {
        done(err);
      } else if (stderr) {
        done(new Error(stderr));
      } else {
        index = stdout.search(/busybox/);
        console.log(stdout, index);

        if (index > -1) {
          cpuPattern = '^CPU';
          idlePattern = 'idle';
        }

        done();
      }
    });
  });

  it('should be a number.', function (done) {
    this.timeout(5000);

    exec('top -bn2 -d3 | grep "' + cpuPattern + '"', function execCb(err, stdout, stderr) {
      if (err) {
        done(err);
      } else if (stderr) {
        done(new Error(stderr));
      } else {
        lines = stdout.split('\n');
        tokens = lines[1].split(/\s+/);
        index = tokens.indexOf(idlePattern);
        tokens = tokens[index - 1].split('%');    // remove trailing '%' if exists

        (+tokens[0]).should.be.a('number');
        (+tokens[0]).should.be.above(0);

        done();
      }
    });
  });
});
