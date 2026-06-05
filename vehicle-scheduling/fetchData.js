// fetchData.js

require('dotenv').config();

const axios = require('axios');
const logger = require('../middleware/logger');
const { BASE_URL, ACCESS_TOKEN } = process.env;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function getDepots() {
  try {
    logger('INFO', 'Depots request started');

    console.log("URL:", `${BASE_URL}/depots`);
console.log("AUTH HEADER:", `Bearer ${ACCESS_TOKEN.substring(0, 30)}...`);

    const response = await api.get('/depots');

    logger('INFO', 'Depots request successful');

    return response.data;
  } catch (error) {
    logger(
      'ERROR',
      error.response
        ? `Depots request failed with status ${error.response.status}`
        : `Depots request failed: ${error.message}`
    );

    throw error;
  }
}

async function getVehicles() {
  try {
    logger('INFO', 'Vehicles request started');

    const response = await api.get('/vehicles');

    logger('INFO', 'Vehicles request successful');

    return response.data;
  } catch (error) {
    logger(
      'ERROR',
      error.response
        ? `Vehicles request failed with status ${error.response.status}`
        : `Vehicles request failed: ${error.message}`
    );

    throw error;
  }
}

module.exports = {
  getDepots,
  getVehicles
};