// TikTok Events API - Purchase event
// Public endpoint (no JWT required) called from the /obrigado page after purchase.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const TIKTOK_PIXEL_ID = 'D7LB5CRC77U1C1VBHNDG';
const TIKTOK_API_URL = 'https://business-api.tiktok.com/open_api/v1.3/event/track/';

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input.trim().toLowerCase());
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TIKTOK_CAPI_ACCESS_TOKEN = Deno.env.get('TIKTOK_CAPI_ACCESS_TOKEN');
    if (!TIKTOK_CAPI_ACCESS_TOKEN) {
      throw new Error('TIKTOK_CAPI_ACCESS_TOKEN is not configured');
    }

    const body = await req.json().catch(() => ({}));
    const {
      value = 0,
      currency = 'BRL',
      content_id = 'oab-etica-50q',
      content_name = '50 questões comentadas sobre Ética profissional',
      content_type = 'product',
      email,
      phone,
      external_id,
      event_id,
      url,
      ttclid,
      ttp,
    } = body ?? {};

    // Get IP and user agent from request headers
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('cf-connecting-ip') ||
      undefined;
    const user_agent = req.headers.get('user-agent') || undefined;

    const user: Record<string, unknown> = {};
    if (email) user.email = await sha256Hex(String(email));
    if (phone) user.phone = await sha256Hex(String(phone));
    if (external_id) user.external_id = await sha256Hex(String(external_id));
    if (ip) user.ip = ip;
    if (user_agent) user.user_agent = user_agent;
    if (ttclid) user.ttclid = ttclid;
    if (ttp) user.ttp = ttp;

    const payload = {
      event_source: 'web',
      event_source_id: TIKTOK_PIXEL_ID,
      data: [
        {
          event: 'Purchase',
          event_time: Math.floor(Date.now() / 1000),
          event_id: event_id || crypto.randomUUID(),
          user,
          properties: {
            currency,
            value: Number(value) || 0,
            contents: [
              {
                content_id,
                content_type,
                content_name,
                quantity: 1,
                price: Number(value) || 0,
              },
            ],
          },
          page: url ? { url } : undefined,
        },
      ],
    };

    const tiktokRes = await fetch(TIKTOK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': TIKTOK_CAPI_ACCESS_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    const tiktokData = await tiktokRes.json();
    console.log('TikTok CAPI response:', JSON.stringify(tiktokData));

    if (!tiktokRes.ok || tiktokData.code !== 0) {
      return new Response(
        JSON.stringify({ success: false, error: tiktokData }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, response: tiktokData }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('tiktok-purchase error:', message);
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
