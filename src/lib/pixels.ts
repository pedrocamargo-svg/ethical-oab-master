// Helpers para disparar eventos nos pixels Meta e TikTok (carregados globalmente no index.html)
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    ttq?: { track: (name: string, params?: any) => void };
  }
}

export function pixelTrack(event: string, params: Record<string, any> = {}) {
  try { window.fbq?.("track", event, params); } catch {}
  try { window.ttq?.track(event, params); } catch {}
}

export function pixelTrackCustom(event: string, params: Record<string, any> = {}) {
  try { window.fbq?.("trackCustom", event, params); } catch {}
  try { window.ttq?.track(event, params); } catch {}
}
