import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SELECT-WINNERS] ${step}${detailsStr}`);
};

// Fixed prize distribution mapping for new random selection system
const getPrizeDistribution = (prizePool: number): number[] => {
  switch(prizePool) {
    case 10: return [10];
    case 25: return [15, 10];
    case 50: return [25, 15, 10];
    case 100: return [40, 25, 15, 10, 10];
    case 250: return [100, 60, 40, 25, 25];
    case 500: return [200, 120, 80, 50, 50];
    case 1000: return [400, 200, 150, 125, 125];
    default: 
      // Fallback for custom amounts - ensure £10 minimum
      if (prizePool < 10) return [Math.max(10, prizePool)];
      return [Math.max(10, prizePool)]; // Single winner with £10 minimum
  }
};

// Create bespoke prize distribution when fewer winners than expected
const createBespokePrizes = (prizePool: number, winnerCount: number): number[] => {
  if (winnerCount === 0) return [];
  if (winnerCount === 1) return [Math.max(10, prizePool)];
  
  const prizes: number[] = [];
  const remainingPool = prizePool;
  
  // Ensure each winner gets at least £10
  const minPerWinner = 10;
  const totalMinimum = minPerWinner * winnerCount;
  
  if (prizePool < totalMinimum) {
    // If pool is too small, give £10 to as many as possible
    const affordableWinners = Math.floor(prizePool / 10);
    for (let i = 0; i < affordableWinners; i++) {
      prizes.push(10);
    }
    return prizes;
  }
  
  // Distribute remaining after minimums using descending ratios
  const extra = remainingPool - totalMinimum;
  const ratios = [0.4, 0.25, 0.2, 0.1, 0.05]; // For up to 5 winners
  
  for (let i = 0; i < winnerCount; i++) {
    const ratio = ratios[i] || 0.05; // Default small ratio for 6+ winners
    const extraAmount = extra * ratio;
    prizes.push(minPerWinner + extraAmount);
  }
  
  return prizes;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Use service role key to perform database operations
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { postId } = await req.json();
    if (!postId) {
      throw new Error("Post ID is required");
    }

    logStep("Processing post", { postId });

    // Check if post exists and validate eligibility
    const { data: post, error: postError } = await supabaseService
      .from("posts")
      .select("*")
      .eq("id", postId)
      .single();

    if (postError || !post) {
      throw new Error("Post not found");
    }

    if (new Date() < new Date(post.end_date)) {
      throw new Error("Contest is still active");
    }

    if (post.contest_completed) {
      throw new Error("Winners already selected for this post");
    }

    logStep("Post validated", { 
      endDate: post.end_date, 
      prizePool: post.prize_pool,
      extensionCount: post.extension_count || 0,
      minThreshold: post.min_entries_threshold || 1
    });

    // Get all boosted comments for this post using RANDOM selection
    const { data: boostedComments, error: commentsError } = await supabaseService
      .from("comments")
      .select(`
        id, user_id, content, created_at,
        profiles:user_id(first_name, last_name)
      `)
      .eq("post_id", postId)
      .eq("is_boosted", true)
      .eq("report_status", "active");

    if (commentsError) {
      throw new Error(`Failed to fetch comments: ${commentsError.message}`);
    }

    logStep("Found boosted comments", { count: boostedComments?.length || 0 });

    // Check if we meet minimum entry threshold
    const minThreshold = post.min_entries_threshold || 1;
    const currentEntries = boostedComments?.length || 0;
    const maxExtensions = 2;
    const currentExtensions = post.extension_count || 0;

    if (currentEntries < minThreshold && currentExtensions < maxExtensions) {
      // Auto-extend the contest by 7 days
      const newEndDate = new Date(post.end_date);
      newEndDate.setDate(newEndDate.getDate() + 7);
      
      const extensionReason = `Insufficient entries (${currentEntries}/${minThreshold}). Extended to allow more participation.`;
      
      await supabaseService
        .from("posts")
        .update({ 
          end_date: newEndDate.toISOString(),
          extension_count: currentExtensions + 1,
          extension_reason: extensionReason
        })
        .eq("id", postId);

      logStep("Contest auto-extended", { 
        newEndDate: newEndDate.toISOString(),
        extensionCount: currentExtensions + 1,
        reason: extensionReason
      });

      return new Response(JSON.stringify({ 
        success: true, 
        extended: true,
        newEndDate: newEndDate.toISOString(),
        message: `Contest extended by 7 days due to insufficient entries. New end date: ${newEndDate.toLocaleDateString()}`
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (!boostedComments || boostedComments.length === 0) {
      logStep("No boosted comments found after extensions, marking contest as completed");
      await supabaseService
        .from("posts")
        .update({ 
          contest_completed: true, 
          winners_selected_at: new Date().toISOString() 
        })
        .eq("id", postId);

      return new Response(JSON.stringify({ 
        success: true, 
        winners: [], 
        message: "No eligible winners found" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Randomize the eligible comments for fair selection
    const shuffledComments = [...boostedComments].sort(() => Math.random() - 0.5);

    // Get fixed prize distribution or create bespoke prizes
    const prizePool = parseFloat(post.prize_pool);
    const availableWinners = shuffledComments.length;
    
    let prizeAmounts: number[];
    const standardDistribution = getPrizeDistribution(prizePool);
    
    if (availableWinners >= standardDistribution.length) {
      // Use standard fixed distribution
      prizeAmounts = standardDistribution;
      logStep("Using standard prize distribution", { 
        prizePool, 
        standardWinners: standardDistribution.length,
        prizes: prizeAmounts 
      });
    } else {
      // Create bespoke distribution for fewer winners
      prizeAmounts = createBespokePrizes(prizePool, availableWinners);
      logStep("Using bespoke prize distribution", { 
        prizePool, 
        availableWinners, 
        prizes: prizeAmounts 
      });
    }

    const numWinners = Math.min(availableWinners, prizeAmounts.length);
    const winners = [];
    
    // Create winner records using random selection
    for (let i = 0; i < numWinners; i++) {
      const comment = shuffledComments[i];
      const prizeAmount = prizeAmounts[i];
      
      const { data: winner, error: winnerError } = await supabaseService
        .from("winners")
        .insert({
          post_id: postId,
          comment_id: comment.id,
          user_id: comment.user_id,
          prize_amount: prizeAmount,
          position: i + 1,
          payout_status: "pending"
        })
        .select()
        .single();

      if (winnerError) {
        logStep("Error creating winner record", { error: winnerError });
        continue;
      }

      winners.push({
        ...winner,
        comment_content: comment.content,
        user_name: `${comment.profiles?.first_name || ''} ${comment.profiles?.last_name || ''}`.trim(),
        prize_amount: prizeAmount
      });

      logStep("Created winner", { 
        position: i + 1, 
        userId: comment.user_id, 
        prize: prizeAmount,
        randomSelection: true 
      });
    }

    // Mark contest as completed
    await supabaseService
      .from("posts")
      .update({ 
        contest_completed: true, 
        winners_selected_at: new Date().toISOString() 
      })
      .eq("id", postId);

    logStep("Contest completed", { winnersCount: winners.length });

    return new Response(JSON.stringify({ 
      success: true, 
      winners,
      totalPrizePool: prizePool,
      message: `${winners.length} winners selected successfully`
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});