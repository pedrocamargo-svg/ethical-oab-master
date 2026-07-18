import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const { session_id, events } = await req.json();
    if (!session_id || !Array.isArray(events)) {
      return new Response(JSON.stringify({ error: 'bad input' }), { status: 400, headers: corsHeaders });
    }
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    await supabase.from('tracking_recordings').insert({ session_id, events });

    const { data: existing } = await supabase
      .from('tracking_sessions')
      .select('started_at, duration_seconds')
      .eq('id', session_id)
      .maybeSingle();
    if (existing?.started_at) {
      const computed = Math.floor((Date.now() - new Date(existing.started_at).getTime()) / 1000);
      const duration = Math.max(existing.duration_seconds ?? 0, computed);
      await supabase.from('tracking_sessions').update({
        last_seen_at: new Date().toISOString(),
        duration_seconds: duration,
      }).eq('id', session_id);
    }
    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
