import { supabase } from '@/integrations/supabase/client';

export interface E2ETestResult {
  step: string;
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export class E2ETestFlow {
  private results: E2ETestResult[] = [];
  private testUsers: { email: string; password: string; id?: string }[] = [];
  private testPost: any = null;

  constructor() {
    // Create test users
    this.testUsers = [
      { email: 'developer@test.com', password: 'TestPass123!' },
      { email: 'user1@test.com', password: 'TestPass123!' },
      { email: 'user2@test.com', password: 'TestPass123!' },
      { email: 'user3@test.com', password: 'TestPass123!' },
    ];
  }

  private logResult(step: string, success: boolean, message: string, data?: any, error?: string) {
    const result: E2ETestResult = { step, success, message, data, error };
    this.results.push(result);
    console.log(`[E2E Test] ${step}: ${success ? '✅' : '❌'} ${message}`);
    if (error) console.error(`Error: ${error}`);
  }

  async runFullE2ETest(): Promise<E2ETestResult[]> {
    console.log('🚀 Starting E2E Test Flow...');
    
    try {
      await this.step1_CreateTestUsers();
      await this.step2_DeveloperLogin();
      await this.step3_CreatePost();
      await this.step4_UsersProvideFeedback();
      await this.step5_SimulateContestEnd();
      await this.step6_SelectWinners();
      await this.step7_ProcessPayouts();
      await this.cleanup();
    } catch (error) {
      this.logResult('FATAL ERROR', false, 'Test flow failed', null, error instanceof Error ? error.message : String(error));
    }

    return this.results;
  }

  private async step1_CreateTestUsers() {
    this.logResult('STEP 1', true, 'Creating test users...');
    
    for (const user of this.testUsers) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            data: {
              first_name: user.email.split('@')[0],
              last_name: 'Tester'
            }
          }
        });

        if (error && !error.message.includes('already registered')) {
          throw error;
        }

        user.id = data.user?.id;
        this.logResult('CREATE USER', true, `User ${user.email} created/exists`);
      } catch (error) {
        this.logResult('CREATE USER', false, `Failed to create ${user.email}`, null, error instanceof Error ? error.message : String(error));
      }
    }
  }

  private async step2_DeveloperLogin() {
    this.logResult('STEP 2', true, 'Developer login...');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: this.testUsers[0].email,
        password: this.testUsers[0].password,
      });

      if (error) throw error;

      this.logResult('DEVELOPER LOGIN', true, 'Developer logged in successfully', { userId: data.user?.id });
    } catch (error) {
      this.logResult('DEVELOPER LOGIN', false, 'Failed to login developer', null, error instanceof Error ? error.message : String(error));
    }
  }

  private async step3_CreatePost() {
    this.logResult('STEP 3', true, 'Creating test post...');
    
    try {
      // First get a category
      const { data: categories } = await supabase.from('categories').select('id').limit(1);
      const categoryId = categories?.[0]?.id;

      const postData = {
        title: 'E2E Test Product - AI-Powered Task Manager',
        description: 'Revolutionary task management app with AI suggestions',
        full_description: 'This is a comprehensive task management solution that uses AI to help users prioritize and organize their work more effectively.',
        product_link: 'https://example.com/test-product',
        prize_pool: 500,
        category_id: categoryId,
        author_id: this.testUsers[0].id,
        end_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        status: 'active'
      };

      const { data, error } = await supabase
        .from('posts')
        .insert(postData)
        .select()
        .single();

      if (error) throw error;

      this.testPost = data;
      this.logResult('CREATE POST', true, 'Test post created successfully', { postId: data.id, prizePool: data.prize_pool });
    } catch (error) {
      this.logResult('CREATE POST', false, 'Failed to create test post', null, error instanceof Error ? error.message : String(error));
    }
  }

  private async step4_UsersProvideFeedback() {
    this.logResult('STEP 4', true, 'Users providing feedback...');
    
    if (!this.testPost) {
      this.logResult('PROVIDE FEEDBACK', false, 'No test post available');
      return;
    }

    const feedbackComments = [
      'Great concept! I love the AI integration. The interface looks clean but could use more customization options.',
      'The task prioritization feature is exactly what I need. Would be nice to have team collaboration features.',
      'Interesting approach to productivity. The AI suggestions seem helpful, but privacy concerns need addressing.',
      'Love the simplicity! This could replace my current task manager. Integration with calendar apps would be perfect.',
    ];

    // Login each user and provide feedback
    for (let i = 1; i < this.testUsers.length; i++) {
      try {
        // Login user
        await supabase.auth.signInWithPassword({
          email: this.testUsers[i].email,
          password: this.testUsers[i].password,
        });

        // Add comment
        const { data, error } = await supabase
          .from('comments')
          .insert({
            post_id: this.testPost.id,
            user_id: this.testUsers[i].id,
            content: feedbackComments[i - 1] || `Test feedback from user ${i}`,
          })
          .select()
          .single();

        if (error) throw error;

        this.logResult('USER FEEDBACK', true, `User ${i} provided feedback`, { commentId: data.id });
      } catch (error) {
        this.logResult('USER FEEDBACK', false, `User ${i} failed to provide feedback`, null, error instanceof Error ? error.message : String(error));
      }
    }
  }

  private async step5_SimulateContestEnd() {
    this.logResult('STEP 5', true, 'Simulating contest end...');
    
    try {
      // Update post end date to past (simulate contest ended)
      const { error } = await supabase
        .from('posts')
        .update({ 
          end_date: new Date(Date.now() - 1000).toISOString(), // 1 second ago
          contest_completed: false // Ensure it's not marked as completed yet
        })
        .eq('id', this.testPost.id);

      if (error) throw error;

      this.logResult('CONTEST END', true, 'Contest end simulated successfully');
    } catch (error) {
      this.logResult('CONTEST END', false, 'Failed to simulate contest end', null, error instanceof Error ? error.message : String(error));
    }
  }

  private async step6_SelectWinners() {
    this.logResult('STEP 6', true, 'Selecting winners...');
    
    try {
      // Login as developer (post author)
      await supabase.auth.signInWithPassword({
        email: this.testUsers[0].email,
        password: this.testUsers[0].password,
      });

      // Call the select-winners edge function
      const { data, error } = await supabase.functions.invoke('select-winners', {
        body: { postId: this.testPost.id }
      });

      if (error) throw error;

      this.logResult('SELECT WINNERS', true, 'Winners selected successfully', { 
        winners: data.winners?.length || 0,
        message: data.message 
      });
    } catch (error) {
      this.logResult('SELECT WINNERS', false, 'Failed to select winners', null, error instanceof Error ? error.message : String(error));
    }
  }

  private async step7_ProcessPayouts() {
    this.logResult('STEP 7', true, 'Processing payouts...');
    
    try {
      // Call the process-payouts edge function
      const { data, error } = await supabase.functions.invoke('process-payouts', {
        body: { postId: this.testPost.id }
      });

      if (error) throw error;

      this.logResult('PROCESS PAYOUTS', true, 'Payouts processed successfully', {
        processedPayouts: data.processedPayouts?.length || 0,
        failedPayouts: data.failedPayouts?.length || 0,
        message: data.message
      });
    } catch (error) {
      this.logResult('PROCESS PAYOUTS', false, 'Failed to process payouts', null, error instanceof Error ? error.message : String(error));
    }
  }

  private async cleanup() {
    this.logResult('CLEANUP', true, 'Cleaning up test data...');
    
    try {
      // Note: In a real test environment, you might want to clean up test data
      // For this demo, we'll leave the data for inspection
      
      await supabase.auth.signOut();
      this.logResult('CLEANUP', true, 'Test cleanup completed');
    } catch (error) {
      this.logResult('CLEANUP', false, 'Cleanup failed', null, error instanceof Error ? error.message : String(error));
    }
  }

  getResults(): E2ETestResult[] {
    return this.results;
  }

  getSuccessRate(): number {
    const successful = this.results.filter(r => r.success).length;
    return this.results.length > 0 ? (successful / this.results.length) * 100 : 0;
  }

  printSummary() {
    console.log('\n📊 E2E Test Summary:');
    console.log(`Success Rate: ${this.getSuccessRate().toFixed(1)}%`);
    console.log(`Total Steps: ${this.results.length}`);
    console.log(`Successful: ${this.results.filter(r => r.success).length}`);
    console.log(`Failed: ${this.results.filter(r => !r.success).length}`);
    
    const failedSteps = this.results.filter(r => !r.success);
    if (failedSteps.length > 0) {
      console.log('\n❌ Failed Steps:');
      failedSteps.forEach(step => {
        console.log(`  - ${step.step}: ${step.message}${step.error ? ` (${step.error})` : ''}`);
      });
    }
  }
}