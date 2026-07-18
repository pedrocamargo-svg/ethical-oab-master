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
let recordReadyPromise: Promise<void> | null = null;
let initPromise: Promise<void> | null = null;
let initedFunnel: string | null = null;
let flushTimer: number | null = null;
const pendingEvents: { event_type: string; payload: Record<string, any> }[] = [];

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

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
    // Before leaving a quiz/product funnel, push the final recording chunk while
    // the previous session_id is still available. This prevents blank replays
    // when the user immediately opens the personalized sales page.
    await flushTrackingNow(false);
    currentSessionId = null;
    if (stopFn) {
      try { stopFn(); } catch {}
      stopFn = null;
    }
    recordReadyPromise = null;
  }
  initedFunnel = meta.funnel;
  startRecording();
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
      // Upload an initial full snapshot as soon as the session exists, so the
      // tracker can replay even if the visitor moves to the next page quickly.
      await flushTrackingNow(false);
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

function startRecording() {
  if (stopFn || recordReadyPromise) return;
  recordReadyPromise = import("rrweb").then((rrweb) => {
    stopFn = rrweb.record({
      emit(event) {
        recordingEvents.push(event);
        if (recordingEvents.length >= 50) flushRecording();
      },
      // Inline external CSS/images/fonts so the replayer can render the page even if
      // the original stylesheets are cross-origin or no longer reachable.
      inlineStylesheet: true,
      collectFonts: true,
      inlineImages: true,
      recordCanvas: false,
      // Force a fresh full snapshot every 30s so any opened window has one.
      checkoutEveryNms: 30_000,
    }) || null;
    try { rrweb.takeFullSnapshot?.(true); } catch {}
    if (flushTimer) window.clearInterval(flushTimer);
    flushTimer = window.setInterval(() => flushRecording(false), 5000);
    window.addEventListener("pagehide", () => flushRecording(true), { capture: true });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flushRecording(true);
    });
  }).then(() => undefined).catch(() => {
    recordReadyPromise = null;
    // rrweb optional
  }).catch(() => {
    // rrweb optional
  });
}

async function forceFullSnapshot() {
  if (typeof window === "undefined") return;
  try {
    startRecording();
    if (recordReadyPromise) await Promise.race([recordReadyPromise, wait(1500)]);
    const rrweb = await import("rrweb");
    rrweb.takeFullSnapshot?.(true);
    // Give rrweb one tick to emit the full snapshot before we upload the chunk.
    await wait(150);
  } catch {
    // recording is best-effort
  }
}

export async function flushTrackingNow(useBeacon = false) {
  if (!currentSessionId) return;
  await forceFullSnapshot();
  await flushRecording(useBeacon);
}

async function flushRecording(useBeacon = false) {
  if (!currentSessionId || recordingEvents.length === 0) return;
  const events = recordingEvents;
  recordingEvents = [];
  try {
    await postFn("track-recording", { session_id: currentSessionId, events }, useBeacon);
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

export async function trackEventAndFlush(event_type: string, payload: Record<string, any> = {}) {
  if (initPromise) {
    try { await initPromise; } catch {}
  }
  if (!currentSessionId) {
    pendingEvents.push({ event_type, payload });
    return;
  }
  await flushTrackingNow(false);
  await sendEvent(event_type, payload, false);
  await flushRecording(false);
}

async function sendEvent(event_type: string, payload: Record<string, any> = {}, keepalive = true) {
  try {
    // Flush any pending recording first so the moment of the event is captured.
    await flushRecording(keepalive);
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

export function getSessionId() {
  return currentSessionId;
}
