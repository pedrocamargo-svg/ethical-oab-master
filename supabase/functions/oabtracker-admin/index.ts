// Admin API for /oabtracker dashboard.
// - action=login: validates two passwords, returns token
// - action=stats: per-funnel aggregate stats
// - action=delete_range: delete by date range
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-oab-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const PW_NUMERIC = '170300';
const PW_ALPHA = 'Pedro100pre#';
const TOKEN_SECRET = 'oab-tracker-2026-token';

const FUNNELS = [
  { key: 'quiz1', label: 'Quiz WhatsApp' },
  { key: 'quiz2', label: 'Quiz Longo' },
];

function normalizePassword(value: unknown) {
  return String(value ?? '').normalize('NFKC').trim();
}

function isValidAlphaPassword(value: unknown) {
  const normalized = normalizePassword(value).toLowerCase();
  const expected = PW_ALPHA.toLowerCase();
  return normalized === expected || normalized === expected.replace(/#$/, '');
}

function checkAuth(req: Request) {
  return req.headers.get('x-oab-token') === TOKEN_SECRET;
}

function isFacebookAd(utm: any): boolean {
  if (!utm || typeof utm !== 'object') return false;
  const src = String(utm.utm_source ?? '').toLowerCase();
  return src.startsWith('fb') || src.includes('facebook') || src === 'meta';
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

    if (action === 'stats') {
      const { from, to } = body;

      const results: any[] = [];
      for (const f of FUNNELS) {
        // Sessions for this funnel
        let sq = supabase.from('tracking_sessions').select('id, utm_params').eq('funnel', f.key).limit(100000);
        if (from) sq = sq.gte('started_at', from);
        if (to) sq = sq.lte('started_at', to);
        const { data: sess } = await sq;
        const sessions = sess ?? [];
        const sessionIds = sessions.map((s: any) => s.id);
        const acessos = sessions.length;
        const fbAcessos = sessions.filter((s: any) => isFacebookAd(s.utm_params)).length;

        // Events for these sessions to determine funnel progression
        let viewedFirst = 0;
        let advanced = 0;
        let clickedCheckout = 0;

        if (sessionIds.length > 0) {
          // Fetch step + recommend events. Chunk in case of many ids.
          const chunk = 200;
          const perSession = new Map<string, { maxStep: number; recommended: boolean }>();
          for (let i = 0; i < sessionIds.length; i += chunk) {
            const part = sessionIds.slice(i, i + chunk);
            const { data: evts } = await supabase
              .from('tracking_events')
              .select('session_id, event_type, payload')
              .in('session_id', part)
              .in('event_type', ['quiz_step', 'quiz_recommend', 'initiate_checkout'])
              .limit(50000);
            for (const e of evts ?? []) {
              const cur = perSession.get(e.session_id) ?? { maxStep: -1, recommended: false };
              if (e.event_type === 'quiz_step') {
                const s = Number(e.payload?.step);
                if (Number.isFinite(s) && s > cur.maxStep) cur.maxStep = s;
              } else if (e.event_type === 'quiz_recommend' || e.event_type === 'initiate_checkout') {
                cur.recommended = true;
              }
              perSession.set(e.session_id, cur);
            }
          }
          for (const [, v] of perSession) {
            if (v.maxStep >= 0) viewedFirst++;
            if (v.maxStep >= 1) advanced++;
            if (v.recommended) clickedCheckout++;
          }
        }

        const ctr = viewedFirst > 0 ? clickedCheckout / viewedFirst : 0;
        results.push({
          key: f.key,
          label: f.label,
          acessos,
          fb_acessos: fbAcessos,
          viewed_first: viewedFirst,
          advanced,
          clicked_checkout: clickedCheckout,
          ctr,
        });
      }

      return new Response(JSON.stringify({ funnels: results }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'delete_range') {
      const { from, to } = body;
      let sq = supabase.from('tracking_sessions').select('id').limit(100000);
      if (from) sq = sq.gte('started_at', from);
      if (to) sq = sq.lte('started_at', to);
      const { data: sess, error: selErr } = await sq;
      if (selErr) throw selErr;
      const ids = (sess ?? []).map((r: any) => r.id);
      let deleted = 0;
      if (ids.length > 0) {
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
