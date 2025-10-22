#!/usr/bin/env node

/**
 * Test Migration Script
 * Validates the migration setup and tests data parsing
 */

const fs = require("fs");
const path = require("path");
const SQLParser = require("./sql-parser");

const CONFIG = {
  sqlFile: path.join(__dirname, "../data/khandaq_2025-10-22_162307.sql"),
  uploadsDir: path.join(__dirname, "../data/uploads"),
};

function testSetup() {
  console.log("🔍 Testing migration setup...\n");

  // Check SQL file
  if (!fs.existsSync(CONFIG.sqlFile)) {
    console.error("❌ SQL file not found:", CONFIG.sqlFile);
    return false;
  }
  console.log("✅ SQL file found");

  // Check uploads directory
  if (!fs.existsSync(CONFIG.uploadsDir)) {
    console.warn("⚠️  Uploads directory not found:", CONFIG.uploadsDir);
    console.log("   Media files may not be migrated properly");
  } else {
    console.log("✅ Uploads directory found");
  }

  return true;
}

function testSQLParsing() {
  console.log("\n🔍 Testing SQL parsing...");

  try {
    const sqlContent = fs.readFileSync(CONFIG.sqlFile, "utf8");
    const parser = new SQLParser(sqlContent);
    const tables = parser.parse();

    console.log(`✅ Parsed ${Object.keys(tables).length} tables`);

    // Test specific tables
    const importantTables = ["authors", "categories", "posts"];

    for (const tableName of importantTables) {
      if (tables[tableName]) {
        const recordCount = tables[tableName].data.length;
        console.log(`✅ Table '${tableName}': ${recordCount} records`);

        // Show sample data
        if (recordCount > 0) {
          const sample = tables[tableName].data[0];
          console.log(
            `   Sample record: ${JSON.stringify(sample.slice(0, 3))}...`
          );
        }
      } else {
        console.warn(`⚠️  Table '${tableName}' not found`);
      }
    }

    return tables;
  } catch (error) {
    console.error("❌ SQL parsing failed:", error.message);
    return null;
  }
}

function testDataStructure(tables) {
  console.log("\n🔍 Testing data structure...");

  if (!tables) {
    console.error("❌ No tables to test");
    return false;
  }

  // Test authors structure
  if (tables.authors && tables.authors.data.length > 0) {
    const sample = tables.authors.data[0];
    console.log("✅ Authors table structure:");
    console.log(`   Fields: ${sample.length} columns`);
    console.log(
      `   Sample: ID=${sample[0]}, Name=${sample[1]}, Image=${sample[2]}`
    );
  }

  // Test categories structure
  if (tables.categories && tables.categories.data.length > 0) {
    const sample = tables.categories.data[0];
    console.log("✅ Categories table structure:");
    console.log(`   Fields: ${sample.length} columns`);
    console.log(
      `   Sample: ID=${sample[0]}, Name=${sample[1]}, Slug=${sample[6]}`
    );
  }

  // Test posts structure
  if (tables.posts && tables.posts.data.length > 0) {
    const sample = tables.posts.data[0];
    console.log("✅ Posts table structure:");
    console.log(`   Fields: ${sample.length} columns`);
    console.log(
      `   Sample: ID=${sample[0]}, Title=${sample[1]?.substring(0, 50)}...`
    );
  }

  return true;
}

function testMediaFiles(tables) {
  console.log("\n🔍 Testing media files...");

  if (!fs.existsSync(CONFIG.uploadsDir)) {
    console.warn(
      "⚠️  Uploads directory not found - media files will not be migrated"
    );
    return false;
  }

  let mediaFilesFound = 0;
  let mediaFilesMissing = 0;

  // Check author images
  if (tables.authors) {
    for (const author of tables.authors.data.slice(0, 5)) {
      // Check first 5 authors
      const imagePath = author[2]; // image field
      if (imagePath && imagePath !== "NULL") {
        const fullPath = path.join(CONFIG.uploadsDir, imagePath);
        if (fs.existsSync(fullPath)) {
          mediaFilesFound++;
        } else {
          mediaFilesMissing++;
          console.log(`⚠️  Missing author image: ${imagePath}`);
        }
      }
    }
  }

  console.log(
    `✅ Media files: ${mediaFilesFound} found, ${mediaFilesMissing} missing`
  );
  return mediaFilesMissing === 0;
}

async function runTests() {
  console.log("🚀 Starting migration tests...\n");

  // Test 1: Setup
  if (!testSetup()) {
    console.error("\n❌ Setup test failed");
    process.exit(1);
  }

  // Test 2: SQL Parsing
  const tables = testSQLParsing();
  if (!tables) {
    console.error("\n❌ SQL parsing test failed");
    process.exit(1);
  }

  // Test 3: Data Structure
  if (!testDataStructure(tables)) {
    console.error("\n❌ Data structure test failed");
    process.exit(1);
  }

  // Test 4: Media Files
  testMediaFiles(tables);

  console.log("\n✅ All tests completed!");
  console.log("\n📋 Migration Summary:");
  console.log(`   - Authors: ${tables.authors?.data.length || 0} records`);
  console.log(
    `   - Categories: ${tables.categories?.data.length || 0} records`
  );
  console.log(`   - Posts: ${tables.posts?.data.length || 0} records`);
  console.log("\n🎯 Ready to run migration with: npm run migrate");
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  runTests,
  testSetup,
  testSQLParsing,
  testDataStructure,
  testMediaFiles,
};
