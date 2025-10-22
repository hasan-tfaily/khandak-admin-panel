# Data Setup Guide

## 📁 Data Files (Not in Git)

The following files are **NOT** included in the repository for security and size reasons:

### Required Files:

- `data/khandaq_2025-10-22_162307.sql` - Your MySQL dump file
- `data/uploads/` - Directory containing all media files from your old system

## 🚀 Setting Up Data Files

### 1. Create the Data Directory

```bash
mkdir -p data/uploads
```

### 2. Add Your SQL Dump

Place your MySQL dump file in:

```
data/khandaq_2025-10-22_162307.sql
```

### 3. Add Media Files

Copy all media files from your old system to:

```
data/uploads/
```

The directory structure should look like:

```
data/
├── khandaq_2025-10-22_162307.sql
└── uploads/
    ├── authors/
    │   ├── November2021/
    │   └── December2021/
    ├── categories/
    │   └── November2021/
    └── posts/
        └── [other media files]
```

## 🔒 Security Notes

- **Never commit** SQL dump files to git
- **Never commit** media files to git
- Keep sensitive data files local to your development environment
- Use environment variables for database credentials

## 📋 Pre-Migration Checklist

Before running the migration, ensure:

- [ ] SQL dump file is in `data/khandaq_2025-10-22_162307.sql`
- [ ] Media files are in `data/uploads/` directory
- [ ] File paths in SQL data match actual file locations
- [ ] Strapi instance is running and accessible
- [ ] API token is configured in `.env` file

## 🧪 Testing Data Setup

Run the test script to verify your data is properly set up:

```bash
cd scripts
npm test
```

This will check:

- SQL file exists and is readable
- Media files are accessible
- Data structure is correct
- All required tables are present

## 🚨 Troubleshooting

### "SQL file not found"

- Ensure the file is exactly named `khandaq_2025-10-22_162307.sql`
- Check the file is in the `data/` directory
- Verify file permissions

### "Media files missing"

- Check that all image paths in the SQL data exist in `data/uploads/`
- Verify directory structure matches the paths in your database
- Ensure file permissions allow reading

### "Data structure issues"

- Verify your SQL dump is complete and not corrupted
- Check that all required tables (`authors`, `categories`, `posts`) exist
- Ensure data integrity in the source database

## 📦 Alternative: Using Docker

If you prefer to keep data files in a Docker volume:

```bash
# Create a data volume
docker volume create strapi-migration-data

# Mount the volume when running the migration
docker run -v strapi-migration-data:/app/data your-migration-image
```

## 🔄 Production Deployment

For production deployments:

1. **Secure Transfer**: Use `scp`, `rsync`, or secure cloud storage
2. **Environment Variables**: Store file paths in environment variables
3. **Backup**: Always backup your original data before migration
4. **Testing**: Test migration on a copy of production data first

## 📞 Support

If you need help with data setup:

1. Check the main README.md for detailed instructions
2. Run `npm test` to validate your setup
3. Review the migration logs for specific error messages
4. Ensure all file paths and permissions are correct
