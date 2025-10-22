#!/usr/bin/env node

/**
 * Environment Setup Script
 * Creates necessary directories and environment files
 */

const fs = require("fs");
const path = require("path");

const CONFIG = {
  envFile: path.join(__dirname, ".env"),
  envExampleFile: path.join(__dirname, ".env.example"),
  uploadsDir: path.join(__dirname, "../data/uploads"),
  strapiUploadsDir: path.join(__dirname, "../public/uploads"),
};

function createDirectories() {
  console.log("📁 Creating necessary directories...");

  const dirs = [CONFIG.uploadsDir, CONFIG.strapiUploadsDir];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    } else {
      console.log(`✅ Directory exists: ${dir}`);
    }
  }
}

function createEnvFile() {
  console.log("\n📝 Creating environment files...");

  const envContent = `# Strapi Configuration
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_api_token_here

# Optional: Set log level (debug, info, warn, error)
LOG_LEVEL=info

# Optional: Custom paths
# SQL_FILE=../data/khandaq_2025-10-22_162307.sql
# UPLOADS_DIR=../data/uploads
`;

  const envExampleContent = `# Strapi Configuration
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_api_token_here

# Optional: Set log level (debug, info, warn, error)
LOG_LEVEL=info

# Optional: Custom paths
# SQL_FILE=../data/khandaq_2025-10-22_162307.sql
# UPLOADS_DIR=../data/uploads
`;

  // Create .env.example
  if (!fs.existsSync(CONFIG.envExampleFile)) {
    fs.writeFileSync(CONFIG.envExampleFile, envExampleContent);
    console.log(`✅ Created: ${CONFIG.envExampleFile}`);
  }

  // Create .env if it doesn't exist
  if (!fs.existsSync(CONFIG.envFile)) {
    fs.writeFileSync(CONFIG.envFile, envContent);
    console.log(`✅ Created: ${CONFIG.envFile}`);
    console.log("⚠️  Please update the API token in .env file");
  } else {
    console.log(`✅ Environment file exists: ${CONFIG.envFile}`);
  }
}

function checkRequirements() {
  console.log("\n🔍 Checking requirements...");

  // Check Node.js version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);

  if (majorVersion >= 14) {
    console.log(`✅ Node.js version: ${nodeVersion}`);
  } else {
    console.error(
      `❌ Node.js version ${nodeVersion} is too old. Please upgrade to version 14 or higher.`
    );
    return false;
  }

  // Check if SQL file exists
  const sqlFile = path.join(__dirname, "../data/khandaq_2025-10-22_162307.sql");
  if (fs.existsSync(sqlFile)) {
    console.log("✅ SQL file found");
  } else {
    console.warn(`⚠️  SQL file not found: ${sqlFile}`);
    console.log(
      "   Please ensure your SQL dump file is in the correct location"
    );
  }

  return true;
}

function showNextSteps() {
  console.log("\n🎯 Next Steps:");
  console.log("1. Update the API token in .env file");
  console.log("2. Ensure your Strapi instance is running");
  console.log("3. Copy your media files to the uploads directory");
  console.log("4. Run tests: npm test");
  console.log("5. Run migration: npm run migrate");
  console.log("\n📚 For detailed instructions, see README.md");
}

async function setup() {
  console.log("🚀 Setting up migration environment...\n");

  if (!checkRequirements()) {
    console.error("\n❌ Setup failed - requirements not met");
    process.exit(1);
  }

  createDirectories();
  createEnvFile();
  showNextSteps();

  console.log("\n✅ Environment setup completed!");
}

// Run setup if this script is executed directly
if (require.main === module) {
  setup().catch(console.error);
}

module.exports = { setup, createDirectories, createEnvFile, checkRequirements };
