#!/bin/bash

# Run Migration on Server Script
# This script runs the migration on the server and then removes the SQL file

set -e

echo "🚀 Running migration on server..."

# Pull latest changes (including SQL file)
echo "📥 Pulling latest changes..."
git pull origin data-migration

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Test the setup
echo "🧪 Testing setup..."
npm test

# Run migration
echo "🔄 Running migration..."
npm run migrate

# Remove SQL file after migration
echo "🗑️  Removing SQL file..."
rm -f data/khandaq_2025-10-22_162307.sql

# Commit removal
echo "💾 Committing removal..."
git add data/khandaq_2025-10-22_162307.sql
git commit -m "Remove SQL file after migration" || true

echo "✅ Migration completed successfully!"
echo "📋 Summary:"
echo "   - Authors migrated"
echo "   - Categories migrated" 
echo "   - Articles migrated"
echo "   - SQL file removed"
