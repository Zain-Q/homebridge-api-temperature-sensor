const axios = require('axios');

module.exports = (api) => {
  api.registerAccessory('TemperatureSensorPlugin', TemperatureSensorAccessory);
};

class TemperatureSensorAccessory {

  constructor(log, config, api) {
    this.log = log;
    this.config = config;
    this.api = api;

    this.Service = this.api.hap.Service;
    this.Characteristic = this.api.hap.Characteristic;

    // extract name from config
    this.name = config.name;

    // create a new Temperature Sensor service
    this.service = new this.Service.TemperatureSensor(this.name);

    // create handlers for required characteristics
    this.service.getCharacteristic(this.Characteristic.CurrentTemperature)
      .onGet(this.handleCurrentTemperatureGet.bind(this));

    // Set an interval to update the temperature value periodically
    if (config.updateInterval && config.updateInterval > 0) {
      setInterval(this.updateTemperature.bind(this), config.updateInterval * 1000);
    }
  }

  /**
   * Handle requests to get the current value of the "Current Temperature" characteristic
   */
  async handleCurrentTemperatureGet() {
    this.log.debug('Triggered GET CurrentTemperature');

    try {
      const response = await axios.get('http://192.168.100.4/temperature');
      this.log.debug('Response from HTTP request:', response.data);

      // Ensure the response data is a valid number
      const temperature = parseFloat(response.data);
      if (!isNaN(temperature)) {
        this.log.debug('Current Temperature: ' + temperature);
        return temperature;
      } else {
        throw new Error('Temperature value is not a valid number');
      }
    } catch (error) {
      this.log.error('Error getting temperature:', error);
      throw new this.api.hap.HapStatusError(this.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  async updateTemperature() {
    try {
      const response = await axios.get('http://192.168.100.4/temperature');
      this.log.debug('Response from HTTP request:', response.data);

      // Ensure the response data is a valid number
      const temperature = parseFloat(response.data);
      if (!isNaN(temperature)) {
        this.service.getCharacteristic(this.Characteristic.CurrentTemperature).updateValue(temperature);
        this.log.debug('Updated Temperature: ' + temperature);
      } else {
        this.log.error('Temperature value is not a valid number');
      }
    } catch (error) {
      this.log.error('Error updating temperature:', error);
    }
  }

  /**
   * Required by Homebridge to retrieve available services for this accessory
   */
  getServices() {
    return [this.service];
  }
}

