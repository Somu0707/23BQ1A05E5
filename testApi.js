// testApi.js

require('dotenv').config();

const axios = require('axios');
const logger = require('./middleware/logger');

async function testApi() {
  try {
    const { BASE_URL, ACCESS_TOKEN } = process.env;

    if (!BASE_URL || !ACCESS_TOKEN) {
      throw new Error(
        'Missing required environment variables: BASE_URL or ACCESS_TOKEN'
      );
    }

    logger('INFO', 'Request started');

    const response = await axios.get(`${BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`
      }
    });

    logger('INFO', 'Request successful');

    console.log('\nStatus Code:', response.status);
    console.log('\nResponse Data:');
    console.log(response.data);

  } catch (error) {
    logger('ERROR', 'Request failed');

    if (error.response) {
      console.log('\nStatus Code:', error.response.status);
      console.log('\nError Response:');
      console.log(error.response.data);

      logger(
        'ERROR',
        `Status ${error.response.status}: ${JSON.stringify(error.response.data)}`
      );
    } else if (error.request) {
      logger('ERROR', 'No response received from server');
      console.log('No response received from server.');
    } else {
      logger('ERROR', error.message);
      console.log('Error:', error.message);
    }
  }
}

testApi();