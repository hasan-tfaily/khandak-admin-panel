#!/bin/bash

# Quick Start Script for Strapi Migration
# This script sets up and runs the migration process

set -e  # Exit on any error

echo "🚀 Strapi Migration Quick Start"
echo "================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the scripts directory"
    exit 1
fi

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Setup environment
echo "🔧 Setting up environment..."
npm run setup

# Step 3: Test the setup
echo "🧪 Testing setup..."
npm test

# Step 4: Ask if user wants to run migration
echo ""
echo "✅ Setup completed successfully!"
echo ""
read -p "Do you want to run the migration now? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔄 Starting migration..."
    npm run migrate
else
    echo "📋 To run the migration later, use: npm run migrate"
fi

echo ""
echo "🎉 Done! Check the logs above for any issues."
