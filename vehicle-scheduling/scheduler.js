// vehicle-scheduling/scheduler.js

require('dotenv').config();

const axios = require('axios');

const { BASE_URL, ACCESS_TOKEN } = process.env;

/**
 * Axios instance with authentication headers
 */
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

/**
 * Fetch depots from API
 */
async function getDepots() {
  try {
    const response = await api.get('/depots');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response
        ? `Failed to fetch depots: ${error.response.status}`
        : error.message
    );
  }
}

/**
 * Fetch vehicles/tasks from API
 */
async function getVehicles() {
  try {
    const response = await api.get('/vehicles');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response
        ? `Failed to fetch vehicles: ${error.response.status}`
        : error.message
    );
  }
}

/**
 * 0/1 Knapsack using Dynamic Programming
 *
 * Duration = Weight
 * Impact = Value
 * MechanicHours = Capacity
 *
 * Returns:
 * - maximum impact
 * - selected task IDs
 */
function solveKnapsack(tasks, capacity) {
  const n = tasks.length;

  // DP table
  const dp = Array.from(
    { length: n + 1 },
    () => Array(capacity + 1).fill(0)
  );

  /**
   * Build DP table
   *
   * dp[i][w] =
   * maximum impact using first i tasks
   * with available capacity w
   */
  for (let i = 1; i <= n; i++) {
    const weight = tasks[i - 1].Duration;
    const value = tasks[i - 1].Impact;

    for (let w = 0; w <= capacity; w++) {
      if (weight <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - weight] + value
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  /**
   * Backtrack to determine selected tasks
   */
  const selectedTaskIds = [];
  let w = capacity;

  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      const task = tasks[i - 1];

      selectedTaskIds.push(
        task.TaskID ||
        task.taskID ||
        task.id
      );

      w -= task.Duration;
    }
  }

  return {
    totalImpact: dp[n][capacity],
    selectedTaskIds: selectedTaskIds.reverse()
  };
}

/**
 * Main scheduling workflow
 */
async function runScheduler() {
  try {
    console.log('Fetching depots...');
const depotResponse = await getDepots();

console.log('Fetching vehicles...');
const vehicleResponse = await getVehicles();

const depots = depotResponse.depots;
const vehicles = vehicleResponse.vehicles;
console.log("DEPOTS DATA:");
console.log(JSON.stringify(depots, null, 2));

console.log("Total Depots:", depots.length);
console.log("Total Vehicles:", vehicles.length);

for (const depot of depots) {
    const depotId = depot.ID;

    const mechanicHours = depot.MechanicHours;

      /**
       * Filter tasks belonging to current depot
       */
      const depotTasks = vehicles;

      const result = solveKnapsack(
        depotTasks,
        mechanicHours
      );

      console.log('\n==========================');
      console.log(`Depot ID       : ${depotId}`);
      console.log(`Mechanic Hours : ${mechanicHours}`);
      console.log(`Total Impact   : ${result.totalImpact}`);
      console.log(
        `Selected Task IDs : ${
          result.selectedTaskIds.length
            ? result.selectedTaskIds.join(', ')
            : 'None'
        }`
      );
      console.log('==========================');
    }
  } catch (error) {
    console.error('\nScheduler Error');
    console.error(error.message);
  }
}

runScheduler();