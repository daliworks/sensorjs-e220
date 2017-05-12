'use strict';

var os = require('os');
var fs = require('fs');
var osUtils = require('os-utils');
var diskspace = require('diskspace');
var logger;

try {
  logger = require('./index').Sensor.getLogger('Sensor');
} catch (e) {
  logger = console;
}

function Resource() {}

Resource.prototype.getFreeMemory = function (callback) {
  var lines;
  var tokens;
  var freeMemory;   
  var bufferMemory;
  var cachedMemory;

  fs.readFile('/proc/meminfo', { encoding: 'ascii' }, function (err, data) {
    if (err) {    
      logger.error('[Resource] exec error:', err);    

      return callback && callback(err);   
    }

    lines = data.split('\n');

    lines.forEach(function (line) {
      if (line.indexOf('MemFree:') === 0) {
        tokens = line.split(/\s+/);   
        freeMemory = +tokens[1];

        return;
      }

      if (line.indexOf('Buffers:') === 0) {
        tokens = line.split(/\s+/);   
        bufferMemory = +tokens[1];

        return;
      }

      if (line.indexOf('Cached:') === 0) {
        tokens = line.split(/\s+/);   
        cachedMemory = +tokens[1];

        return;
      }
    });

    return callback && callback(null, (freeMemory + bufferMemory + cachedMemory) / 1000);
  });
};

Resource.prototype.getFreeStorage = function (callback) {
  try {
    diskspace.check('.', function (err, total, free) {
      return callback && callback(err, (free / (1000 * 1000)).toFixed(2));
    });
  } catch (exception) {
    logger.error('[E220] Exception on get free space:', exception);
    //this.getFreeStorage(callback);
    setTimeout(this.getFreeStorage.bind(this, callback), 1000);
  }
};

Resource.prototype.getIdleCpuUsage = function (callback) {
  osUtils.cpuFree(function (free) {
    return callback && callback(null, free.toFixed(2));
  });
};

Resource.prototype.getCpuUsage = function (callback) {
  osUtils.cpuUsage(function (usage) {
    return callback && callback(null, usage.toFixed(2));
  });
};

module.exports = new Resource();

if (require.main === module) {
  var resource = module.exports;

  resource.getFreeMemory(function (err, value) {
    logger.info('Free Memory:', value);
  });

  resource.getFreeStorage(function (err, value) {
    logger.info('Free Storage:', value);
  });

  resource.getIdleCpuUsage(function (err, value) {
    logger.info('Idle CPU Usage:', value);
  });

  resource.getCpuUsage(function (err, value) {
    logger.info('CPU Usage:', value);
  });
}
