# Copy Data Files to Server Guide

Since the data files are in `.gitignore`, they won't be pushed to your server. You need to manually copy them.

## 🚀 **Quick Copy Commands**

### **Option 1: Using the Copy Script**

1. **Edit the script** with your server details:

   ```bash
   nano scripts/copy-to-server.sh
   ```

2. **Update these variables:**

   ```bash
   SERVER_USER="your-username"
   SERVER_HOST="your-server-ip-or-domain"
   SERVER_PATH="/var/www/khandak-admin-panel"
   ```

3. **Run the script:**
   ```bash
   cd scripts
   ./copy-to-server.sh
   ```

### **Option 2: Manual Copy Commands**

Replace `your-server` with your actual server details:

```bash
# Copy SQL file
scp "/Users/hasantfaily/Desktop/untitled folder/my-cms/data/khandaq_2025-10-22_162307.sql" your-server:/var/www/khandak-admin-panel/data/

# Copy uploads directory
scp -r "/Users/hasantfaily/Desktop/untitled folder/my-cms/data/uploads/" your-server:/var/www/khandak-admin-panel/data/

# Set permissions on server
ssh your-server "chown -R www-data:www-data /var/www/khandak-admin-panel/data/ && chmod -R 755 /var/www/khandak-admin-panel/data/"
```

### **Option 3: Using rsync (Recommended for large files)**

```bash
# Copy everything at once
rsync -avz --progress "/Users/hasantfaily/Desktop/untitled folder/my-cms/data/" your-server:/var/www/khandak-admin-panel/data/

# Set permissions
ssh your-server "chown -R www-data:www-data /var/www/khandak-admin-panel/data/ && chmod -R 755 /var/www/khandak-admin-panel/data/"
```

## 🔧 **Server Setup After Copying**

Once files are copied, run on your server:

```bash
cd /var/www/khandak-admin-panel/scripts

# Test the setup
npm test

# Run migration
npm run migrate
```

## 📋 **File Structure on Server**

After copying, your server should have:

```
/var/www/khandak-admin-panel/
├── data/
│   ├── khandaq_2025-10-22_162307.sql
│   └── uploads/
│       ├── authors/
│       ├── categories/
│       └── [other media files]
├── scripts/
│   ├── migrate-to-strapi.js
│   ├── server-config.js
│   └── [other migration files]
└── public/
    └── uploads/
```

## 🚨 **Troubleshooting**

### "Permission denied"

```bash
# Fix SSH key or use password authentication
ssh-copy-id your-server
```

### "No such file or directory"

```bash
# Create directories first
ssh your-server "mkdir -p /var/www/khandak-admin-panel/data/uploads"
```

### "File too large"

```bash
# Use rsync with compression
rsync -avz --progress --compress-level=9 "/Users/hasantfaily/Desktop/untitled folder/my-cms/data/" your-server:/var/www/khandak-admin-panel/data/
```

## ✅ **Verification**

After copying, verify files are on the server:

```bash
ssh your-server "ls -la /var/www/khandak-admin-panel/data/"
ssh your-server "ls -la /var/www/khandak-admin-panel/data/uploads/"
```

You should see:

- `khandaq_2025-10-22_162307.sql` (16MB file)
- `uploads/` directory with media files
