# Deployment Instructions

## Quick Deploy to Production

Since you mentioned the feed is returning no results and you want dummy test data, here are the steps to deploy the updated app with test data:

### Step 1: Seed the Test Data

The easiest way to seed test data is to run this directly in your browser console when logged into the app:

1. Open your deployed site at https://validated-by-users-mfemiaiao-jimbote1990s-projects.vercel.app
2. Open browser Developer Tools (F12)
3. Go to the Console tab
4. Paste and run the following code:

```javascript
// Seed Test Data - Run this in browser console
(async function seedTestData() {
  const { data: categories } = await window.supabase
    .from('categories')
    .select('id, name');

  const categoryMap = Object.fromEntries(
    categories.map(cat => [cat.name, cat.id])
  );

  const testUserId = 'aaaaaaaa-bbbb-cccc-dddd-000000000001';

  // Create test user profile
  await window.supabase
    .from('profiles')
    .upsert({
      id: testUserId,
      first_name: 'Test',
      last_name: 'User',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test'
    });

  const testPosts = [
    {
      title: '🧪 [TEST] Help Us Validate Our Landing Page Copy',
      description: 'Looking for honest feedback on our SaaS landing page. Quick 5-minute review needed.',
      full_description: 'We need feedback on our landing page design and copy. ⚠️ TEST DATA: Sample request for testing purposes only.',
      product_link: 'https://example.com/test-landing',
      prize_pool: 15,
      category_id: categoryMap['Tech'],
      author_id: testUserId,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      max_entries: 100,
      current_entries: 12
    },
    {
      title: '🧪 [TEST] Complete UX Review for Meditation App',
      description: 'Comprehensive E2E review needed for our meditation app.',
      full_description: 'Need thorough testing of our meditation app. ⚠️ TEST DATA: Sample request for testing purposes only.',
      product_link: 'https://example.com/test-meditation',
      prize_pool: 250,
      category_id: categoryMap['Health & Wellness'],
      author_id: testUserId,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      max_entries: 50,
      current_entries: 8
    },
    {
      title: '🧪 [TEST] Quick A/B Test: Which Homepage Design?',
      description: 'Compare two homepage designs for our budgeting app.',
      full_description: 'Help us choose between two designs. ⚠️ TEST DATA: Sample request for testing purposes only.',
      product_link: 'https://example.com/test-ab',
      prize_pool: 10,
      category_id: categoryMap['Finance'],
      author_id: testUserId,
      start_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      max_entries: 200,
      current_entries: 45
    },
    {
      title: '🧪 [TEST] Validate Carbon Tracking App Concept',
      description: 'Looking for feedback on our carbon footprint tracker.',
      full_description: 'Early stage validation needed. ⚠️ TEST DATA: Sample request for testing purposes only.',
      product_link: 'https://example.com/test-carbon',
      prize_pool: 75,
      category_id: categoryMap['Environment'],
      author_id: testUserId,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      max_entries: 75,
      current_entries: 22
    },
    {
      title: '🧪 [TEST] Beta Test Our Task Manager',
      description: 'Help us find bugs in our task management app.',
      full_description: 'Bug testing needed before launch. ⚠️ TEST DATA: Sample request for testing purposes only.',
      product_link: 'https://example.com/test-tasks',
      prize_pool: 150,
      category_id: categoryMap['Tech'],
      author_id: testUserId,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      max_entries: 60,
      current_entries: 15
    },
    {
      title: '🧪 [TEST] Feature Prioritization Survey',
      description: 'Rank features for our community platform.',
      full_description: 'Help us decide our roadmap. ⚠️ TEST DATA: Sample request for testing purposes only.',
      product_link: 'https://example.com/test-features',
      prize_pool: 20,
      category_id: categoryMap['Social'],
      author_id: testUserId,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      max_entries: 150,
      current_entries: 67
    },
    {
      title: '🧪 [TEST] Review Our API Documentation',
      description: 'Developer feedback needed on our API docs.',
      full_description: 'Is our API documentation clear? ⚠️ TEST DATA: Sample request for testing purposes only.',
      product_link: 'https://example.com/test-api',
      prize_pool: 100,
      category_id: categoryMap['Developer Tools'],
      author_id: testUserId,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      max_entries: 40,
      current_entries: 5
    },
    {
      title: '🧪 [TEST] Pricing Strategy Feedback',
      description: 'Does our pricing make sense?',
      full_description: 'Review our pricing tiers. ⚠️ TEST DATA: Sample request for testing purposes only.',
      product_link: 'https://example.com/test-pricing',
      prize_pool: 35,
      category_id: categoryMap['Finance'],
      author_id: testUserId,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      max_entries: 120,
      current_entries: 28
    },
    {
      title: '🧪 [TEST] Name Our Fitness App',
      description: 'Vote for your favorite name option.',
      full_description: 'Quick poll on app naming. ⚠️ TEST DATA: Sample request for testing purposes only.',
      product_link: 'https://example.com/test-naming',
      prize_pool: 10,
      category_id: categoryMap['Health & Wellness'],
      author_id: testUserId,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      max_entries: 300,
      current_entries: 156
    },
    {
      title: '🧪 [TEST] Product Demo Video Feedback',
      description: 'Watch our demo video and share feedback.',
      full_description: 'Is our value proposition clear? ⚠️ TEST DATA: Sample request for testing purposes only.',
      product_link: 'https://example.com/test-demo',
      prize_pool: 25,
      category_id: categoryMap['Tech'],
      author_id: testUserId,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      max_entries: 100,
      current_entries: 34
    }
  ];

  const { data, error } = await window.supabase
    .from('posts')
    .insert(testPosts)
    .select();

  if (error) {
    console.error('Error:', error);
  } else {
    console.log(`✅ Successfully inserted ${data.length} test posts!`);
    console.log('Refresh the page to see them in the feed.');
  }
})();
```

Note: You'll need to access the supabase client. If it's not available on window, you can import it in the console or run this through the app's dev tools.

### Step 2: Deploy to Vercel

The app has already been built successfully. To deploy to production:

```bash
# Login to Vercel (if not already)
vercel login

# Deploy to production
vercel --prod
```

OR if you want to just push code and let Vercel auto-deploy:

```bash
# Push to your git repository
git add .
git commit -m "Add test data seeding scripts and update feed with test disclaimer"
git push origin main
```

Vercel will automatically deploy if you have it connected to your git repository.

### Alternative: Use the Seed Script Locally

If you prefer to run the seed script from your local machine:

1. Ensure your `.env` file has the correct Supabase credentials
2. Run the seed script:

```bash
node seed-data-simple.js
```

### Alternative: Use Supabase Dashboard SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy contents of `supabase/migrations/20251130000000_seed_test_data.sql`
4. Paste and execute

## What's Been Done

✅ Created seed data scripts with 10 diverse test posts
✅ All posts clearly marked with [TEST] prefix
✅ Feed page has prominent test data disclaimer banner
✅ Production build completed successfully
✅ Created documentation for seeding and deployment

## Test Data Summary

- **10 test posts** across 7 categories
- Total prize pool: **£690**
- Mix of low, medium, and high effort tasks
- All clearly marked as test data
- Realistic engagement numbers for demonstration

## Verification

After deploying:
1. Visit `/feed` page
2. You should see 10 test posts
3. Warning banner should be visible at the top
4. All post titles should have 🧪 [TEST] prefix

## Cleanup

To remove test data later:

```sql
DELETE FROM posts WHERE title LIKE '%[TEST]%';
DELETE FROM profiles WHERE id = 'aaaaaaaa-bbbb-cccc-dddd-000000000001';
```
