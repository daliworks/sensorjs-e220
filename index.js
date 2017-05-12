'use strict';

function initDrivers() {
  var e220Sensor;

  try {
    e220Sensor = require('./driver/e220Sensor');
  } catch(e) {
    this.Sensor.getLogger().error('Cannot load ./driver/e220Sensor', e);
  }

  return {
    e220Sensor: e220Sensor
  };
}

function initNetworks() {
  var openwrtLocal;

  try {
    openwrtLocal = require('./network/openwrt-local');
  } catch (e) {
    this.Sensor.getLogger().error('Cannot load ./network/openwrt-local', e);
  }

  return {
    'openwrt-local': openwrtLocal
  };
}

module.exports = {
  networks: ['openwrt-local'],
  drivers: {
    e220Sensor: ['e220Memory', 'e220Storage', 'e220CPUUsage']
  },
  initNetworks: initNetworks,
  initDrivers: initDrivers
};
