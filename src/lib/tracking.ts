// Client-side tracking helper. Registers session on load, logs events, records rrweb, and pings server.
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY_PREFIX = "oab_tracking_session_id:";
const USER_LABEL_KEY = "oab_tracking_user_label";

type SessionMeta = {
  funnel: string;
};

let currentSessionId: string | null = null;
let recordingEvents: any[] = [];
let stopFn: (() => void) | null = null;
let initPromise: Promise<void> | null = null;
let initedFunnel: string | null = null;
let flushTimer: number | null = null;
const pendingEvents: { event_type: string; payload: Record<string, any> }[] = [];

function getSessionKey(funnel: string) {
  return `${SESSION_KEY_PREFIX}${funnel}`;
}

async function getGeo() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function initTracking(meta: SessionMeta) {
  if (typeof window === "undefined") return;
  // Prevent double-invocation (React StrictMode / remounts) for the same funnel
  if (initedFunnel === meta.funnel && initPromise) return initPromise;
  if (initedFunnel !== meta.funnel) {
    currentSessionId = null;
    if (stopFn) {
      try { stopFn(); } catch {}
      stopFn = null;
    }
  }
  initedFunnel = meta.funnel;
  initPromise = (async () => {
  // Reuse session only inside the same funnel. Product pages and quizzes get separate rows.
  const sessionKey = getSessionKey(meta.funnel);
  const existing = sessionStorage.getItem(sessionKey);
  if (existing) {
    currentSessionId = existing;
  }
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

  // Start rrweb recording lazily
  try {
    const rrweb = await import("rrweb");
    stopFn = rrweb.record({
      emit(event) {
        recordingEvents.push(event);
        if (recordingEvents.length >= 50) flushRecording();
      },
    }) || null;
    if (flushTimer) window.clearInterval(flushTimer);
    flushTimer = window.setInterval(flushRecording, 15000);
  } catch (e) {
    // rrweb optional
  }
  })();
  return initPromise;
}

async function flushRecording() {
  if (!currentSessionId || recordingEvents.length === 0) return;
  const events = recordingEvents;
  recordingEvents = [];
  try {
    await supabase.functions.invoke("track-recording", {
      body: { session_id: currentSessionId, events },
    });
  } catch (e) {
    console.warn("track-recording err", e);
  }
}

export async function trackEvent(event_type: string, payload: Record<string, any> = {}) {
  if (!currentSessionId) {
    pendingEvents.push({ event_type, payload });
    return initPromise;
  }
  return sendEvent(event_type, payload);
}

async function sendEvent(event_type: string, payload: Record<string, any> = {}) {
  try {
    await supabase.functions.invoke("track-event", {
      body: {
        session_id: currentSessionId,
        event_type,
        payload,
        url: typeof window !== "undefined" ? window.location.href : undefined,
      },
    });
  } catch (e) {
    console.warn("track-event err", e);
  }
}

export function getSessionId() {
  return currentSessionId;
}
