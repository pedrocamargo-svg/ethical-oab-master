// Admin API for /oabtracker dashboard.
// - action=login: validates two passwords, returns token
// - action=list: sessions filtered
// - action=detail: session + events + recording
// - action=update_sale: set sale_status
// - action=delete_range: delete by date range
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-oab-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const PW_NUMERIC = '170300';
const PW_ALPHA = 'Pedro100pre#';
const TOKEN_SECRET = 'oab-tracker-2026-token'; // simple bearer token

function normalizePassword(value: unknown) {
  return String(value ?? '')
    .normalize('NFKC')
    .trim();
}

function isValidAlphaPassword(value: unknown) {
  const normalized = normalizePassword(value).toLowerCase();
  const expected = PW_ALPHA.toLowerCase();
  const expectedWithoutHash = expected.replace(/#$/, '');

  return normalized === expected || normalized === expectedWithoutHash;
}

function checkAuth(req: Request) {
  const h = req.headers.get('x-oab-token');
  return h === TOKEN_SECRET;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  try {
    const body = await req.json();
    const action = body.action as string;

    if (action === 'login') {
      const device_fp = normalizePassword(body.device_fp || body.device || 'default-device');
      const pw_numeric = normalizePassword(body.pw_numeric ?? body.numeric ?? body.senha_numerica);
      const pw_alpha = body.pw_alpha ?? body.alpha ?? body.senha_alfanumerica;
      const now = new Date();
      const { data: att } = await supabase.from('oabtracker_auth_attempts').select('*').eq('device_fp', device_fp).maybeSingle();

      if (att?.locked_until && new Date(att.locked_until) > now) {
        return new Response(JSON.stringify({ error: 'locked', locked_until: att.locked_until }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      const ok = pw_numeric === PW_NUMERIC && isValidAlphaPassword(pw_alpha);
      if (!ok) {
        const newAttempts = (att?.attempts ?? 0) + 1;
        const shouldLock = newAttempts >= 3;
        await supabase.from('oabtracker_auth_attempts').upsert({
          device_fp,
          attempts: shouldLock ? 0 : newAttempts,
          locked_until: shouldLock ? new Date(Date.now() + 24 * 3600 * 1000).toISOString() : null,
          last_attempt_at: now.toISOString(),
        });
        return new Response(JSON.stringify({ error: 'invalid', attempts_left: Math.max(0, 3 - newAttempts) }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      await supabase.from('oabtracker_auth_attempts').upsert({ device_fp, attempts: 0, locked_until: null, last_attempt_at: now.toISOString() });
      return new Response(JSON.stringify({ token: TOKEN_SECRET }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (!checkAuth(req)) {
      return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'list') {
      const { funnel, from, to, search } = body;
      let q = supabase.from('tracking_sessions').select('*').order('last_seen_at', { ascending: false }).limit(500);
      if (funnel && funnel !== 'all') q = q.eq('funnel', funnel);
      if (from) q = q.gte('started_at', from);
      if (to) q = q.lte('started_at', to);
      if (search) q = q.or(`user_label.ilike.%${search}%,city.ilike.%${search}%,country.ilike.%${search}%`);
      const { data, error } = await q;
      if (error) throw error;

      // metrics
      const total = data?.reduce((sum: number, r: any) => sum + (Number(r.access_count) || 1), 0) ?? 0;
      const sessions = data?.length ?? 0;
      const sold = data?.filter((r: any) => r.sale_status === 'sold').length ?? 0;
      const completedQuiz = data?.filter((r: any) => r.last_step?.includes('recommend') || r.last_step?.includes('initiate_checkout') || r.last_step?.includes('step 8') || r.last_step?.includes('step 16')).length ?? 0;
      return new Response(JSON.stringify({
        sessions: data,
        metrics: { total, sessions, sold, completed_quiz: completedQuiz, conversion_rate: sessions ? sold / sessions : 0, quiz_completion_rate: sessions ? completedQuiz / sessions : 0 },
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'detail') {
      const { session_id } = body;
      const [{ data: session }, { data: events }] = await Promise.all([
        supabase.from('tracking_sessions').select('*').eq('id', session_id).maybeSingle(),
        supabase.from('tracking_events').select('*').eq('session_id', session_id).neq('event_type', 'heatmap_clicks').order('created_at'),
      ]);
      return new Response(JSON.stringify({ session, events }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'heatmap') {
      // Aggregate heatmap_clicks across sessions matching the current filter.
      const { funnel, from, to, path } = body;
      let sq = supabase.from('tracking_sessions').select('id').limit(2000);
      if (funnel && funnel !== 'all') sq = sq.eq('funnel', funnel);
      if (from) sq = sq.gte('started_at', from);
      if (to) sq = sq.lte('started_at', to);
      const { data: sess } = await sq;
      const ids = (sess ?? []).map((r: any) => r.id);
      if (ids.length === 0) return new Response(JSON.stringify({ pages: [], clicks: [] }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      const { data: evts } = await supabase.from('tracking_events').select('payload, url').eq('event_type', 'heatmap_clicks').in('session_id', ids).limit(5000);
      const pageCounts = new Map<string, number>();
      const clicks: any[] = [];
      for (const e of evts ?? []) {
        const arr = Array.isArray(e.payload?.clicks) ? e.payload.clicks : [];
        for (const c of arr) {
          const p = c.path ?? '/';
          pageCounts.set(p, (pageCounts.get(p) ?? 0) + 1);
          if (path && p === path) clicks.push(c);
        }
      }
      const pages = Array.from(pageCounts.entries()).map(([path, count]) => ({ path, count })).sort((a, b) => b.count - a.count);
      return new Response(JSON.stringify({ pages, clicks }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'update_sale') {
      const { session_id, sale_status } = body;
      await supabase.from('tracking_sessions').update({ sale_status }).eq('id', session_id);
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'delete_range') {
      const { from, to } = body;
      // Find affected sessions first so we can cascade delete their events + recordings.
      let sq = supabase.from('tracking_sessions').select('id').limit(100000);
      if (from) sq = sq.gte('started_at', from);
      if (to) sq = sq.lte('started_at', to);
      const { data: sess, error: selErr } = await sq;
      if (selErr) throw selErr;
      const ids = (sess ?? []).map((r: any) => r.id);
      let deleted = 0;
      if (ids.length > 0) {
        // Delete in chunks to stay within URL limits.
        const chunk = 200;
        for (let i = 0; i < ids.length; i += chunk) {
          const part = ids.slice(i, i + chunk);
          await supabase.from('tracking_events').delete().in('session_id', part);
          await supabase.from('tracking_recordings').delete().in('session_id', part);
          const { error: delErr } = await supabase.from('tracking_sessions').delete().in('id', part);
          if (delErr) throw delErr;
          deleted += part.length;
        }
      }
      return new Response(JSON.stringify({ ok: true, deleted }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }


    return new Response(JSON.stringify({ error: 'unknown action' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
