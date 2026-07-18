
-- Sequence for user labels
CREATE SEQUENCE IF NOT EXISTS public.tracking_user_seq START 1;

CREATE TABLE public.tracking_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_label TEXT NOT NULL,
  funnel TEXT NOT NULL,
  access_count INT NOT NULL DEFAULT 1,
  ip TEXT,
  city TEXT,
  region TEXT,
  country TEXT,
  user_agent TEXT,
  url TEXT,
  last_step TEXT,
  sale_status TEXT NOT NULL DEFAULT 'pending',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  duration_seconds INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tracking_sessions TO authenticated;
GRANT ALL ON public.tracking_sessions TO service_role;
ALTER TABLE public.tracking_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "no direct access" ON public.tracking_sessions FOR ALL USING (false) WITH CHECK (false);

CREATE TABLE public.tracking_events (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.tracking_sessions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB,
  url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON public.tracking_events (session_id, created_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tracking_events TO authenticated;
GRANT ALL ON public.tracking_events TO service_role;
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "no direct access" ON public.tracking_events FOR ALL USING (false) WITH CHECK (false);

CREATE TABLE public.tracking_recordings (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.tracking_sessions(id) ON DELETE CASCADE,
  events JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON public.tracking_recordings (session_id, created_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tracking_recordings TO authenticated;
GRANT ALL ON public.tracking_recordings TO service_role;
ALTER TABLE public.tracking_recordings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "no direct access" ON public.tracking_recordings FOR ALL USING (false) WITH CHECK (false);

CREATE TABLE public.oabtracker_auth_attempts (
  device_fp TEXT PRIMARY KEY,
  attempts INT NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ,
  last_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.oabtracker_auth_attempts TO authenticated;
GRANT ALL ON public.oabtracker_auth_attempts TO service_role;
ALTER TABLE public.oabtracker_auth_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "no direct access" ON public.oabtracker_auth_attempts FOR ALL USING (false) WITH CHECK (false);
