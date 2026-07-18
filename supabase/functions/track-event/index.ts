import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const { session_id, event_type, payload, url } = await req.json();
    if (!session_id || !event_type) {
      return new Response(JSON.stringify({ error: 'missing fields' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    await supabase.from('tracking_events').insert({ session_id, event_type, payload, url });

    // update last_step / last_seen / duration
    const lastStep = payload?.step !== undefined ? `${payload.funnel ?? ''}:step ${payload.step}` : event_type;
    const { data: existing } = await supabase
      .from('tracking_sessions')
      .select('started_at, duration_seconds')
      .eq('id', session_id)
      .maybeSingle();
    const nowIso = new Date().toISOString();
    let duration = existing?.duration_seconds ?? 0;
    if (existing?.started_at) {
      const computed = Math.floor((Date.now() - new Date(existing.started_at).getTime()) / 1000);
      duration = Math.max(duration, computed);
    }
    await supabase.from('tracking_sessions').update({
      last_step: lastStep,
      last_seen_at: nowIso,
      duration_seconds: duration,
    }).eq('id', session_id);

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
