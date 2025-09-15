import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { name, email, referral_source, utm_source, utm_medium, utm_campaign, utm_content } = await req.json();

    // Validate required fields
    if (!name?.trim() || !email?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Name and email are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Insert waitlist signup
    const { data, error } = await supabase
      .from('waitlist_signups')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        referral_source: referral_source || 'direct',
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      
      // Handle duplicate email
      if (error.code === '23505' || error.message?.includes('duplicate key')) {
        return new Response(
          JSON.stringify({ error: 'Email already exists on waitlist' }),
          { 
            status: 409, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      throw error;
    }

    console.log('Waitlist signup successful:', { id: data.id, email: email.trim().toLowerCase() });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully joined waitlist',
        id: data.id 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in waitlist-signup function:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});