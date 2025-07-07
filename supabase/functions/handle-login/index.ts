// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// This function handles login requests by checking if a player with the current IP exists
Deno.serve(async (req)=>{
  try {
    // Only accept POST requests
    if (req.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405
      });
    }
    // Parse the form data to get the token
    const formData = await req.formData();
    const token = formData.get('token');
    // Validate token
    if (!token?.trim()) {
      return new Response(JSON.stringify({
        error: 'Token is required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: req.headers.get('Authorization') || `Bearer ${supabaseKey}`
        }
      }
    });
    // Get client IP address
    // Note: In Supabase Edge Functions, the client IP is available in the request headers
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || '127.0.0.1';
    // Check if a player with this IP exists
    const { data: player, error } = await supabase.from('players').select('*').eq('ip_address', ip).single();
    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // Determine redirect URL based on player existence
    const redirectUrl = player ? '/game' : `/username?ip=${encodeURIComponent(ip)}`;
    // Return a redirect response
    return new Response(null, {
      status: 302,
      headers: {
        'Location': redirectUrl,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    // Return error redirect
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/login?error=true',
        'Content-Type': 'application/json'
      }
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/handle-login' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
