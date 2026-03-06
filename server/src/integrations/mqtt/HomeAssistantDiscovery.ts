/**
 * Home Assistant MQTT Discovery (Updated for HA 2026.4+)
 *
 * Replaces deprecated `object_id` with `default_entity_id`
 */

import * as mqtt from 'mqtt';
import type { DeviceStateService } from '../../services/DeviceStateService';
import { resolveDeviceName } from './helpers';

/**
 * Build Home Assistant discovery payload for climate entity (main thermostat control)
 */
export function buildClimateDiscovery(
  serial: string,
  deviceName: string,
  topicPrefix: string
): any {
  return {
    unique_id: `nolongerevil_${serial}`,
    name: deviceName,

    // NEW: default_entity_id instead of object_id
    default_entity_id: `climate.nest_${serial}`,

    device: {
      identifiers: [`nolongerevil_${serial}`],
      name: deviceName,
      model: 'Nest Thermostat',
      manufacturer: 'Google Nest',
      sw_version: 'NoLongerEvil',
    },

    availability: {
      topic: `${topicPrefix}/${serial}/availability`,
      payload_available: 'online',
      payload_not_available: 'offline',
    },

    temperature_unit: 'C',
    precision: 0.5,
    temp_step: 0.5,

    current_temperature_topic: `${topicPrefix}/${serial}/ha/current_temperature`,
    current_humidity_topic: `${topicPrefix}/${serial}/ha/current_humidity`,

    temperature_command_topic: `${topicPrefix}/${serial}/ha/target_temperature/set`,
    temperature_state_topic: `${topicPrefix}/${serial}/ha/target_temperature`,

    temperature_high_command_topic: `${topicPrefix}/${serial}/ha/target_temperature_high/set`,
    temperature_high_state_topic: `${topicPrefix}/${serial}/ha/target_temperature_high`,

    temperature_low_command_topic: `${topicPrefix}/${serial}/ha/target_temperature_low/set`,
    temperature_low_state_topic: `${topicPrefix}/${serial}/ha/target_temperature_low`,

    mode_command_topic: `${topicPrefix}/${serial}/ha/mode/set`,
    mode_state_topic: `${topicPrefix}/${serial}/ha/mode`,
    modes: ['off', 'heat', 'cool', 'heat_cool'],

    action_topic: `${topicPrefix}/${serial}/ha/action`,

    fan_mode_command_topic: `${topicPrefix}/${serial}/ha/fan_mode/set`,
    fan_mode_state_topic: `${topicPrefix}/${serial}/ha/fan_mode`,
    fan_modes: ['auto', 'on'],

    preset_mode_command_topic: `${topicPrefix}/${serial}/ha/preset/set`,
    preset_mode_state_topic: `${topicPrefix}/${serial}/ha/preset`,
    preset_modes: ['home', 'away', 'eco'],

    min_temp: 9,
    max_temp: 32,

    optimistic: false,
    qos: 1,
  };
}

/**
 * Temperature sensor
 */
export function buildTemperatureSensorDiscovery(
  serial: string,
  topicPrefix: string
): any {
  return {
    unique_id: `nolongerevil_${serial}_temperature`,
    name: `Temperature`,

    default_entity_id: `sensor.nest_${serial}_temperature`,

    device: {
      identifiers: [`nolongerevil_${serial}`],
    },

    state_topic: `${topicPrefix}/${serial}/ha/current_temperature`,
    unit_of_measurement: '°C',
    device_class: 'temperature',
    state_class: 'measurement',

    availability: {
      topic: `${topicPrefix}/${serial}/availability`,
      payload_available: 'online',
      payload_not_available: 'offline',
    },

    qos: 0,
  };
}

/**
 * Humidity sensor
 */
export function buildHumiditySensorDiscovery(
  serial: string,
  topicPrefix: string
): any {
  return {
    unique_id: `nolongerevil_${serial}_humidity`,
    name: `Humidity`,
    default_entity_id: `sensor.nest_${serial}_humidity`,

    device: {
      identifiers: [`nolongerevil_${serial}`],
    },

    state_topic: `${topicPrefix}/${serial}/ha/current_humidity`,
    unit_of_measurement: '%',
    device_class: 'humidity',
    state_class: 'measurement',

    availability: {
      topic: `${topicPrefix}/${serial}/availability`,
      payload_available: 'online',
      payload_not_available: 'offline',
    },

    qos: 0,
  };
}

/**
 * Outdoor temperature sensor
 */
export function buildOutdoorTemperatureSensorDiscovery(
  serial: string,
  topicPrefix: string
): any {
  return {
    unique_id: `nolongerevil_${serial}_outdoor_temperature`,
    name: `Outdoor Temperature`,
    default_entity_id: `sensor.nest_${serial}_outdoor_temperature`,

    device: {
      identifiers: [`nolongerevil_${serial}`],
    },

    state_topic: `${topicPrefix}/${serial}/ha/outdoor_temperature`,
    unit_of_measurement: '°C',
    device_class: 'temperature',
    state_class: 'measurement',

    availability: {
      topic: `${topicPrefix}/${serial}/availability`,
      payload_available: 'online',
      payload_not_available: 'offline',
    },

    qos: 0,
  };
}

/**
 * Occupancy binary sensor
 */
export function buildOccupancyBinarySensorDiscovery(
  serial: string,
  topicPrefix: string
): any {
  return {
    unique_id: `nolongerevil_${serial}_occupancy`,
    name: `Occupancy`,
    default_entity_id: `binary_sensor.nest_${serial}_occupancy`,

    device: {
      identifiers: [`nolongerevil_${serial}`],
    },

    state_topic: `${topicPrefix}/${serial}/ha/occupancy`,
    payload_on: 'home',
    payload_off: 'away',
    device_class: 'occupancy',

    availability: {
      topic: `${topicPrefix}/${serial}/availability`,
      payload_available: 'online',
      payload_not_available: 'offline',
    },

    qos: 0,
  };
}

/**
 * Fan binary sensor
 */
export function buildFanBinarySensorDiscovery(
  serial: string,
  topicPrefix: string
): any {
  return {
    unique_id: `nolongerevil_${serial}_fan`,
    name: `Fan`,
    default_entity_id: `binary_sensor.nest_${serial}_fan`,

    device: {
      identifiers: [`nolongerevil_${serial}`],
    },

    state_topic: `${topicPrefix}/${serial}/ha/fan_running`,
    payload_on: 'true',
    payload_off: 'false',
    device_class: 'running',

    availability: {
      topic: `${topicPrefix}/${serial}/availability`,
      payload_available: 'online',
      payload_not_available: 'offline`,
    },

    qos: 0,
  };
}

/**
 * Leaf (eco) binary sensor
 */
export function buildLeafBinarySensorDiscovery(
  serial: string,
  topicPrefix: string
): any {
  return {
    unique_id: `nolongerevil_${serial}_leaf`,
    name: `Eco Mode`,
    default_entity_id: `binary_sensor.nest_${serial}_leaf`,

    device: {
      identifiers: [`nolongerevil_${serial}`],
    },

    state_topic: `${topicPrefix}/${serial}/ha/eco`,
    payload_on: 'true',
    payload_off: 'false',
    device_class: 'power',

    availability: {
      topic: `${topicPrefix}/${serial}/availability`,
      payload_available: 'online',
      payload_not_available: 'offline`,
    },

    qos: 0,
  };
}

/**
 * Publish all discovery messages
 */
export async function publishThermostatDiscovery(
  client: mqtt.MqttClient,
  serial: string,
  deviceState: DeviceStateService,
  topicPrefix: string,
  discoveryPrefix: string
): Promise<void> {
  try {
    const deviceName = await resolveDeviceName(serial, deviceState);
    console.log(`[HA Discovery] Publishing discovery for ${serial} (${deviceName})`);

    await publishDiscoveryMessage(
      client,
      `${discoveryPrefix}/climate/nest_${serial}/thermostat/config`,
      buildClimateDiscovery(serial, deviceName, topicPrefix)
    );

    await publishDiscoveryMessage(
      client,
      `${discoveryPrefix}/sensor/nest_${serial}/temperature/config`,
      buildTemperatureSensorDiscovery(serial, topicPrefix)
    );

    await publishDiscoveryMessage(
      client,
      `${discoveryPrefix}/sensor/nest_${serial}/humidity/config`,
      buildHumiditySensorDiscovery(serial, topicPrefix)
    );

    await publishDiscoveryMessage(
      client,
      `${discoveryPrefix}/sensor/nest_${serial}/outdoor_temperature/config`,
      buildOutdoorTemperatureSensorDiscovery(serial, topicPrefix)
    );

    await publishDiscoveryMessage(
      client,
      `${discoveryPrefix}/binary_sensor/nest_${serial}/occupancy/config`,
      buildOccupancyBinarySensorDiscovery(serial, topicPrefix)
    );

    await publishDiscoveryMessage(
      client,
      `${discoveryPrefix}/binary_sensor/nest_${serial}/fan/config`,
      buildFanBinarySensorDiscovery(serial, topicPrefix)
    );

    await publishDiscoveryMessage(
      client,
      `${discoveryPrefix}/binary_sensor/nest_${serial}/leaf/config`,
      buildLeafBinarySensorDiscovery(serial, topicPrefix)
    );

    console.log(`[HA Discovery] Successfully published all discovery messages for ${serial}`);
  } catch (error) {
    console.error(`[HA Discovery] Error publishing discovery for ${serial}:`, error);
    throw error;
  }
}

/**
 * Publish a single discovery message
 */
async function publishDiscoveryMessage(
  client: mqtt.MqttClient,
  topic: string,
  config: any
): Promise<void> {
  return new Promise((resolve, reject) => {
    const payload = typeof config === 'string' ? config : JSON.stringify(config);
    client.publish(topic, payload, { retain: true, qos: 1 }, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

/**
 * Remove discovery messages
 */
export async function removeDeviceDiscovery(
  client: mqtt.MqttClient,
  serial: string,
  discoveryPrefix: string
): Promise<void> {
  const topics = [
    `${discoveryPrefix}/climate/nest_${serial}/thermostat/config`,
    `${discoveryPrefix}/sensor/nest_${serial}/temperature/config`,
    `${discoveryPrefix}/sensor/nest_${serial}/humidity/config`,
    `${discoveryPrefix}/sensor/nest_${serial}/outdoor_temperature/config`,
    `${discoveryPrefix}/binary_sensor/nest_${serial}/occupancy/config`,
    `${discoveryPrefix}/binary_sensor/nest_${serial}/fan/config`,
    `${discoveryPrefix}/binary_sensor/nest_${serial}/leaf/config`,
  ];

  for (const topic of topics) {
    await publishDiscoveryMessage(client, topic, '');
  }

  console.log(`[HA Discovery] Removed all discovery messages for ${serial}`);
}
