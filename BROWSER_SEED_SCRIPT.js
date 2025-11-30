/**
 * Browser Console Seed Script
 *
 * EASIEST METHOD TO SEED TEST DATA:
 *
 * 1. Open your deployed site: https://validated-by-users-mfemiaiao-jimbote1990s-projects.vercel.app
 * 2. Open browser DevTools (Press F12)
 * 3. Go to Console tab
 * 4. Copy and paste this entire file into the console
 * 5. Press Enter
 * 6. Wait for "✅ Successfully inserted X test posts!"
 * 7. Refresh the page to see the test data in /feed
 */

(async function seedTestData() {
  console.log('🌱 Starting to seed test data...\n');

  try {
    // Access Supabase client from the window/app context
    // Note: This assumes your app exposes the supabase client
    // If not available, you may need to import it differently

    const supabaseModule = await import('/src/integrations/supabase/client.ts');
    const supabase = supabaseModule.supabase;

    // Fetch categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name');

    if (catError) {
      console.error('❌ Error fetching categories:', catError);
      return;
    }

    const categoryMap = Object.fromEntries(
      categories.map(cat => [cat.name, cat.id])
    );

    console.log('✅ Found categories:', Object.keys(categoryMap).join(', '));

    // Create test user profile
    const testUserId = 'aaaaaaaa-bbbb-cccc-dddd-000000000001';

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: testUserId,
        first_name: 'Test',
        last_name: 'User',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test'
      });

    if (profileError && !profileError.message.includes('duplicate')) {
      console.log('ℹ️  Note: Could not create test user profile');
    }

    // Define test posts
    const testPosts = [
      {
        title: '🧪 [TEST] Help Us Validate Our Landing Page Copy',
        description: 'Looking for honest feedback on our SaaS landing page. Does the value proposition resonate? Is the CTA clear? Quick 5-minute review needed.',
        full_description: 'We need feedback on first impressions, value proposition clarity, pricing presentation, and any confusing sections. Low-effort task - just visit the site and share thoughts. ⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.',
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
        full_description: 'Need thorough feedback on: onboarding flow, meditation sessions, progress tracking, subscription flow, and overall navigation. High-effort review (30-45 minutes). ⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.',
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
        full_description: 'Compare two homepage designs. View both, choose your preference, explain your choice in 2-3 sentences. Quick task (under 5 minutes). ⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.',
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
        description: 'We\'re building an app to help people track their carbon footprint. Looking for feedback on our core concept, features, and whether you\'d actually use it.',
        full_description: 'Early stage validation needed on concept, problem-solution fit, planned features, and pricing. Review pitch deck and mockups. ⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.',
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
        full_description: 'Bug testing needed: create/edit/delete tasks, test recurring tasks, try collaboration features. Need detailed bug reports with reproduction steps. ⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.',
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
        description: 'Quick survey - rank 5 potential features for our community platform. Help us decide what to prioritize in our roadmap.',
        full_description: 'Help prioritize our roadmap: review 5 features, rank them, share your reasoning for top choice. Quick task (3 minutes). ⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.',
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
        title: '🧪 [TEST] Review Our API Documentation - Developer Feedback',
        description: 'Calling developers! Review our new API docs. Is everything clear? Are the code examples helpful? What\'s missing?',
        full_description: 'Developer feedback needed on API docs: clarity, code examples, authentication steps, missing info. 15-20 minute review for those familiar with REST APIs. ⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.',
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
        title: '🧪 [TEST] Does Our Pricing Make Sense? Quick Survey',
        description: 'We need honest feedback on our pricing tiers for our invoicing software. Too expensive? Too cheap? Missing a tier?',
        full_description: 'Review 3 pricing tiers (Starter, Pro, Enterprise): are prices fair for features? Which tier would you choose? What would make you upgrade? 5-10 minute task. ⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.',
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
        description: 'Super quick poll - we have 4 name options for our new fitness tracking app. Vote for your favorite and tell us why!',
        full_description: 'Vote on 4 name options for fitness app. Share first impression in 1-2 sentences. Takes 2 minutes! ⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.',
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
        description: 'We created a 3-minute product demo video. Watch it and let us know: is our product\'s value clear? Any confusing parts?',
        full_description: 'Watch 3-minute demo video: did you understand the product? Was value proposition clear? Any confusing parts? Would you try it? 5-7 minute task total. ⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.',
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

    console.log(`\n📝 Inserting ${testPosts.length} test posts...`);

    // Insert posts
    const { data, error } = await supabase
      .from('posts')
      .insert(testPosts)
      .select();

    if (error) {
      console.error('❌ Error inserting posts:', error);
      return;
    }

    console.log(`\n✅ Successfully inserted ${data.length} test posts!`);
    console.log('⚠️  All posts are clearly marked with [TEST] prefix');
    console.log(`\n📊 Summary:`);
    console.log(`   - Total posts: ${testPosts.length}`);
    console.log(`   - Total prize pool: £${testPosts.reduce((sum, p) => sum + p.prize_pool, 0)}`);
    console.log(`   - Categories: ${[...new Set(testPosts.map(p => Object.keys(categoryMap).find(k => categoryMap[k] === p.category_id)))].join(', ')}`);
    console.log('\n🔄 Refresh the page to see the test data in the feed!');

  } catch (error) {
    console.error('\n❌ Error seeding data:', error);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure you\'re logged in to the app');
    console.log('2. Check that Supabase client is accessible');
    console.log('3. Try using the SQL migration or Node.js script instead');
    console.log('4. See DEPLOYMENT_INSTRUCTIONS.md for alternative methods');
  }
})();
