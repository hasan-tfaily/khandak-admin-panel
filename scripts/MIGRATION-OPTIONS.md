# Migration Options Guide

You have several ways to migrate your data to Strapi. Choose the option that works best for your setup.

## 🎯 **Option 1: Local Migration (Recommended)**

Run migration from your local machine to remote Strapi server.

### **Advantages:**

- ✅ No need to copy files to server
- ✅ Uses your local data files
- ✅ Faster setup
- ✅ Easy to debug

### **Setup:**

```bash
cd scripts

# Install dependencies
npm install

# Create .env file with your server details
cat > .env << EOF
STRAPI_URL=http://your-server-ip:1337
STRAPI_API_TOKEN=your_api_token_here
LOG_LEVEL=info
EOF

# Test the setup
npm test

# Run migration
npm run migrate-local
```

### **Requirements:**

- Your Strapi server must be accessible from your local machine
- API token must be configured
- Network access to your server

---

## 🚀 **Option 2: Server Migration**

Copy files to server and run migration there.

### **Advantages:**

- ✅ Runs on the same network as Strapi
- ✅ Better for production environments
- ✅ No network latency for file uploads

### **Setup:**

```bash
# 1. Copy files to server
scp -r "/Users/hasantfaily/Desktop/untitled folder/my-cms/data/" your-server:/var/www/khandak-admin-panel/

# 2. SSH to server
ssh your-server

# 3. Run on server
cd /var/www/khandak-admin-panel/scripts
npm install
npm test
npm run migrate
```

---

## 🔄 **Option 3: Hybrid Approach**

Use local migration but with server file storage.

### **Setup:**

```bash
# 1. Copy only media files to server
scp -r "/Users/hasantfaily/Desktop/untitled folder/my-cms/data/uploads/" your-server:/var/www/khandak-admin-panel/public/uploads/

# 2. Run local migration (it will upload files to server)
cd scripts
npm run migrate-local
```

---

## 📋 **Quick Start Commands**

### **For Local Migration:**

```bash
cd scripts
npm install
echo "STRAPI_URL=http://your-server:1337" > .env
echo "STRAPI_API_TOKEN=your_token" >> .env
npm test
npm run migrate-local
```

### **For Server Migration:**

```bash
# Copy files
scp -r data/ your-server:/var/www/khandak-admin-panel/
# Then SSH and run migration
```

---

## 🔧 **Configuration Options**

### **Environment Variables:**

```bash
# .env file
STRAPI_URL=http://localhost:1337          # Your Strapi URL
STRAPI_API_TOKEN=your_token_here          # API token
LOG_LEVEL=info                           # debug, info, warn, error
```

### **Custom Paths:**

```javascript
// In migrate-local.js
const CONFIG = {
  sqlFile: "/path/to/your/sql/file.sql",
  uploadsDir: "/path/to/your/uploads",
  strapiUrl: "http://your-server:1337",
  // ...
};
```

---

## 🚨 **Troubleshooting**

### **"Connection refused"**

- Check if Strapi is running on your server
- Verify the URL in your .env file
- Check firewall settings

### **"Unauthorized"**

- Get a new API token from Strapi admin
- Update the token in your .env file

### **"File not found"**

- Verify your data files are in the correct location
- Check file permissions

### **"Upload failed"**

- Check if Strapi upload plugin is enabled
- Verify server has enough disk space
- Check file size limits

---

## 📊 **Performance Tips**

### **For Large Datasets:**

```bash
# Use batch processing
LOG_LEVEL=debug npm run migrate-local
```

### **For Slow Networks:**

```bash
# Reduce batch size in config
batchSize: 10
```

### **For Debugging:**

```bash
# Enable debug logging
LOG_LEVEL=debug npm run dev-local
```

---

## ✅ **Recommended Workflow**

1. **Start with local migration** (Option 1)
2. **Test with a small dataset first**
3. **Run full migration once everything works**
4. **Switch to server migration for production**

## 🎯 **Which Option Should You Choose?**

- **Local Migration**: If you have network access to your server
- **Server Migration**: If you want everything on the server
- **Hybrid**: If you want the best of both worlds

Choose **Option 1 (Local Migration)** - it's the easiest to set up and debug! 🚀
