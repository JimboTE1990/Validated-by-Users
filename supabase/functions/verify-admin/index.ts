import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AdminVerificationRequest {
  sessionToken?: string;
  action?: string;
  resourceType?: string;
  resourceId?: string;
  details?: any;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    // Get user from token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const body: AdminVerificationRequest = await req.json()
    
    // Create a client instance for the authenticated user
    const userSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false
        },
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    )
    
    // Verify admin access using the database function
    const { data: adminVerification, error: verifyError } = await userSupabase
      .rpc('verify_admin_access', { 
        session_token: body.sessionToken || null 
      })
      .single()

    if (verifyError || !adminVerification?.is_valid) {
      console.log('Admin verification failed:', verifyError, adminVerification)
      return new Response(
        JSON.stringify({ 
          error: 'Admin access denied',
          isValid: false 
        }), 
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Log admin activity if action is provided
    if (body.action) {
      const userAgent = req.headers.get('User-Agent') || 'Unknown'
      const ipAddress = req.headers.get('X-Forwarded-For') || 
                       req.headers.get('X-Real-IP') || 
                       'Unknown'

      const { error: logError } = await userSupabase
        .rpc('log_admin_activity', {
          p_action_type: body.action,
          p_resource_type: body.resourceType || null,
          p_resource_id: body.resourceId || null,
          p_details: body.details ? JSON.stringify(body.details) : null,
          p_ip_address: ipAddress,
          p_user_agent: userAgent
        })

      if (logError) {
        console.error('Failed to log admin activity:', logError)
        // Don't fail the request for logging errors
      }
    }

    return new Response(
      JSON.stringify({
        isValid: true,
        userId: adminVerification.user_id,
        expiresAt: adminVerification.expires_at
        // Note: sessionToken removed for security - never expose tokens in responses
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in verify-admin function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})