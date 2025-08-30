import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Create Supabase service client for database updates
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get session ID from request
    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("Session ID is required");
    logStep("Session ID received", { sessionId });

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Stripe session retrieved", { 
      sessionId: session.id, 
      paymentStatus: session.payment_status,
      status: session.status 
    });

    // Update order status in database
    const newStatus = session.payment_status === 'paid' ? 'paid' : 'failed';
    const { error: updateError } = await supabaseService
      .from("orders")
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq("stripe_session_id", sessionId);

    if (updateError) {
      logStep("Error updating order", { error: updateError });
      throw new Error(`Failed to update order: ${updateError.message}`);
    }
    logStep("Order status updated", { status: newStatus });

    // Return payment verification result
    return new Response(JSON.stringify({
      success: session.payment_status === 'paid',
      status: newStatus,
      sessionId: session.id,
      amount: session.amount_total,
      currency: session.currency,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in verify-payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});