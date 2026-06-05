require('dotenv').config();
const axios = require('axios');

async function test() {
  try {
    const response = await axios.get(
      `${process.env.BASE_URL}/depots`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      }
    );

    console.log(response.status);
    console.log(response.data);

  } catch (error) {
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);
    console.log("MESSAGE:", error.message);
  }
}

test();