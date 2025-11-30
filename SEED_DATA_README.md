# Seeding Test Data

This document explains how to populate the database with dummy test data for the "Validated by Users" platform.

## ⚠️ Important Notice

All test data is clearly marked with:
- `🧪 [TEST]` prefix in post titles
- Disclaimers in descriptions stating "This is a sample request for testing purposes only. No real product or prizes."
- A prominent warning banner on the feed page

## Methods to Seed Data

### Method 1: Using Node.js Script (Recommended)

Run the simple JavaScript seed script:

```bash
node seed-data-simple.js
```

This will:
- Create a test user profile
- Insert 10 diverse test posts across different categories
- Display a summary of inserted data

### Method 2: Using Supabase SQL Migration

The test data is also available as a SQL migration file that can be applied directly to your Supabase database:

```bash
# If you have Supabase CLI installed
supabase db push

# Or run the migration manually in Supabase Dashboard:
# 1. Go to your Supabase project dashboard
# 2. Navigate to SQL Editor
# 3. Copy and paste contents of: supabase/migrations/20251130000000_seed_test_data.sql
# 4. Execute the query
```

### Method 3: Manual Approach via Supabase Dashboard

1. Log into your Supabase dashboard
2. Go to SQL Editor
3. Copy the contents of `supabase/migrations/20251130000000_seed_test_data.sql`
4. Paste and execute

## Test Data Overview

The seed script creates **10 diverse test posts** covering:

### By Category:
- **Tech** (4 posts): Landing page review, task manager testing, API docs review, demo video feedback
- **Health & Wellness** (2 posts): Meditation app UX review, fitness app naming
- **Finance** (2 posts): A/B homepage test, pricing validation
- **Environment** (1 post): Carbon tracking concept validation
- **Social** (1 post): Feature prioritization survey
- **Developer Tools** (1 post): API documentation review

### By Effort Level:
- **Low effort** (< 5 min): 4 posts (£10-25 prizes)
- **Medium effort** (5-20 min): 4 posts (£20-100 prizes)
- **High effort** (30+ min): 2 posts (£150-250 prizes)

### Summary Statistics:
- Total posts: 10
- Total prize pool: £690
- Total mock entries: 392
- All posts set to "active" status
- End dates range from 1-10 days from insertion

## Verifying Test Data

After seeding, visit `/feed` to see all test posts displayed with:
- Clear [TEST] prefixes
- Yellow warning banner at top of feed
- All descriptions include disclaimer text

## Removing Test Data

To remove all test data:

```sql
-- Run this in Supabase SQL Editor
DELETE FROM posts WHERE title LIKE '%[TEST]%';
DELETE FROM profiles WHERE id = 'aaaaaaaa-bbbb-cccc-dddd-000000000001';
```

## Notes

- The test user ID is: `aaaaaaaa-bbbb-cccc-dddd-000000000001`
- All product links point to `https://example.com/test-*`
- Posts have realistic engagement numbers (entries) for demonstration
- No real prizes or products are involved
