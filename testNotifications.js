// testNotifications.js
require('dotenv').config();
const axios = require('axios');

axios.get(
  `${process.env.BASE_URL}/notifications`,
  {
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
    }
  }
)
.then(res => {
  console.log(res.status);
  console.log(JSON.stringify(res.data, null, 2));
})
.catch(err => {
  console.log(err.response?.status);
  console.log(err.response?.data);
});
