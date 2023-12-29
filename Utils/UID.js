// expirableUID.js

const shortUUID = require('short-uuid');

// Create an instance of short-uuid
const translator = shortUUID();

// Function to generate an expirable UID
function generateExpirableUID() {
  // Generate a short UUID
  const uid = translator.new();

  // Get the current timestamp
  const timestamp = Date.now();

  // Combine the UID and timestamp to create an expirable UID
  const expirableUID = `${uid}-${timestamp}`;

  return expirableUID;
}

// Function to check if the UID has expired
function isExpired(expirableUID, expirationTime) {
  const [, timestamp] = expirableUID.split('-');
  return Date.now() - parseInt(timestamp, 10) > expirationTime;
}

module.exports = {
  generateExpirableUID,
  isExpired,
};
