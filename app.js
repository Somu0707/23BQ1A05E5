require('dotenv').config();

const axios = require('axios');
const logger = require('./middleware/logger');

async function register() {
  try {
    logger('INFO', 'Starting registration process');

    const {
      BASE_URL,
      ACCESS_CODE,
      NAME,
      EMAIL,
      ROLL_NO,
      GITHUB_USERNAME,
      MOBILE_NO
    } = process.env;

    if (
      !BASE_URL ||
      !ACCESS_CODE ||
      !NAME ||
      !EMAIL ||
      !ROLL_NO ||
      !GITHUB_USERNAME ||
      !MOBILE_NO
    ) {
      throw new Error('Missing required environment variables');
    }

    const requestBody = {
      email: EMAIL,
      name: NAME,
      mobileNo: MOBILE_NO,
      githubUsername: GITHUB_USERNAME,
      rollNo: ROLL_NO,
      accessCode: ACCESS_CODE
    };

    logger('INFO', 'Sending registration request');

    const response = await axios.post(
      `${BASE_URL}/register`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    logger('INFO', 'Registration successful');

    const { clientID, clientSecret } = response.data;

    console.log('\nRegistration Successful');
    console.log('----------------------');
    console.log('clientID:', clientID);
    console.log('clientSecret:', clientSecret);
  } catch (error) {
    logger('ERROR', 'Registration failed');

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

register();