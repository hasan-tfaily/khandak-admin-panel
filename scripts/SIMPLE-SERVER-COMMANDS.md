# 🚀 Simple Server Migration Commands

## **Run These Commands on Your Server:**

```bash
# 1. SSH to your server
ssh app@46.62.165.97

# 2. Navigate to project
cd /var/www/khandak-admin-panel

# 3. Pull latest changes (including SQL file)
git pull origin data-migration

# 4. Go to scripts directory
cd scripts

# 5. Install dependencies
npm install

# 6. Test the setup
npm test

# 7. Run migration
npm run migrate

# 8. Remove SQL file after migration
rm -f data/khandaq_2025-10-22_162307.sql

# 9. Commit removal
git add data/khandaq_2025-10-22_162307.sql
git commit -m "Remove SQL file after migration"
```

## **What This Will Do:**

1. ✅ **Pull SQL file** from git
2. ✅ **Install dependencies** 
3. ✅ **Test setup** (should show 242 authors, 10 categories)
4. ✅ **Run migration** to Strapi
5. ✅ **Remove SQL file** 
6. ✅ **Commit removal**

## **Expected Results:**

- **242 authors** created in Strapi
- **10 categories** created in Strapi  
- **Articles** created with relationships
- **SQL file removed** from repository

## **Ready to Run!**

Just copy and paste these commands on your server! 🚀
