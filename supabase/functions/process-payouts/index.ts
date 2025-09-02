import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PROCESS-PAYOUTS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

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

    logStep("Processing payouts for post", { postId });

    // Get all pending winners for this post
    const { data: pendingWinners, error: winnersError } = await supabaseService
      .from("winners")
      .select(`
        id, user_id, prize_amount, position,
        profiles:user_id(first_name, last_name)
      `)
      .eq("post_id", postId)
      .eq("payout_status", "pending");

    if (winnersError) {
      throw new Error(`Failed to fetch winners: ${winnersError.message}`);
    }

    if (!pendingWinners || pendingWinners.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: "No pending payouts found",
        processedPayouts: []
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("Found pending winners", { count: pendingWinners.length });

    const processedPayouts = [];
    const failedPayouts = [];

    for (const winner of pendingWinners) {
      try {
        logStep("Processing payout", { 
          winnerId: winner.id, 
          userId: winner.user_id, 
          amount: winner.prize_amount 
        });

        // Mark as processing
        await supabaseService
          .from("winners")
          .update({ payout_status: "processing" })
          .eq("id", winner.id);

        // In a real implementation, you would:
        // 1. Get user's connected Stripe account or bank details
        // 2. Create a transfer or payout via Stripe
        // For this demo, we'll simulate the process

        // Simulate Stripe transfer (replace with actual Stripe API call)
        const transferAmount = Math.round(winner.prize_amount * 100); // Convert to pence
        
        // const transfer = await stripe.transfers.create({
        //   amount: transferAmount,
        //   currency: "gbp",
        //   destination: userStripeAccountId, // Would need to be stored per user
        //   description: `Prize payout for position ${winner.position}`,
        // });

        // For demo purposes, create a simulated transfer ID
        const simulatedTransferId = `tr_demo_${Date.now()}_${winner.id}`;

        // Update winner record with completed status
        await supabaseService
          .from("winners")
          .update({ 
            payout_status: "completed",
            stripe_transfer_id: simulatedTransferId
          })
          .eq("id", winner.id);

        processedPayouts.push({
          winnerId: winner.id,
          userId: winner.user_id,
          userName: `${winner.profiles?.first_name || ''} ${winner.profiles?.last_name || ''}`.trim(),
          amount: winner.prize_amount,
          position: winner.position,
          transferId: simulatedTransferId,
          status: "completed"
        });

        logStep("Payout completed", { 
          winnerId: winner.id, 
          transferId: simulatedTransferId 
        });

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logStep("Payout failed", { 
          winnerId: winner.id, 
          error: errorMessage 
        });

        // Mark payout as failed
        await supabaseService
          .from("winners")
          .update({ payout_status: "failed" })
          .eq("id", winner.id);

        failedPayouts.push({
          winnerId: winner.id,
          userId: winner.user_id,
          error: errorMessage
        });
      }
    }

    logStep("Payout processing completed", { 
      successful: processedPayouts.length, 
      failed: failedPayouts.length 
    });

    return new Response(JSON.stringify({ 
      success: true, 
      processedPayouts,
      failedPayouts,
      message: `Processed ${processedPayouts.length} payouts, ${failedPayouts.length} failed`
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