#!/usr/bin/env node

/**
 * Local Migration Script
 * Runs migration from local machine to remote Strapi server
 */

const fs = require("fs");
const path = require("path");
const SQLParser = require("./sql-parser");

// Local configuration - runs from your machine
const CONFIG = {
  // Local file paths
  sqlFile: path.join(__dirname, "../data/khandaq_2025-10-22_162307.sql"),
  uploadsDir: path.join(__dirname, "../data/uploads"),
  
  // Remote Strapi server
  strapiUrl: process.env.STRAPI_URL || "http://your-server-ip:1337", // Update this
  apiToken: process.env.STRAPI_API_TOKEN,
  
  batchSize: 50,
  logLevel: "info",
};

// Logging utility
const log = {
  debug: (msg) => CONFIG.logLevel === "debug" && console.log(`[DEBUG] ${msg}`),
  info: (msg) => console.log(`[INFO] ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`),
};

// Strapi API Client
class StrapiClient {
  constructor() {
    this.baseUrl = CONFIG.strapiUrl;
    this.apiToken = CONFIG.apiToken;
  }

  async createEntry(contentType, data) {
    try {
      const response = await fetch(`${this.baseUrl}/api/${contentType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.apiToken && { Authorization: `Bearer ${this.apiToken}` }),
        },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      log.error(`Failed to create ${contentType}: ${error.message}`);
      throw error;
    }
  }

  async uploadFile(filePath, alt = "") {
    try {
      const FormData = require('form-data');
      const formData = new FormData();
      const file = fs.createReadStream(filePath);
      formData.append("files", file);
      formData.append("alt", alt);

      const response = await fetch(`${this.baseUrl}/api/upload`, {
        method: "POST",
        headers: {
          ...(this.apiToken && { Authorization: `Bearer ${this.apiToken}` }),
          ...formData.getHeaders(),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      log.error(`Failed to upload file ${filePath}: ${error.message}`);
      throw error;
    }
  }
}

// Data Mapper
class DataMapper {
  constructor(strapiClient) {
    this.strapi = strapiClient;
    this.authorMap = new Map();
    this.categoryMap = new Map();
  }

  async migrateAuthors(authorsData) {
    log.info(`Migrating ${authorsData.length} authors...`);

    for (const authorRow of authorsData) {
      try {
        const [id, name, image, about, createdAt, updatedAt] = authorRow;

        const authorData = {
          name: name || "Unknown Author",
          title: about || "",
          publishedAt: new Date().toISOString(),
        };

        // Handle image if exists
        if (image && image !== "NULL") {
          const imagePath = path.join(CONFIG.uploadsDir, image);
          if (fs.existsSync(imagePath)) {
            try {
              const uploadResult = await this.strapi.uploadFile(imagePath, name);
              authorData.avatar = uploadResult[0].id;
            } catch (error) {
              log.warn(`Failed to upload author image for ${name}: ${error.message}`);
            }
          } else {
            log.warn(`Author image not found: ${imagePath}`);
          }
        }

        const result = await this.strapi.createEntry("authors", authorData);
        this.authorMap.set(parseInt(id), result.data.id);

        log.debug(`Created author: ${name} (ID: ${result.data.id})`);
      } catch (error) {
        log.error(`Failed to migrate author ${authorRow[1]}: ${error.message}`);
      }
    }

    log.info(`Successfully migrated ${this.authorMap.size} authors`);
  }

  async migrateCategories(categoriesData) {
    log.info(`Migrating ${categoriesData.length} categories...`);

    for (const categoryRow of categoriesData) {
      try {
        const [id, name, icon, createdAt, updatedAt, order, slug, description] = categoryRow;

        const categoryData = {
          name: name || "Unnamed Category",
          slug: slug || name?.toLowerCase().replace(/\s+/g, "-") || "unnamed",
          description: description || "",
          publishedAt: new Date().toISOString(),
        };

        const result = await this.strapi.createEntry("categories", categoryData);
        this.categoryMap.set(parseInt(id), result.data.id);

        log.debug(`Created category: ${name} (ID: ${result.data.id})`);
      } catch (error) {
        log.error(`Failed to migrate category ${categoryRow[1]}: ${error.message}`);
      }
    }

    log.info(`Successfully migrated ${this.categoryMap.size} categories`);
  }

  async migrateArticles(postsData) {
    log.info(`Migrating ${postsData.length} articles...`);

    for (const postRow of postsData) {
      try {
        const [id, title, description, content, image, authorId, categoryId, createdAt, updatedAt, slug, editionId] = postRow;

        const articleData = {
          title: title || "Untitled Article",
          description: description || "",
          slug: slug || title?.toLowerCase().replace(/\s+/g, "-") || "untitled",
          datePublished: createdAt || new Date().toISOString(),
          publishedAt: new Date().toISOString(),
        };

        // Map author
        if (authorId && this.authorMap.has(parseInt(authorId))) {
          articleData.author = this.authorMap.get(parseInt(authorId));
        }

        // Map category
        if (categoryId && this.categoryMap.has(parseInt(categoryId))) {
          articleData.category = this.categoryMap.get(parseInt(categoryId));
        }

        // Handle cover image
        if (image && image !== "NULL") {
          const imagePath = path.join(CONFIG.uploadsDir, image);
          if (fs.existsSync(imagePath)) {
            try {
              const uploadResult = await this.strapi.uploadFile(imagePath, title);
              articleData.cover = uploadResult[0].id;
            } catch (error) {
              log.warn(`Failed to upload cover image for ${title}: ${error.message}`);
            }
          } else {
            log.warn(`Article image not found: ${imagePath}`);
          }
        }

        // Convert content to blocks
        if (content && content !== "NULL") {
          articleData.blocks = [
            {
              __component: "shared.rich-text",
              body: content,
            },
          ];
        }

        await this.strapi.createEntry("articles", articleData);
        log.debug(`Created article: ${title}`);
      } catch (error) {
        log.error(`Failed to migrate article ${postRow[1]}: ${error.message}`);
      }
    }

    log.info("Article migration completed");
  }
}

// Main migration function
async function runMigration() {
  try {
    log.info("Starting local migration to remote Strapi...");

    // Check if SQL file exists
    if (!fs.existsSync(CONFIG.sqlFile)) {
      throw new Error(`SQL file not found: ${CONFIG.sqlFile}`);
    }

    // Read and parse SQL file
    const sqlContent = fs.readFileSync(CONFIG.sqlFile, "utf8");
    const parser = new SQLParser(sqlContent);
    const tables = parser.parse();

    // Initialize Strapi client
    const strapiClient = new StrapiClient();
    const mapper = new DataMapper(strapiClient);

    // Migrate data in order
    if (tables.authors && tables.authors.data.length > 0) {
      await mapper.migrateAuthors(tables.authors.data);
    }

    if (tables.categories && tables.categories.data.length > 0) {
      await mapper.migrateCategories(tables.categories.data);
    }

    if (tables.posts && tables.posts.data.length > 0) {
      await mapper.migrateArticles(tables.posts.data);
    }

    log.info("Migration completed successfully!");
  } catch (error) {
    log.error(`Migration failed: ${error.message}`);
    process.exit(1);
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration, StrapiClient, DataMapper };
