/**
 * Server-specific Configuration
 * Update these paths to match your server setup
 */

const path = require("path");

// Server-specific configuration
const SERVER_CONFIG = {
  // Update these paths to match your server
  sqlFile: "/var/www/khandak-admin-panel/data/khandaq_2025-10-22_162307.sql",
  uploadsDir: "/var/www/khandak-admin-panel/data/uploads",
  strapiUploadsDir: "/var/www/khandak-admin-panel/public/uploads",

  // Strapi configuration
  strapiUrl: "http://localhost:1337", // or your Strapi URL
  apiToken: process.env.STRAPI_API_TOKEN,

  // Migration settings
  batchSize: 50,
  logLevel: "info",
};

module.exports = SERVER_CONFIG;
