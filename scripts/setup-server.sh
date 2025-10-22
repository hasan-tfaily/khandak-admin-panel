#!/bin/bash

# Server Setup Script for Strapi Migration
# Run this on your server to prepare the migration environment

set -e

echo "🚀 Setting up server for Strapi migration..."

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p /var/www/khandak-admin-panel/data/uploads
mkdir -p /var/www/khandak-admin-panel/public/uploads

# Check if SQL file exists
if [ ! -f "/var/www/khandak-admin-panel/data/khandaq_2025-10-22_162307.sql" ]; then
    echo "❌ SQL file not found!"
    echo "Please copy your SQL file to: /var/www/khandak-admin-panel/data/khandaq_2025-10-22_162307.sql"
    echo ""
    echo "You can copy it using:"
    echo "scp /path/to/your/khandaq_2025-10-22_162307.sql your-server:/var/www/khandak-admin-panel/data/"
    exit 1
fi

# Check if uploads directory has files
if [ ! -d "/var/www/khandak-admin-panel/data/uploads" ] || [ -z "$(ls -A /var/www/khandak-admin-panel/data/uploads)" ]; then
    echo "⚠️  Uploads directory is empty!"
    echo "Please copy your media files to: /var/www/khandak-admin-panel/data/uploads/"
    echo ""
    echo "You can copy them using:"
    echo "scp -r /path/to/your/uploads/ your-server:/var/www/khandak-admin-panel/data/"
fi

# Set proper permissions
echo "🔐 Setting permissions..."
chown -R www-data:www-data /var/www/khandak-admin-panel/data/
chown -R www-data:www-data /var/www/khandak-admin-panel/public/uploads/
chmod -R 755 /var/www/khandak-admin-panel/data/
chmod -R 755 /var/www/khandak-admin-panel/public/uploads/

echo "✅ Server setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Ensure your Strapi instance is running"
echo "2. Update the API token in scripts/.env"
echo "3. Run: cd /var/www/khandak-admin-panel/scripts && npm test"
echo "4. Run: npm run migrate"
