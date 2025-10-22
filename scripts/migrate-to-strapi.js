#!/usr/bin/env node

/**
 * Strapi Migration Script
 * Migrates data from MySQL dump to Strapi CMS
 *
 * Usage: node scripts/migrate-to-strapi.js
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const SQLParser = require("./simple-sql-parser");

// Try to load server config, fallback to local config
let CONFIG;
try {
  const serverConfig = require("./server-config");
  CONFIG = serverConfig;
} catch (error) {
  // Fallback to local development config
  CONFIG = {
    sqlFile: path.join(__dirname, "../data/khandaq_2025-10-22_162307.sql"),
    uploadsDir: path.join(__dirname, "../data/uploads"),
    strapiUploadsDir: path.join(__dirname, "../public/uploads"),
    batchSize: 50,
    logLevel: "info",
  };
}

// Logging utility
const log = {
  debug: (msg) => CONFIG.logLevel === "debug" && console.log(`[DEBUG] ${msg}`),
  info: (msg) => console.log(`[INFO] ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`),
};

// SQL Parser is now imported from separate file

// Strapi API Client
class StrapiClient {
  constructor() {
    this.baseUrl = process.env.STRAPI_URL || "http://localhost:1337";
    this.apiToken = process.env.STRAPI_API_TOKEN;
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
      const formData = new FormData();
      const file = fs.createReadStream(filePath);
      formData.append("files", file);
      formData.append("alt", alt);

      const response = await fetch(`${this.baseUrl}/api/upload`, {
        method: "POST",
        headers: {
          ...(this.apiToken && { Authorization: `Bearer ${this.apiToken}` }),
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
        // Based on the SQL structure: id, name, image, about, created_at, updated_at
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
              const uploadResult = await this.strapi.uploadFile(
                imagePath,
                name
              );
              authorData.avatar = uploadResult[0].id;
            } catch (error) {
              log.warn(
                `Failed to upload author image for ${name}: ${error.message}`
              );
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
        // Based on the SQL structure: id, name, icon, created_at, updated_at, order, slug, description
        const [id, name, icon, createdAt, updatedAt, order, slug, description] =
          categoryRow;

        const categoryData = {
          name: name || "Unnamed Category",
          slug: slug || name?.toLowerCase().replace(/\s+/g, "-") || "unnamed",
          description: description || "",
          publishedAt: new Date().toISOString(),
        };

        const result = await this.strapi.createEntry(
          "categories",
          categoryData
        );
        this.categoryMap.set(parseInt(id), result.data.id);

        log.debug(`Created category: ${name} (ID: ${result.data.id})`);
      } catch (error) {
        log.error(
          `Failed to migrate category ${categoryRow[1]}: ${error.message}`
        );
      }
    }

    log.info(`Successfully migrated ${this.categoryMap.size} categories`);
  }

  async migrateArticles(postsData) {
    log.info(`Migrating ${postsData.length} articles...`);

    for (const postRow of postsData) {
      try {
        // Based on the SQL structure: id, title, description, content, image, author_id, category_id, created_at, updated_at, slug, edition_id
        const [
          id,
          title,
          description,
          content,
          image,
          authorId,
          categoryId,
          createdAt,
          updatedAt,
          slug,
          editionId,
        ] = postRow;

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
              const uploadResult = await this.strapi.uploadFile(
                imagePath,
                title
              );
              articleData.cover = uploadResult[0].id;
            } catch (error) {
              log.warn(
                `Failed to upload cover image for ${title}: ${error.message}`
              );
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
    log.info("Starting Strapi migration...");

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

    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(CONFIG.strapiUploadsDir)) {
      fs.mkdirSync(CONFIG.strapiUploadsDir, { recursive: true });
    }

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

module.exports = { runMigration, SQLParser, StrapiClient, DataMapper };
