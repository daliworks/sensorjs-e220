'use strict';

var sensorDriver = require('../../index');
var Network = sensorDriver.Network;
var Device = sensorDriver.Device;
var util = require('util');

var deviceIds;

// 1. Rename the network name 'OpenWrtLocal'
function OpenWrtLocal(options) {
  Network.call(this, 'OpenWrtLocal', options);
}

util.inherits(OpenWrtLocal, Network);

OpenWrtLocal.prototype.discover = function(networkName, options, cb) {
  return cb && cb(new Error('Non discoverable device'));
};

module.exports = new OpenWrtLocal();
