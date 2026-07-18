import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const body = await req.json();
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    let sessionId = body.session_id as string | undefined;
    let userLabel = body.user_label as string | undefined;

    if (sessionId) {
      // update
      const { data: existing } = await supabase.from('tracking_sessions').select('*').eq('id', sessionId).maybeSingle();
      if (existing) {
        const nowMs = Date.now();
        const lastSeenMs = new Date(existing.last_seen_at).getTime();
        const isNewVisit = nowMs - lastSeenMs > 5 * 60 * 1000; // 5 min gap = novo acesso
        const dur = Math.max(existing.duration_seconds, Math.floor((nowMs - new Date(existing.started_at).getTime()) / 1000));
        await supabase.from('tracking_sessions').update({
          last_seen_at: new Date().toISOString(),
          access_count: isNewVisit ? existing.access_count + 1 : existing.access_count,
          duration_seconds: dur,
          url: body.url ?? existing.url,
        }).eq('id', sessionId);
        return new Response(JSON.stringify({ session_id: sessionId, user_label: existing.user_label }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    if (!userLabel) {
      const { data: seqData } = await supabase.rpc('nextval_tracking_user' as any).maybeSingle().then(r => r).catch(() => ({ data: null }));
      // fallback
      const { data: countRow } = await supabase.from('tracking_sessions').select('id', { count: 'exact', head: true });
      const num = (countRow as any)?.count ?? Math.floor(Math.random() * 100000);
      userLabel = `user ${num + 1}`;
    }

    const { data: inserted, error } = await supabase.from('tracking_sessions').insert({
      user_label: userLabel,
      funnel: body.funnel ?? 'unknown',
      ip: body.ip,
      city: body.city,
      region: body.region,
      country: body.country,
      user_agent: body.user_agent,
      url: body.url,
    }).select('id, user_label').single();

    if (error) throw error;

    return new Response(JSON.stringify({ session_id: inserted.id, user_label: inserted.user_label }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
