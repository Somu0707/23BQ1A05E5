// stage6/priorityInbox.js

require('dotenv').config();

const axios = require('axios');

const { BASE_URL, ACCESS_TOKEN } = process.env;

/**
 * Priority weights for notification categories.
 * Higher weight = higher importance.
 */
const PRIORITY_WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1
};

/**
 * Create an authenticated axios instance.
 */
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

/**
 * Fetch notifications from the API.
 */
async function getNotifications() {
  const response = await api.get('/notifications');
  return response.data;
}

/**
 * Calculate notification score.
 *
 * Score =
 * priority weight + recency factor
 *
 * Recency factor is calculated based on
 * how recently the notification was created.
 */
function calculateScore(notification) {
    const priorityWeight =
      PRIORITY_WEIGHTS[notification.Type] || 0;
  
    const createdAt = new Date(
      notification.Timestamp
    );
  
    const now = Date.now();
  
    const ageHours =
      (now - createdAt.getTime()) /
      (1000 * 60 * 60);
  
    const recencyFactor = Math.max(
      0,
      10 - ageHours / 2
    );
  
    return priorityWeight + recencyFactor;
  }

/**
 * Main workflow.
 */
async function buildPriorityInbox() {
  try {
    console.log('Fetching notifications...');

    const response = await getNotifications();

const notifications = response.notifications;

if (!notifications || !Array.isArray(notifications)) {
  throw new Error(
    'Invalid notifications response format'
  );
}

    /**
     * Attach score to each notification.
     */
    const rankedNotifications = notifications.map(
      notification => ({
        ...notification,
        score: Number(
          calculateScore(notification).toFixed(2)
        )
      })
    );

    /**
     * Sort by score descending.
     */
    rankedNotifications.sort(
      (a, b) => b.score - a.score
    );

    /**
     * Return top 10 notifications.
     */
    const topNotifications =
      rankedNotifications.slice(0, 10);

    console.log('\n=== TOP 10 PRIORITY NOTIFICATIONS ===\n');

    console.table(
        topNotifications.map(notification => ({
          ID: notification.ID,
          Type: notification.Type,
          Message: notification.Message,
          Score: notification.score,
          Timestamp: notification.Timestamp
        }))
      );

    return topNotifications;
  } catch (error) {
    console.error('\nFailed to build priority inbox.');

    if (error.response) {
      console.error(
        `API Error: ${error.response.status}`
      );
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }

    return [];
  }
}

/**
 * Execute script.
 */
buildPriorityInbox();