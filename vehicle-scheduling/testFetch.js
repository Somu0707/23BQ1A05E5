// testFetch.js

const { getDepots, getVehicles } = require('./fetchData');async function testFetch() {
  try {
    const depots = await getDepots();

    console.log('=== DEPOTS ===');
    console.log(JSON.stringify(depots, null, 2));

    const vehicles = await getVehicles();

    console.log('\n=== VEHICLES ===');
    console.log(JSON.stringify(vehicles, null, 2));
  } catch (error) {
    console.error('Error fetching data:');

    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

testFetch();