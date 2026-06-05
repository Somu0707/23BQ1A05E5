//auth.js

require('dotenv').config();

const axios = require('axios');
const logger = require('./middleware/logger');

async function authenticate() {
  try {
    logger('INFO', 'Starting authentication process');

    const {
      BASE_URL,
      ACCESS_CODE,
      NAME,
      EMAIL,
      ROLL_NO,
      CLIENT_ID,
      CLIENT_SECRET
    } = process.env;

    if (
      !BASE_URL ||
      !ACCESS_CODE ||
      !NAME ||
      !EMAIL ||
      !ROLL_NO ||
      !CLIENT_ID ||
      !CLIENT_SECRET
    ) {
      throw new Error('Missing required environment variables');
    }

    const requestBody = {
      email: EMAIL,
      name: NAME,
      rollNo: ROLL_NO,
      accessCode: ACCESS_CODE,
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET
    };

    logger('INFO', 'Sending authentication request');

    const response = await axios.post(
      `${BASE_URL}/auth`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    logger('INFO', 'Authentication successful');

    const {
      access_token,
      token_type,
      expires_in
    } = response.data;

    console.log('\nAuthentication Successful');
    console.log('-------------------------');
    console.log('access_token:', access_token);
    console.log('token_type:', token_type);
    console.log('expires_in:', expires_in);
  } catch (error) {
    logger('ERROR', 'Authentication failed');

    if (error.response) {
      logger(
        'ERROR',
        `Status: ${error.response.status} - ${JSON.stringify(error.response.data)}`
      );
    } else if (error.request) {
      logger('ERROR', 'No response received from server');
    } else {
      logger('ERROR', error.message);
    }
  }
}

authenticate();