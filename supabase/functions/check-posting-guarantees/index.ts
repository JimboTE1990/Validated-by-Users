import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-POSTING-GUARANTEES] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started - checking posting guarantees");

    // Use service role key to perform database operations
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Find posts that are approaching expiry and might need extension
    const now = new Date();
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const { data: approachingPosts, error: postsError } = await supabaseService
      .from("posts")
      .select(`
        id, title, prize_pool, end_date, min_entries_threshold, 
        extension_count, author_id, original_end_date
      `)
      .eq("contest_completed", false)
      .lt("end_date", twentyFourHoursFromNow.toISOString())
      .gt("end_date", now.toISOString())
      .lt("extension_count", 2); // Maximum 2 extensions

    if (postsError) {
      throw new Error(`Failed to fetch approaching posts: ${postsError.message}`);
    }

    if (!approachingPosts || approachingPosts.length === 0) {
      logStep("No posts approaching expiry that need checking");
      return new Response(JSON.stringify({ 
        success: true, 
        message: "No posts require guarantee checking",
        checkedPosts: 0
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("Found posts approaching expiry", { count: approachingPosts.length });

    const processedPosts = [];

    for (const post of approachingPosts) {
      try {
        logStep("Checking post", { postId: post.id, title: post.title });

        // Count eligible boosted comments for this post
        const { data: boostedComments, error: commentsError } = await supabaseService
          .from("comments")
          .select("id")
          .eq("post_id", post.id)
          .eq("is_boosted", true)
          .eq("report_status", "active");

        if (commentsError) {
          logStep("Error counting comments", { postId: post.id, error: commentsError });
          continue;
        }

        const currentEntries = boostedComments?.length || 0;
        const minThreshold = post.min_entries_threshold || 1;
        
        logStep("Entry count check", { 
          postId: post.id, 
          currentEntries, 
          minThreshold,
          extensionCount: post.extension_count || 0
        });

        if (currentEntries < minThreshold) {
          // Extend the contest by 7 days
          const newEndDate = new Date(post.end_date);
          newEndDate.setDate(newEndDate.getDate() + 7);
          
          const extensionReason = `Auto-extended via posting guarantee: ${currentEntries}/${minThreshold} entries. Extended to ensure viable contest.`;
          
          const { error: updateError } = await supabaseService
            .from("posts")
            .update({
              end_date: newEndDate.toISOString(),
              extension_count: (post.extension_count || 0) + 1,
              extension_reason: extensionReason
            })
            .eq("id", post.id);

          if (updateError) {
            logStep("Error extending post", { postId: post.id, error: updateError });
            continue;
          }

          processedPosts.push({
            postId: post.id,
            title: post.title,
            action: "extended",
            currentEntries,
            minThreshold,
            newEndDate: newEndDate.toISOString(),
            extensionCount: (post.extension_count || 0) + 1
          });

          logStep("Post extended", { 
            postId: post.id,
            newEndDate: newEndDate.toISOString(),
            extensionCount: (post.extension_count || 0) + 1
          });

          // TODO: Send notification to post author about extension
          // This could be implemented with email/notification service
          
        } else {
          processedPosts.push({
            postId: post.id,
            title: post.title,
            action: "no_extension_needed",
            currentEntries,
            minThreshold
          });

          logStep("Post meets threshold", { 
            postId: post.id,
            currentEntries,
            minThreshold
          });
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logStep("Error processing post", { 
          postId: post.id, 
          error: errorMessage 
        });
        
        processedPosts.push({
          postId: post.id,
          title: post.title,
          action: "error",
          error: errorMessage
        });
      }
    }

    const extendedCount = processedPosts.filter(p => p.action === "extended").length;

    logStep("Posting guarantee check completed", { 
      totalChecked: processedPosts.length,
      extended: extendedCount
    });

    return new Response(JSON.stringify({ 
      success: true, 
      processedPosts,
      summary: {
        totalChecked: processedPosts.length,
        extended: extendedCount,
        noExtensionNeeded: processedPosts.filter(p => p.action === "no_extension_needed").length,
        errors: processedPosts.filter(p => p.action === "error").length
      },
      message: `Checked ${processedPosts.length} posts, extended ${extendedCount} contests`
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