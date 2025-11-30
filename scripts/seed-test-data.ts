/**
 * Seed Test Data Script
 *
 * This script populates the database with dummy test posts for demonstration purposes.
 * ⚠️ WARNING: All data created is clearly marked as TEST data
 *
 * To run this script:
 * 1. Ensure you have valid Supabase credentials in your .env file
 * 2. Run: npx tsx scripts/seed-test-data.ts
 */

import { createClient } from '@supabase/supabase-js';

// You'll need to provide these from your .env or directly
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seedTestData() {
  console.log('🌱 Starting to seed test data...\n');

  try {
    // Get categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name');

    if (catError) throw catError;

    const categoryMap = Object.fromEntries(
      categories?.map(cat => [cat.name, cat.id]) || []
    );

    console.log('✅ Found categories:', Object.keys(categoryMap).join(', '));

    // Create a test user profile
    const testUserId = 'aaaaaaaa-bbbb-cccc-dddd-000000000001';

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: testUserId,
        first_name: 'Test',
        last_name: 'User',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test'
      });

    if (profileError) {
      console.log('ℹ️  Note: Could not create test user profile (may already exist or need admin access)');
    } else {
      console.log('✅ Test user profile created');
    }

    // Define test posts
    const testPosts = [
      {
        title: '🧪 [TEST] Help Us Validate Our Landing Page Copy',
        description: 'Looking for honest feedback on our SaaS landing page. Does the value proposition resonate? Is the CTA clear? Quick 5-minute review needed.',
        full_description: `We've just redesigned our landing page for our new project management tool. We need feedback on:

- First impressions and overall clarity
- Whether the value proposition is compelling
- If the pricing is clearly presented
- Any confusing sections or unclear messaging

This is a low-effort task - just visit the site and share your thoughts in 3-5 sentences.

⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.`,
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
        description: 'Seeking comprehensive E2E review of our new meditation and wellness app. Test all core features, onboarding flow, and subscription process.',
        full_description: `We're launching a new meditation app and need thorough feedback on the entire user experience.

What we need reviewed:
- Complete onboarding flow (sign up, profile setup)
- Core meditation sessions (audio quality, UI/UX)
- Progress tracking and achievements system
- Subscription flow and pricing page
- Overall app navigation and ease of use
- Any bugs or issues you encounter

This is a high-effort review requiring 30-45 minutes of thorough testing.

⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.`,
        product_link: 'https://example.com/test-meditation-app',
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
        description: 'Simple A/B test comparing two homepage designs for our budgeting app. Vote for your favorite and share why in 2-3 sentences.',
        full_description: `We have two different homepage designs for our personal finance app and can't decide which one resonates better.

Your task:
- View both Design A and Design B
- Choose which one you prefer
- Explain your choice in 2-3 sentences

Super quick task - should take less than 5 minutes!

⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.`,
        product_link: 'https://example.com/test-finance-ab',
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
        title: '🧪 [TEST] Validate Our Carbon Tracking App Concept',
        description: 'We\'re building an app to help people track their carbon footprint. Looking for feedback on our core concept and features.',
        full_description: `We're in the early stages of building a carbon footprint tracking app and need market validation.

What we're looking for:
- Your initial reaction to the concept
- Would this solve a real problem for you?
- Feedback on our planned features list
- What would make you actually use this daily?

Review our pitch deck and feature mockups, then provide detailed thoughts.

⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.`,
        product_link: 'https://example.com/test-carbon-tracker',
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
        title: '🧪 [TEST] Beta Testing: Find Bugs in Our Task Manager',
        description: 'Help us squash bugs! Test our new task management app and report any issues, crashes, or UX problems you encounter.',
        full_description: `We're about to launch our task management app and need help identifying bugs before public release.

Testing checklist:
- Create, edit, and delete tasks
- Test recurring tasks feature
- Try team collaboration features
- Report any crashes or errors

We need detailed bug reports with steps to reproduce.

⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.`,
        product_link: 'https://example.com/test-task-app',
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
        title: '🧪 [TEST] Vote: Which Features Should We Build First?',
        description: 'Quick survey - rank 5 potential features for our community platform. Help us decide what to prioritize.',
        full_description: `We're building a new community platform and need help prioritizing features.

Your task:
- Review our list of 5 potential features
- Rank them from most to least valuable
- Share your top reason for your #1 choice

Super quick - takes 3 minutes max!

⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.`,
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
        description: 'Calling developers! Review our new API docs. Is everything clear? Are the code examples helpful?',
        full_description: `We've just released the first version of our API documentation and need developer feedback.

What to review:
- Overall clarity and organization
- Quality of code examples
- Are authentication steps clear?
- Any confusing or missing information?

Ideal for developers familiar with REST APIs. Should take 15-20 minutes.

⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.`,
        product_link: 'https://example.com/test-api-docs',
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
        title: '🧪 [TEST] Does Our Pricing Make Sense?',
        description: 'We need honest feedback on our pricing tiers for our invoicing software. Too expensive? Too cheap?',
        full_description: `We're finalizing pricing for our invoicing and billing software.

Your feedback:
- Review our 3 pricing tiers (Starter, Pro, Enterprise)
- Do the prices seem fair for the features?
- Which tier would you choose and why?
- What would make you upgrade to a higher tier?

Quick task - 5-10 minutes.

⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.`,
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
        title: '🧪 [TEST] Help Us Pick a Name for Our Fitness App',
        description: 'Super quick poll - we have 4 name options for our new fitness tracking app. Vote for your favorite!',
        full_description: `We're stuck choosing between 4 names for our fitness tracking app.

Your task:
- Review the 4 name options
- Vote for your favorite
- Share your first impression in 1-2 sentences

Literally takes 2 minutes!

⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.`,
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
        title: '🧪 [TEST] Watch Our Product Demo Video - Is It Clear?',
        description: 'We created a 3-minute product demo video. Watch it and let us know: is our product\'s value clear?',
        full_description: `We've created a demo video to explain what our productivity tool does.

What we need:
- Watch the 3-minute video
- Did you understand what the product does?
- Was the value proposition clear?
- Any parts that were confusing?

Quick task - just 5-7 minutes total.

⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.`,
        product_link: 'https://example.com/test-demo-video',
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

    // Insert posts
    console.log('\n📝 Inserting test posts...');
    const { data: insertedPosts, error: postsError } = await supabase
      .from('posts')
      .insert(testPosts)
      .select();

    if (postsError) {
      console.error('❌ Error inserting posts:', postsError);
      throw postsError;
    }

    console.log(`✅ Successfully inserted ${insertedPosts?.length || 0} test posts`);
    console.log('\n✨ Test data seeded successfully!');
    console.log('⚠️  All posts are clearly marked with [TEST] prefix');
    console.log('\n📊 Summary:');
    console.log(`   - Total posts: ${testPosts.length}`);
    console.log(`   - Total prize pool: £${testPosts.reduce((sum, p) => sum + p.prize_pool, 0)}`);
    console.log(`   - Categories used: ${[...new Set(testPosts.map(p => Object.keys(categoryMap).find(k => categoryMap[k] === p.category_id)))].join(', ')}`);

  } catch (error) {
    console.error('\n❌ Error seeding data:', error);
    process.exit(1);
  }
}

// Run the seed function
seedTestData();
