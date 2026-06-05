// testLog.js

require('dotenv').config();

const axios = require('axios');

async function testLog() {
  try {
    const response = await axios.post(
      `${process.env.BASE_URL}/logs`,
      {
        stack: "backend",
        level: "info",
        package: "middleware",
        message: "testing token"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      }
    );

    console.log(response.data);

  } catch (err) {
    console.log("STATUS:", err.response?.status);
    console.log("DATA:", err.response?.data);
  }
}

testLog();