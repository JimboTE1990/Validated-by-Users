-- Seed Test Data for Validated by Users
-- ⚠️ WARNING: This is for TESTING PURPOSES ONLY
-- These are sample posts with fictional data

-- First, let's create a test user profile (if it doesn't exist)
-- We'll use a UUID that won't conflict with real users
DO $$
DECLARE
  test_user_id uuid := 'aaaaaaaa-bbbb-cccc-dddd-000000000001';
  tech_category_id uuid;
  health_category_id uuid;
  finance_category_id uuid;
  environment_category_id uuid;
  social_category_id uuid;
  dev_tools_category_id uuid;
BEGIN
  -- Get category IDs
  SELECT id INTO tech_category_id FROM public.categories WHERE name = 'Tech' LIMIT 1;
  SELECT id INTO health_category_id FROM public.categories WHERE name = 'Health & Wellness' LIMIT 1;
  SELECT id INTO finance_category_id FROM public.categories WHERE name = 'Finance' LIMIT 1;
  SELECT id INTO environment_category_id FROM public.categories WHERE name = 'Environment' LIMIT 1;
  SELECT id INTO social_category_id FROM public.categories WHERE name = 'Social' LIMIT 1;
  SELECT id INTO dev_tools_category_id FROM public.categories WHERE name = 'Developer Tools' LIMIT 1;

  -- Create test user profile if it doesn't exist
  INSERT INTO public.profiles (id, first_name, last_name, avatar_url)
  VALUES (
    test_user_id,
    'Test',
    'User',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=test'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Insert dummy test posts
  -- These are clearly marked as test data

  -- Post 1: Tech - Landing Page Review (Low effort, small prize)
  INSERT INTO public.posts (
    id,
    title,
    description,
    full_description,
    product_link,
    prize_pool,
    category_id,
    author_id,
    start_date,
    end_date,
    status,
    max_entries,
    current_entries
  ) VALUES (
    gen_random_uuid(),
    '🧪 [TEST] Help Us Validate Our Landing Page Copy',
    'Looking for honest feedback on our SaaS landing page. Does the value proposition resonate? Is the CTA clear? Quick 5-minute review needed.',
    'We''ve just redesigned our landing page for our new project management tool. We need feedback on:

- First impressions and overall clarity
- Whether the value proposition is compelling
- If the pricing is clearly presented
- Any confusing sections or unclear messaging

This is a low-effort task - just visit the site and share your thoughts in 3-5 sentences.

⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.',
    'https://example.com/test-landing',
    15,
    tech_category_id,
    test_user_id,
    NOW(),
    NOW() + INTERVAL '3 days',
    'active',
    100,
    12
  ),

  -- Post 2: Health - Full App Review (High effort, large prize)
  INSERT INTO public.posts (
    id,
    title,
    description,
    full_description,
    product_link,
    prize_pool,
    category_id,
    author_id,
    start_date,
    end_date,
    status,
    max_entries,
    current_entries
  ) VALUES (
    gen_random_uuid(),
    '🧪 [TEST] Complete UX Review for Meditation App',
    'Seeking comprehensive E2E review of our new meditation and wellness app. Test all core features, onboarding flow, and subscription process.',
    'We''re launching a new meditation app and need thorough feedback on the entire user experience.

What we need reviewed:
- Complete onboarding flow (sign up, profile setup)
- Core meditation sessions (audio quality, UI/UX)
- Progress tracking and achievements system
- Subscription flow and pricing page
- Overall app navigation and ease of use
- Any bugs or issues you encounter

This is a high-effort review requiring 30-45 minutes of thorough testing. We''re looking for detailed, constructive feedback on all aspects.

⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.',
    'https://example.com/test-meditation-app',
    250,
    health_category_id,
    test_user_id,
    NOW(),
    NOW() + INTERVAL '7 days',
    'active',
    50,
    8
  ),

  -- Post 3: Finance - A/B Test (Low effort)
  INSERT INTO public.posts (
    id,
    title,
    description,
    full_description,
    product_link,
    prize_pool,
    category_id,
    author_id,
    start_date,
    end_date,
    status,
    max_entries,
    current_entries
  ) VALUES (
    gen_random_uuid(),
    '🧪 [TEST] Quick A/B Test: Which Homepage Design?',
    'Simple A/B test comparing two homepage designs for our budgeting app. Vote for your favorite and share why in 2-3 sentences.',
    'We have two different homepage designs for our personal finance app and can''t decide which one resonates better with users.

Your task:
- View both Design A and Design B
- Choose which one you prefer
- Explain your choice in 2-3 sentences
- Mention which elements stood out to you

Super quick task - should take less than 5 minutes!

⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.',
    'https://example.com/test-finance-ab',
    10,
    finance_category_id,
    test_user_id,
    NOW() - INTERVAL '1 day',
    NOW() + INTERVAL '2 days',
    'active',
    200,
    45
  ),

  -- Post 4: Environment - Concept Validation (Medium effort)
  INSERT INTO public.posts (
    id,
    title,
    description,
    full_description,
    product_link,
    prize_pool,
    category_id,
    author_id,
    start_date,
    end_date,
    status,
    max_entries,
    current_entries
  ) VALUES (
    gen_random_uuid(),
    '🧪 [TEST] Validate Our Carbon Tracking App Concept',
    'We''re building an app to help people track their carbon footprint. Looking for feedback on our core concept, features, and whether you''d actually use it.',
    'We''re in the early stages of building a carbon footprint tracking app and need market validation.

What we''re looking for:
- Your initial reaction to the concept
- Would this solve a real problem for you?
- Feedback on our planned features list
- What would make you actually use this daily?
- Price point you''d be willing to pay

Review our pitch deck and feature mockups, then provide detailed thoughts.

⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.',
    'https://example.com/test-carbon-tracker',
    75,
    environment_category_id,
    test_user_id,
    NOW(),
    NOW() + INTERVAL '5 days',
    'active',
    75,
    22
  ),

  -- Post 5: Tech - Mobile App Bug Testing (Medium-high effort)
  INSERT INTO public.posts (
    id,
    title,
    description,
    full_description,
    product_link,
    prize_pool,
    category_id,
    author_id,
    start_date,
    end_date,
    status,
    max_entries,
    current_entries
  ) VALUES (
    gen_random_uuid(),
    '🧪 [TEST] Beta Testing: Find Bugs in Our Task Manager',
    'Help us squash bugs! Test our new task management app and report any issues, crashes, or UX problems you encounter.',
    'We''re about to launch our task management app and need help identifying bugs before public release.

Testing checklist:
- Create, edit, and delete tasks
- Test recurring tasks feature
- Try team collaboration features
- Test on both mobile and desktop if possible
- Check notification system
- Report any crashes or errors

We need detailed bug reports with steps to reproduce. Screenshots are hugely appreciated!

⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.',
    'https://example.com/test-task-app',
    150,
    tech_category_id,
    test_user_id,
    NOW(),
    NOW() + INTERVAL '10 days',
    'active',
    60,
    15
  ),

  -- Post 6: Social - Feature Prioritization (Quick)
  INSERT INTO public.posts (
    id,
    title,
    description,
    full_description,
    product_link,
    prize_pool,
    category_id,
    author_id,
    start_date,
    end_date,
    status,
    max_entries,
    current_entries
  ) VALUES (
    gen_random_uuid(),
    '🧪 [TEST] Vote: Which Features Should We Build First?',
    'Quick survey - rank 5 potential features for our community platform. Help us decide what to prioritize in our roadmap.',
    'We''re building a new community platform and have a list of features we want to build. But we can only tackle 2-3 in our first release.

Your task:
- Review our list of 5 potential features
- Rank them from most to least valuable
- Share your top reason for your #1 choice

Super quick - takes 3 minutes max!

⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.',
    'https://example.com/test-features',
    20,
    social_category_id,
    test_user_id,
    NOW(),
    NOW() + INTERVAL '4 days',
    'active',
    150,
    67
  ),

  -- Post 7: Developer Tools - API Documentation Review
  INSERT INTO public.posts (
    id,
    title,
    description,
    full_description,
    product_link,
    prize_pool,
    category_id,
    author_id,
    start_date,
    end_date,
    status,
    max_entries,
    current_entries
  ) VALUES (
    gen_random_uuid(),
    '🧪 [TEST] Review Our API Documentation - Developer Feedback',
    'Calling developers! Review our new API docs. Is everything clear? Are the code examples helpful? What''s missing?',
    'We''ve just released the first version of our API documentation and need developer feedback.

What to review:
- Overall clarity and organization
- Quality of code examples
- Are authentication steps clear?
- Any confusing or missing information?
- Ease of getting started

Ideal for developers familiar with REST APIs. Should take 15-20 minutes.

⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.',
    'https://example.com/test-api-docs',
    100,
    dev_tools_category_id,
    test_user_id,
    NOW(),
    NOW() + INTERVAL '6 days',
    'active',
    40,
    5
  ),

  -- Post 8: Finance - Pricing Strategy Feedback
  INSERT INTO public.posts (
    id,
    title,
    description,
    full_description,
    product_link,
    prize_pool,
    category_id,
    author_id,
    start_date,
    end_date,
    status,
    max_entries,
    current_entries
  ) VALUES (
    gen_random_uuid(),
    '🧪 [TEST] Does Our Pricing Make Sense? Quick Survey',
    'We need honest feedback on our pricing tiers for our invoicing software. Too expensive? Too cheap? Missing a tier?',
    'We''re finalizing pricing for our invoicing and billing software. We have 3 tiers but unsure if they''re positioned correctly.

Your feedback:
- Review our 3 pricing tiers (Starter, Pro, Enterprise)
- Do the prices seem fair for the features?
- Which tier would you choose and why?
- What would make you upgrade to a higher tier?
- Are we missing any crucial features?

Quick task - 5-10 minutes.

⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.',
    'https://example.com/test-pricing',
    35,
    finance_category_id,
    test_user_id,
    NOW(),
    NOW() + INTERVAL '3 days',
    'active',
    120,
    28
  ),

  -- Post 9: Health - Name Testing (Very quick)
  INSERT INTO public.posts (
    id,
    title,
    description,
    full_description,
    product_link,
    prize_pool,
    category_id,
    author_id,
    start_date,
    end_date,
    status,
    max_entries,
    current_entries
  ) VALUES (
    gen_random_uuid(),
    '🧪 [TEST] Help Us Pick a Name for Our Fitness App',
    'Super quick poll - we have 4 name options for our new fitness tracking app. Vote for your favorite and tell us why!',
    'We''re stuck choosing between 4 names for our fitness tracking app. We need your gut reaction!

Your task:
- Review the 4 name options
- Vote for your favorite
- Share your first impression in 1-2 sentences
- Mention any negative associations if you have them

Literally takes 2 minutes!

⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.',
    'https://example.com/test-naming',
    10,
    health_category_id,
    test_user_id,
    NOW(),
    NOW() + INTERVAL '1 day',
    'active',
    300,
    156
  ),

  -- Post 10: Tech - Video Demo Feedback
  INSERT INTO public.posts (
    id,
    title,
    description,
    full_description,
    product_link,
    prize_pool,
    category_id,
    author_id,
    start_date,
    end_date,
    status,
    max_entries,
    current_entries
  ) VALUES (
    gen_random_uuid(),
    '🧪 [TEST] Watch Our Product Demo Video - Is It Clear?',
    'We created a 3-minute product demo video. Watch it and let us know: is our product''s value clear? Any confusing parts?',
    'We''ve created a demo video to explain what our productivity tool does. We need feedback on clarity and effectiveness.

What we need:
- Watch the 3-minute video
- Did you understand what the product does?
- Was the value proposition clear?
- Any parts that were confusing?
- Would you want to try it after watching?

Quick task - just 5-7 minutes total.

⚠️ TEST DATA: This is a sample request for testing purposes only. No real product or prizes.',
    'https://example.com/test-demo-video',
    25,
    tech_category_id,
    test_user_id,
    NOW(),
    NOW() + INTERVAL '5 days',
    'active',
    100,
    34
  );

END $$;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Test data seeded successfully!';
  RAISE NOTICE '⚠️  WARNING: These are SAMPLE POSTS for testing purposes only';
  RAISE NOTICE 'All posts are clearly marked with [TEST] prefix';
END $$;
