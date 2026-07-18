// Client-side tracking: session registration, event logging, and click capture for heatmaps.
// No screen recording — only lightweight events.
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY_PREFIX = "oab_tracking_session_id:";
const USER_LABEL_KEY = "oab_tracking_user_label";

type SessionMeta = { funnel: string };

let currentSessionId: string | null = null;
let initPromise: Promise<void> | null = null;
let initedFunnel: string | null = null;
const pendingEvents: { event_type: string; payload: Record<string, any> }[] = [];

// --- click batching for heatmap ---
type Click = { path: string; x_pct: number; y_pct: number; vw: number; vh: number; tag?: string; text?: string };
let clickBuffer: Click[] = [];
let clickTimer: number | null = null;
let clickHandlerBound = false;

async function getGeo() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

function getSessionKey(funnel: string) { return `${SESSION_KEY_PREFIX}${funnel}`; }

export async function initTracking(meta: SessionMeta) {
  if (typeof window === "undefined") return;
  if (initedFunnel === meta.funnel && initPromise) return initPromise;
  if (initedFunnel !== meta.funnel) {
    flushClicks();
    currentSessionId = null;
  }
  initedFunnel = meta.funnel;
  bindClickCapture();

  initPromise = (async () => {
    const sessionKey = getSessionKey(meta.funnel);
    const existing = sessionStorage.getItem(sessionKey);
    if (existing) currentSessionId = existing;
    const geo = await getGeo();
    const label = localStorage.getItem(USER_LABEL_KEY) || undefined;
    try {
      const { data, error } = await supabase.functions.invoke("track-session", {
        body: {
          session_id: currentSessionId,
          user_label: label,
          funnel: meta.funnel,
          url: window.location.href,
          user_agent: navigator.userAgent,
          ip: geo?.ip,
          city: geo?.city,
          region: geo?.region,
          country: geo?.country_name,
        },
      });
      if (!error && data?.session_id) {
        currentSessionId = data.session_id;
        sessionStorage.setItem(sessionKey, currentSessionId!);
        if (data.user_label) localStorage.setItem(USER_LABEL_KEY, data.user_label);
      }
    } catch (e) {
      console.warn("track-session err", e);
    }
    while (pendingEvents.length && currentSessionId) {
      const ev = pendingEvents.shift();
      if (ev) await sendEvent(ev.event_type, ev.payload);
    }
  })();
  return initPromise;
}

function bindClickCapture() {
  if (clickHandlerBound || typeof window === "undefined") return;
  clickHandlerBound = true;
  window.addEventListener("click", (e) => {
    try {
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      const target = e.target as HTMLElement | null;
      const rect = { x: e.clientX, y: e.clientY };
      const tag = target?.tagName?.toLowerCase();
      const text = (target?.innerText || "").trim().slice(0, 60) || undefined;
      clickBuffer.push({
        path: window.location.pathname + window.location.search,
        x_pct: +(rect.x / vw).toFixed(4),
        y_pct: +((rect.y + window.scrollY) / (document.documentElement.scrollHeight || vh)).toFixed(4),
        vw,
        vh: document.documentElement.scrollHeight || vh,
        tag,
        text,
      });
      if (clickTimer) window.clearTimeout(clickTimer);
      clickTimer = window.setTimeout(flushClicks, 2000);
    } catch {}
  }, { capture: true });
  window.addEventListener("pagehide", () => flushClicks(true), { capture: true });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushClicks(true);
  });
}

function flushClicks(useBeacon = false) {
  if (!currentSessionId || clickBuffer.length === 0) return;
  const clicks = clickBuffer;
  clickBuffer = [];
  try {
    postFn("track-event", {
      session_id: currentSessionId,
      event_type: "heatmap_clicks",
      payload: { clicks },
      url: window.location.href,
    }, useBeacon);
  } catch {}
}

export async function trackEvent(event_type: string, payload: Record<string, any> = {}) {
  if (!currentSessionId) {
    pendingEvents.push({ event_type, payload });
    return initPromise;
  }
  return sendEvent(event_type, payload);
}

// Kept for backward-compat with existing call sites — now just sends the event
// without any recording flush (no more freezes at checkout/quiz transitions).
export async function trackEventAndFlush(event_type: string, payload: Record<string, any> = {}) {
  if (initPromise) { try { await initPromise; } catch {} }
  if (!currentSessionId) {
    pendingEvents.push({ event_type, payload });
    return;
  }
  flushClicks(true);
  await sendEvent(event_type, payload, true);
}

async function sendEvent(event_type: string, payload: Record<string, any> = {}, keepalive = false) {
  try {
    await postFn("track-event", {
      session_id: currentSessionId,
      event_type,
      payload,
      url: typeof window !== "undefined" ? window.location.href : undefined,
    }, keepalive);
  } catch (e) {
    console.warn("track-event err", e);
  }
}

function postFn(name: string, body: any, keepalive = false) {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${name}`;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
    keepalive,
  });
}

export function getSessionId() { return currentSessionId; }
export async function flushTrackingNow() { flushClicks(true); }
