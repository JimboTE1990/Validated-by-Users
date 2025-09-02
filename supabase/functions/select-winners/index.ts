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

    // Check if post exists and is expired
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

    logStep("Post validated", { endDate: post.end_date, prizePool: post.prize_pool });

    // Get all boosted comments for this post
    const { data: boostedComments, error: commentsError } = await supabaseService
      .from("comments")
      .select(`
        id, user_id, content, likes, created_at,
        profiles:user_id(first_name, last_name)
      `)
      .eq("post_id", postId)
      .eq("is_boosted", true)
      .eq("report_status", "active")
      .order("likes", { ascending: false });

    if (commentsError) {
      throw new Error(`Failed to fetch comments: ${commentsError.message}`);
    }

    if (!boostedComments || boostedComments.length === 0) {
      logStep("No boosted comments found, marking contest as completed");
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

    logStep("Found boosted comments", { count: boostedComments.length });

    // Distribute prize pool among winners
    const prizePool = parseFloat(post.prize_pool);
    const numWinners = Math.min(boostedComments.length, 5); // Max 5 winners
    
    // Prize distribution: 50%, 25%, 15%, 10% for top 4, remaining split equally
    const prizeDistribution = [];
    if (numWinners === 1) {
      prizeDistribution.push(1.0);
    } else if (numWinners === 2) {
      prizeDistribution.push(0.6, 0.4);
    } else if (numWinners === 3) {
      prizeDistribution.push(0.5, 0.3, 0.2);
    } else if (numWinners === 4) {
      prizeDistribution.push(0.4, 0.25, 0.2, 0.15);
    } else {
      prizeDistribution.push(0.35, 0.25, 0.2, 0.15, 0.05);
    }

    const winners = [];
    
    // Create winner records
    for (let i = 0; i < numWinners; i++) {
      const comment = boostedComments[i];
      const prizeAmount = prizePool * prizeDistribution[i];
      
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

      logStep("Created winner", { position: i + 1, userId: comment.user_id, prize: prizeAmount });
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