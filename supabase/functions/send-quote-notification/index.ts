<<<<<<< HEAD
// supabase/functions/send-quote-notification/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { create, getNumericDate, Header } from "https://deno.land/x/djwt@v2.8/mod.ts";
=======

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
>>>>>>> 28b44aee51e23c4000ff1ede7ccfb9248fea08d6

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

<<<<<<< HEAD
// Helper to decode base64
function base64ToArrayBuffer(b64: string) {
    const byteString = atob(b64);
    const len = byteString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = byteString.charCodeAt(i);
    }
    return bytes.buffer;
}

// Helper function to get an OAuth2 access token
async function getAccessToken(serviceAccount: any) {
  const header: Header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    aud: "https://oauth2.googleapis.com/token",
    exp: getNumericDate(3600),
    iat: getNumericDate(0),
  };

  // --- FIX STARTS HERE ---
  // More robustly parse the private key by removing headers/footers and whitespace
  const privateKeyPEM = serviceAccount.private_key
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");

  const privateKeyBuffer = base64ToArrayBuffer(privateKeyPEM);

  const key = await crypto.subtle.importKey(
    "pkcs8",
    privateKeyBuffer, // Use the cleaned ArrayBuffer
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    true,
    ["sign"],
  );
  // --- FIX ENDS HERE ---

  const jwt = await create(header, payload, key);

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const tokens = await response.json();
  if (!response.ok) {
    console.error("Error getting access token:", tokens);
    throw new Error("Failed to get access token from Google.");
  }
  return tokens.access_token;
}

serve(async (req) => {
=======
serve(async (req) => {
  // Handle CORS preflight requests
>>>>>>> 28b44aee51e23c4000ff1ede7ccfb9248fea08d6
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
<<<<<<< HEAD
    console.log('Send quote notification function v3 (fixed) called')

=======
    console.log('Send quote notification function called')
    
>>>>>>> 28b44aee51e23c4000ff1ede7ccfb9248fea08d6
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

<<<<<<< HEAD
    const { userName, userEmail } = await req.json();
    const serviceAccountJSON = Deno.env.get('FIREBASE_SERVICE_ACCOUNT');
    if (!serviceAccountJSON) throw new Error("Firebase service account secret not configured");

    const serviceAccount = JSON.parse(serviceAccountJSON);

    const { data: adminTokens, error: tokenError } = await supabaseClient
      .from('admin_fcm_tokens')
      .select('fcm_token');
    if (tokenError) throw tokenError;
    
    const tokens = adminTokens?.map(t => t.fcm_token) || [];
    if (tokens.length === 0) {
      return new Response(JSON.stringify({ message: 'No admin devices to notify' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const isTest = userName === 'Test Notification';
    const title = isTest ? '🧪 Test Notification Received' : '🔔 New Quote Submission';
    const body = isTest ? `Triggered by ${userEmail}.` : `${userName} has submitted a new quote.`;
    
    const accessToken = await getAccessToken(serviceAccount);
    
    const fcmPromises = tokens.map(token => {
        const message = {
            message: {
                token: token,
                notification: { title, body },
                webpush: { fcm_options: { link: '/' } }
            }
        };
        return fetch(`https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message)
        });
    });

    const responses = await Promise.all(fcmPromises);
    let successCount = 0;
    for (const res of responses) { if (res.ok) successCount++; }

    if (successCount > 0) {
        return new Response(JSON.stringify({ message: `Successfully sent notification to ${successCount} devices` }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    } else {
        throw new Error("Failed to send notification to any device.");
    }

  } catch (error) {
    console.error('Error in function:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
=======
    const { userName, userEmail } = await req.json()
    console.log('Request data:', { userName, userEmail })

    if (!userName) {
      console.error('Username is required')
      return new Response(
        JSON.stringify({ error: 'Username is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const serverKey = Deno.env.get('FIREBASE_SERVER_KEY')
    console.log('Firebase server key configured:', !!serverKey)
    
    if (!serverKey) {
      console.error('Firebase server key not configured')
      return new Response(
        JSON.stringify({ error: 'Firebase server key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get all admin FCM tokens
    console.log('Fetching admin FCM tokens...')
    const { data: adminTokens, error: tokenError } = await supabaseClient
      .from('admin_fcm_tokens')
      .select('fcm_token')
    
    if (tokenError) {
      console.error('Error fetching admin tokens:', tokenError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch admin tokens', details: tokenError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Admin tokens found:', adminTokens?.length || 0)
    const tokens = adminTokens?.map(t => t.fcm_token) || []
    
    if (tokens.length === 0) {
      console.log('No admin FCM tokens found')
      return new Response(
        JSON.stringify({ message: 'No admin devices to notify' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send FCM notification to all admin tokens
    const notificationPayload = {
      registration_ids: tokens,
      notification: {
        title: '🔔 New Quote Submission',
        body: `${userName} has submitted a new quote request. Please check it!`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'quote-submission',
        requireInteraction: true,
        click_action: '/'
      },
      data: {
        type: 'quote_submission',
        userName: userName,
        userEmail: userEmail || '',
        timestamp: new Date().toISOString(),
        url: '/',
        click_action: '/'
      }
    }

    console.log('Sending FCM notification to', tokens.length, 'devices')
    console.log('Notification payload:', JSON.stringify(notificationPayload, null, 2))

    const fcmResponse = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Authorization': `key=${serverKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationPayload)
    })

    const fcmResult = await fcmResponse.json()
    console.log('FCM Response status:', fcmResponse.status)
    console.log('FCM Response:', JSON.stringify(fcmResult, null, 2))

    if (fcmResult.success > 0) {
      console.log(`Successfully sent notification to ${fcmResult.success} devices`)
      return new Response(
        JSON.stringify({ 
          message: `Notification sent to ${fcmResult.success} admin device(s)`,
          details: fcmResult 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      console.error('Failed to send notifications:', fcmResult)
      return new Response(
        JSON.stringify({ 
          message: 'Failed to send notifications',
          details: fcmResult 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    console.error('Error in send-quote-notification function:', error)
    return new Response(
      JSON.stringify({ error: error.message, stack: error.stack }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
>>>>>>> 28b44aee51e23c4000ff1ede7ccfb9248fea08d6
