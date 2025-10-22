#!/bin/bash

# Copy Data Files to Server Script
# This script helps you copy the data files to your server

set -e

# Configuration - UPDATE THESE VALUES
SERVER_USER="your-username"
SERVER_HOST="your-server-ip-or-domain"
SERVER_PATH="/var/www/khandak-admin-panel"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Copying data files to server...${NC}"

# Check if files exist locally
if [ ! -f "../data/khandaq_2025-10-22_162307.sql" ]; then
    echo -e "${RED}❌ SQL file not found locally!${NC}"
    exit 1
fi

if [ ! -d "../data/uploads" ]; then
    echo -e "${RED}❌ Uploads directory not found locally!${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Please update the server details in this script:${NC}"
echo "   SERVER_USER: $SERVER_USER"
echo "   SERVER_HOST: $SERVER_HOST"
echo "   SERVER_PATH: $SERVER_PATH"
echo ""

read -p "Have you updated the server details? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⚠️  Please update the server details and run again.${NC}"
    exit 1
fi

# Create directories on server
echo -e "${GREEN}📁 Creating directories on server...${NC}"
ssh $SERVER_USER@$SERVER_HOST "mkdir -p $SERVER_PATH/data/uploads"

# Copy SQL file
echo -e "${GREEN}📄 Copying SQL file...${NC}"
scp "../data/khandaq_2025-10-22_162307.sql" $SERVER_USER@$SERVER_HOST:$SERVER_PATH/data/

# Copy uploads directory
echo -e "${GREEN}🖼️  Copying uploads directory...${NC}"
scp -r "../data/uploads/" $SERVER_USER@$SERVER_HOST:$SERVER_PATH/data/

# Set permissions on server
echo -e "${GREEN}🔐 Setting permissions...${NC}"
ssh $SERVER_USER@$SERVER_HOST "chown -R www-data:www-data $SERVER_PATH/data/ && chmod -R 755 $SERVER_PATH/data/"

echo -e "${GREEN}✅ Files copied successfully!${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps on your server:${NC}"
echo "1. cd $SERVER_PATH/scripts"
echo "2. npm test"
echo "3. npm run migrate"
