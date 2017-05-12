'use strict';

var util = require('util');

var SensorLib = require('../index');
var Sensor = SensorLib.Sensor;
var logger = Sensor.getLogger('Sensor');
var resource = require('../resource');

var funcTable = {
  freeMemory: resource.getFreeMemory,
  freeStorage: resource.getFreeStorage,
  cpuUsage: resource.getCpuUsage
};

function E220Sensor(sensorInfo, options) {
  var self = this;

  Sensor.call(self, sensorInfo, options);

  self.sequence = self.id.split('-')[2];

  if (sensorInfo.model) {
    self.model = sensorInfo.model;
  }

  self.dataType = E220Sensor.properties.dataTypes[self.model][0];
  self.getValue = funcTable[self.sequence];
}

E220Sensor.properties = {
  supportedNetworks: ['openwrt-local'],
  dataTypes: {
    'e220Memory': ['number'],
    'e220Storage': ['number'],
    'e220CPUUsage': ['number']
  },
  discoverable: false,
  addressable: false,
  recommendedInterval: 60000,
  maxInstances: 1,
  maxRetries: 8,
  idTemplate: '{gatewayId}-resource-{sequence}',
  models: ['e220Memory', 'e220Storage', 'e220CPUUsage'],
  category: 'sensor'
};

util.inherits(E220Sensor, Sensor);

E220Sensor.prototype._get = function (cb) {
  var self = this;

  self.getValue.call(resource, function (err, value) {
    var result = {
      status: 'on',
      id: self.id,
      result: {},
      time: {}
    };

    result.result[self.dataType] = value;
    result.time[self.dataType] = new Date().getTime();

    if (cb) {
      return cb(null, result);
    } else {
      self.emit('data', result);
    }
  });
};

E220Sensor.prototype._clear = function () {
};

module.exports = E220Sensor;
