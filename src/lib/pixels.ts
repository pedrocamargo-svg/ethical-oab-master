// Helpers para disparar eventos nos pixels Meta e TikTok (carregados globalmente no index.html)
export function pixelTrack(event: string, params: Record<string, unknown> = {}) {
  try { window.fbq?.("track", event, params); } catch {}
  try { window.ttq?.track(event, params); } catch {}
}

export function pixelTrackCustom(event: string, params: Record<string, unknown> = {}) {
  try { window.fbq?.("trackCustom", event, params); } catch {}
  try { window.ttq?.track(event, params); } catch {}
}
