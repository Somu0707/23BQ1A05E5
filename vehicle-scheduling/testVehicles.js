require('dotenv').config();

const axios = require('axios');

async function testVehicles() {
  try {
    const response = await axios.get(
      `${process.env.BASE_URL}/vehicles`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      }
    );

    console.log(JSON.stringify(response.data, null, 2));
  } catch (err) {
    console.log(err.response?.status);
    console.log(err.response?.data);
  }
}

testVehicles();