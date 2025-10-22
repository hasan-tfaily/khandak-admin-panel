# Strapi Migration Scripts

This directory contains scripts to migrate data from your MySQL database dump to Strapi CMS.

## Overview

The migration script will:

- Parse your MySQL dump file (`khandaq_2025-10-22_162307.sql`)
- Extract data from `authors`, `categories`, and `posts` tables
- Create corresponding entries in Strapi
- Handle media file uploads
- Map relationships between authors, articles, and categories

## Prerequisites

1. **Node.js** (version 14 or higher)
2. **Strapi CMS** running and accessible
3. **Media files** from your old system (in `data/uploads/` directory)

## Setup

### 1. Install Dependencies

```bash
cd scripts
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the scripts directory:

```bash
# Strapi Configuration
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_api_token_here

# Optional: Set log level
LOG_LEVEL=info
```

### 3. Prepare Your Data

Ensure the following files exist:

- `../data/khandaq_2025-10-22_162307.sql` - Your MySQL dump file
- `../data/uploads/` - Directory containing all media files from your old system

## Running the Migration

### Basic Migration

```bash
npm run migrate
```

### With Custom Configuration

You can modify the configuration in `migrate-to-strapi.js`:

```javascript
const CONFIG = {
  sqlFile: path.join(__dirname, "../data/khandaq_2025-10-22_162307.sql"),
  uploadsDir: path.join(__dirname, "../data/uploads"),
  strapiUploadsDir: path.join(__dirname, "../public/uploads"),
  batchSize: 50,
  logLevel: "info",
};
```

## What Gets Migrated

### Authors

- **Source**: `authors` table
- **Target**: Strapi `authors` content type
- **Fields Mapped**:
  - `name` → `name`
  - `about` → `title`
  - `image` → `avatar` (uploaded to Strapi media library)

### Categories

- **Source**: `categories` table
- **Target**: Strapi `categories` content type
- **Fields Mapped**:
  - `name` → `name`
  - `slug` → `slug`
  - `description` → `description`

### Articles

- **Source**: `posts` table
- **Target**: Strapi `articles` content type
- **Fields Mapped**:
  - `title` → `title`
  - `description` → `description`
  - `content` → `blocks` (rich text component)
  - `image` → `cover` (uploaded to Strapi media library)
  - `author_id` → `author` (relation)
  - `category_id` → `category` (relation)
  - `slug` → `slug`
  - `created_at` → `datePublished`

## Troubleshooting

### Common Issues

1. **"SQL file not found"**

   - Ensure the SQL file is in the correct location: `../data/khandaq_2025-10-22_162307.sql`

2. **"Failed to upload file"**

   - Check that media files exist in `../data/uploads/`
   - Verify file paths in the SQL data match actual file locations

3. **"HTTP 401: Unauthorized"**

   - Check your Strapi API token
   - Ensure Strapi is running and accessible

4. **"Failed to create entry"**
   - Verify your Strapi content types are properly configured
   - Check that required fields are not missing

### Debug Mode

Run with debug logging:

```bash
LOG_LEVEL=debug npm run migrate
```

### Testing the Migration

You can test the migration on a subset of data by modifying the script to limit the number of records processed.

## File Structure

```
scripts/
├── migrate-to-strapi.js    # Main migration script
├── sql-parser.js          # SQL parsing utilities
├── package.json           # Dependencies
└── README.md             # This file

data/
├── khandaq_2025-10-22_162307.sql  # MySQL dump
└── uploads/                        # Media files
    ├── authors/
    ├── categories/
    └── posts/
```

## Advanced Configuration

### Custom Field Mapping

To modify how fields are mapped, edit the migration functions in `migrate-to-strapi.js`:

```javascript
// Example: Custom author mapping
const authorData = {
  name: name || "Unknown Author",
  title: about || "",
  // Add custom fields here
  customField: someValue,
  publishedAt: new Date().toISOString(),
};
```

### Batch Processing

For large datasets, the script processes data in batches. Adjust the `batchSize` in the configuration:

```javascript
const CONFIG = {
  batchSize: 100, // Process 100 records at a time
  // ... other config
};
```

## Support

If you encounter issues:

1. Check the logs for specific error messages
2. Verify your Strapi content types match the expected schema
3. Ensure all media files are accessible
4. Test with a small subset of data first

## Post-Migration

After successful migration:

1. **Verify Data**: Check that all content appears correctly in Strapi admin
2. **Test Relationships**: Ensure author and category relationships work
3. **Check Media**: Verify all images and files are properly uploaded
4. **Update URLs**: Update any hardcoded URLs to point to your new Strapi instance
