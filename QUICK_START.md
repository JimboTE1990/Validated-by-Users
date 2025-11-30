# Quick Start: Populate Feed with Test Data

Your feed is showing no results because the database is empty. Here's the quickest way to populate it with test data.

## ✨ Fastest Method: Use Supabase Dashboard

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/ihmhzzlnumtzinvynncd
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of: `supabase/migrations/20251130000000_seed_test_data.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. You should see: `✅ Test data seeded successfully!`
8. Visit your deployed site and go to `/feed` - you should now see 10 test posts!

## 🔄 Alternative: Run Node.js Script

If you prefer to run from command line:

```bash
node seed-data-simple.js
```

Note: This requires network access to your Supabase instance.

## ⚠️ Important: Test Data Disclaimer

All test data is clearly marked:
- Every post title has `🧪 [TEST]` prefix
- Every description includes "⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes."
- The `/feed` page shows a prominent yellow warning banner stating these are test posts

## 📊 What You'll Get

**10 Diverse Test Posts:**

1. 🧪 [TEST] Help Us Validate Our Landing Page Copy - £15 prize (Tech)
2. 🧪 [TEST] Complete UX Review for Meditation App - £250 prize (Health & Wellness)
3. 🧪 [TEST] Quick A/B Test: Which Homepage Design? - £10 prize (Finance)
4. 🧪 [TEST] Validate Our Carbon Tracking App Concept - £75 prize (Environment)
5. 🧪 [TEST] Beta Testing: Find Bugs in Our Task Manager - £150 prize (Tech)
6. 🧪 [TEST] Vote: Which Features Should We Build First? - £20 prize (Social)
7. 🧪 [TEST] Review Our API Documentation - £100 prize (Developer Tools)
8. 🧪 [TEST] Does Our Pricing Make Sense? - £35 prize (Finance)
9. 🧪 [TEST] Help Us Pick a Name for Our Fitness App - £10 prize (Health & Wellness)
10. 🧪 [TEST] Watch Our Product Demo Video - £25 prize (Tech)

**Total Prize Pool:** £690
**Total Mock Entries:** 392
**Categories Covered:** 7 (Tech, Health & Wellness, Finance, Environment, Social, Developer Tools)

## 🚀 Deployment Status

Your app has been deployed to: https://validated-by-users-mfemiaiao-jimbote1990s-projects.vercel.app

Latest changes pushed to production include:
- ✅ Test data seeding scripts (SQL, JS, TS versions)
- ✅ Warning banner on feed page
- ✅ Improved Supabase client validation
- ✅ Comprehensive documentation

## 🗑️ Remove Test Data Later

When you're ready to remove the test data:

```sql
-- Run this in Supabase SQL Editor
DELETE FROM posts WHERE title LIKE '%[TEST]%';
DELETE FROM profiles WHERE id = 'aaaaaaaa-bbbb-cccc-dddd-000000000001';
```

## 📚 More Information

- **Detailed seeding instructions:** See `SEED_DATA_README.md`
- **Deployment guide:** See `DEPLOYMENT_INSTRUCTIONS.md`
- **Browser console method:** See `BROWSER_SEED_SCRIPT.js`

---

**Need Help?**
All files have been created and committed to the repository. The production build is complete and changes have been pushed to GitHub, which should trigger automatic Vercel deployment.
