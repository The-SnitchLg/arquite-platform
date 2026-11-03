-- ====================================================================
-- ARQUITÉ · Migración Integral de Base de Datos y Seguridad (Supabase PG 17)
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Tipos Enumerados
DO $$ BEGIN
  CREATE TYPE public.arq_role AS ENUM ('participant', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.arq_slot AS ENUM ('A', 'B');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.arq_diamond_state AS ENUM ('draft', 'closed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.arq_dimension AS ENUM ('personal', 'profesional');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.arq_context_key AS ENUM ('entorno', 'talentos', 'posibilidades');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.arq_threshold_status AS ENUM ('sin_iniciar', 'en_exploracion', 'accion_experimentada', 'cambio_documentado');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.arq_intervention_kind AS ENUM ('cognitivo', 'emocional', 'simbólico', 'estratégico');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.arq_module_type AS ENUM ('diamond', 'thresholds', 'letters');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Tabla de Perfiles vinculada a auth.users
CREATE TABLE IF NOT EXISTS public.arq_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role public.arq_role NOT NULL DEFAULT 'participant',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Tabla de Recorridos (Journeys)
CREATE TABLE IF NOT EXISTS public.arq_journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.arq_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revision BIGINT NOT NULL DEFAULT 1,
  UNIQUE(owner_id)
);

-- 4. Versiones del Diamante (Máximo 2 slots activos A/B)
CREATE TABLE IF NOT EXISTS public.arq_diamond_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id UUID NOT NULL REFERENCES public.arq_journeys(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL CHECK (version_number >= 1),
  slot public.arq_slot NOT NULL,
  status public.arq_diamond_state NOT NULL DEFAULT 'draft',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ,
  confirmed_by UUID REFERENCES public.arq_profiles(id),
  revision BIGINT NOT NULL DEFAULT 1,
  UNIQUE(journey_id, version_number),
  UNIQUE(journey_id, slot),
  CHECK ((status = 'draft' AND closed_at IS NULL AND confirmed_by IS NULL) OR
         (status = 'closed' AND closed_at IS NOT NULL AND confirmed_by IS NOT NULL))
);

-- 5. Las Tres Exploraciones por Versión
CREATE TABLE IF NOT EXISTS public.arq_diamond_contexts (
  version_id UUID NOT NULL REFERENCES public.arq_diamond_versions(id) ON DELETE CASCADE,
  context_key public.arq_context_key NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (version_id, context_key)
);

-- 6. Las Diez Decisiones Estratégicas por Versión
CREATE TABLE IF NOT EXISTS public.arq_diamond_answers (
  version_id UUID NOT NULL REFERENCES public.arq_diamond_versions(id) ON DELETE CASCADE,
  dimension public.arq_dimension NOT NULL,
  decision_index SMALLINT NOT NULL CHECK (decision_index BETWEEN 0 AND 4),
  body TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (version_id, dimension, decision_index)
);

-- 7. Siete Umbrales
CREATE TABLE IF NOT EXISTS public.arq_threshold_records (
  journey_id UUID NOT NULL REFERENCES public.arq_journeys(id) ON DELETE CASCADE,
  threshold_key TEXT NOT NULL CHECK (threshold_key IN ('U01','U02','U03','U04','U05','U06','U07')),
  status public.arq_threshold_status NOT NULL DEFAULT 'sin_iniciar',
  reflection TEXT NOT NULL DEFAULT '',
  evidence TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (journey_id, threshold_key)
);

-- 8. Historial de Eventos de Umbrales
CREATE TABLE IF NOT EXISTS public.arq_threshold_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id UUID NOT NULL REFERENCES public.arq_journeys(id) ON DELETE CASCADE,
  threshold_key TEXT NOT NULL,
  prior_status public.arq_threshold_status NOT NULL,
  new_status public.arq_threshold_status NOT NULL,
  prior_reflection TEXT NOT NULL,
  new_reflection TEXT NOT NULL,
  actor_id UUID NOT NULL REFERENCES public.arq_profiles(id),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Ruta de Intervención (7 Planes)
CREATE TABLE IF NOT EXISTS public.arq_interventions (
  journey_id UUID NOT NULL REFERENCES public.arq_journeys(id) ON DELETE CASCADE,
  intervention_key TEXT NOT NULL,
  threshold_key TEXT NOT NULL,
  kind public.arq_intervention_kind NOT NULL,
  action_text TEXT NOT NULL DEFAULT '',
  evidence_text TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (journey_id, intervention_key)
);

-- 10. Cartas al Futuro
CREATE TABLE IF NOT EXISTS public.arq_letters (
  journey_id UUID NOT NULL REFERENCES public.arq_journeys(id) ON DELETE CASCADE,
  dimension public.arq_dimension NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  is_sealed BOOLEAN NOT NULL DEFAULT false,
  sealed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (journey_id, dimension)
);

-- 11. Cierres Inmutables de Módulos (Snapshots)
CREATE TABLE IF NOT EXISTS public.arq_module_closures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id UUID NOT NULL REFERENCES public.arq_journeys(id) ON DELETE CASCADE,
  module public.arq_module_type NOT NULL,
  edition_no INTEGER NOT NULL DEFAULT 1,
  diamond_version_id UUID REFERENCES public.arq_diamond_versions(id) ON DELETE SET NULL,
  snapshot JSONB NOT NULL,
  snapshot_hash TEXT NOT NULL,
  closed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed_by UUID NOT NULL REFERENCES public.arq_profiles(id)
);

-- 12. Registro de Consentimientos de Sustitución
CREATE TABLE IF NOT EXISTS public.arq_replacement_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id UUID NOT NULL REFERENCES public.arq_journeys(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES public.arq_profiles(id),
  old_version_id UUID NOT NULL,
  recent_version_id UUID NOT NULL,
  new_version_id UUID NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  consented_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. Pista de Auditoría Oficial
CREATE TABLE IF NOT EXISTS public.arq_audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id UUID REFERENCES public.arq_journeys(id) ON DELETE SET NULL,
  actor_id UUID NOT NULL REFERENCES public.arq_profiles(id),
  event_type TEXT NOT NULL,
  target_kind TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ====================================================================
-- Habilitación de Row Level Security (RLS)
-- ====================================================================

ALTER TABLE public.arq_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arq_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arq_diamond_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arq_diamond_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arq_diamond_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arq_threshold_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arq_threshold_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arq_interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arq_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arq_module_closures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arq_replacement_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arq_audit_events ENABLE ROW LEVEL SECURITY;

-- Funciones auxiliares de verificación
CREATE OR REPLACE FUNCTION public.arq_is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.arq_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Políticas de perfiles
CREATE POLICY "profiles_select_own_or_admin" ON public.arq_profiles
  FOR SELECT USING (id = auth.uid() OR public.arq_is_admin());

CREATE POLICY "profiles_update_own" ON public.arq_profiles
  FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid() AND role = (SELECT role FROM public.arq_profiles WHERE id = auth.uid()));

-- Políticas de recorridos
CREATE POLICY "journeys_select" ON public.arq_journeys
  FOR SELECT USING (owner_id = auth.uid() OR public.arq_is_admin());

CREATE POLICY "journeys_insert_own" ON public.arq_journeys
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "journeys_update_own" ON public.arq_journeys
  FOR UPDATE USING (owner_id = auth.uid());

-- Políticas de versiones de diamantes
CREATE POLICY "diamond_versions_select" ON public.arq_diamond_versions
  FOR SELECT USING (
    journey_id IN (SELECT id FROM public.arq_journeys WHERE owner_id = auth.uid())
    OR public.arq_is_admin()
  );

CREATE POLICY "diamond_versions_insert_own" ON public.arq_diamond_versions
  FOR INSERT WITH CHECK (
    journey_id IN (SELECT id FROM public.arq_journeys WHERE owner_id = auth.uid())
  );

CREATE POLICY "diamond_versions_update_draft_only" ON public.arq_diamond_versions
  FOR UPDATE USING (
    journey_id IN (SELECT id FROM public.arq_journeys WHERE owner_id = auth.uid())
    AND status = 'draft'
  );

-- Triggers de Inmutabilidad para versiones cerradas
CREATE OR REPLACE FUNCTION public.arq_enforce_diamond_immutability()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF (SELECT status FROM public.arq_diamond_versions WHERE id = OLD.version_id) = 'closed' THEN
    RAISE EXCEPTION 'Operación denegada: Las versiones confirmadas de diamante son de solo lectura.' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_immutability_contexts ON public.arq_diamond_contexts;
CREATE TRIGGER trg_immutability_contexts
  BEFORE UPDATE OR DELETE ON public.arq_diamond_contexts
  FOR EACH ROW EXECUTE FUNCTION public.arq_enforce_diamond_immutability();

DROP TRIGGER IF EXISTS trg_immutability_answers ON public.arq_diamond_answers;
CREATE TRIGGER trg_immutability_answers
  BEFORE UPDATE OR DELETE ON public.arq_diamond_answers
  FOR EACH ROW EXECUTE FUNCTION public.arq_enforce_diamond_immutability();

-- Políticas para Contextos y Respuestas
CREATE POLICY "contexts_access" ON public.arq_diamond_contexts
  FOR ALL USING (
    version_id IN (
      SELECT v.id FROM public.arq_diamond_versions v
      JOIN public.arq_journeys j ON v.journey_id = j.id
      WHERE j.owner_id = auth.uid() OR public.arq_is_admin()
    )
  );

CREATE POLICY "answers_access" ON public.arq_diamond_answers
  FOR ALL USING (
    version_id IN (
      SELECT v.id FROM public.arq_diamond_versions v
      JOIN public.arq_journeys j ON v.journey_id = j.id
      WHERE j.owner_id = auth.uid() OR public.arq_is_admin()
    )
  );

-- Políticas para Umbrales, Intervenciones y Cartas
CREATE POLICY "thresholds_access" ON public.arq_threshold_records
  FOR ALL USING (
    journey_id IN (SELECT id FROM public.arq_journeys WHERE owner_id = auth.uid() OR public.arq_is_admin())
  );

CREATE POLICY "interventions_access" ON public.arq_interventions
  FOR ALL USING (
    journey_id IN (SELECT id FROM public.arq_journeys WHERE owner_id = auth.uid() OR public.arq_is_admin())
  );

CREATE POLICY "letters_access" ON public.arq_letters
  FOR ALL USING (
    journey_id IN (SELECT id FROM public.arq_journeys WHERE owner_id = auth.uid() OR public.arq_is_admin())
  );

CREATE POLICY "closures_select" ON public.arq_module_closures
  FOR SELECT USING (
    journey_id IN (SELECT id FROM public.arq_journeys WHERE owner_id = auth.uid() OR public.arq_is_admin())
  );

CREATE POLICY "audit_select_admin_only" ON public.arq_audit_events
  FOR SELECT USING (public.arq_is_admin());

-- ====================================================================
-- Transacción Atómica de Sustitución Consentida de Diamante
-- ====================================================================
CREATE OR REPLACE FUNCTION public.arq_renew_diamond(
  p_journey_id UUID,
  p_old_version_id UUID,
  p_recent_version_id UUID,
  p_idempotency_key TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_v1 RECORD;
  v_v2 RECORD;
  v_new_v3_id UUID;
  v_next_num INT;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No autenticado' USING ERRCODE = '42501';
  END IF;

  PERFORM 1 FROM public.arq_journeys 
  WHERE id = p_journey_id AND owner_id = v_user_id FOR UPDATE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Recorrido no autorizado o inexistente' USING ERRCODE = '42501';
  END IF;

  IF EXISTS (SELECT 1 FROM public.arq_replacement_consents WHERE idempotency_key = p_idempotency_key) THEN
    RETURN jsonb_build_object('status', 'already_processed');
  END IF;

  SELECT * INTO v_v1 FROM public.arq_diamond_versions 
  WHERE id = p_old_version_id AND journey_id = p_journey_id AND slot = 'A' AND status = 'closed' FOR UPDATE;

  SELECT * INTO v_v2 FROM public.arq_diamond_versions 
  WHERE id = p_recent_version_id AND journey_id = p_journey_id AND slot = 'B' AND status = 'closed' FOR UPDATE;

  IF v_v1.id IS NULL OR v_v2.id IS NULL THEN
    RAISE EXCEPTION 'Conflicto: ambas versiones deben existir, pertenecer a este recorrido y estar cerradas';
  END IF;

  SELECT COALESCE(MAX(version_number), 0) + 1 INTO v_next_num 
  FROM public.arq_diamond_versions WHERE journey_id = p_journey_id;

  -- 1. Purgar versión antigua del Slot A
  DELETE FROM public.arq_diamond_versions WHERE id = v_v1.id;

  -- 2. Trasladar v2 a Slot A (Referencia inmutable)
  UPDATE public.arq_diamond_versions SET slot = 'A' WHERE id = v_v2.id;

  -- 3. Crear nueva versión editable en Slot B
  INSERT INTO public.arq_diamond_versions (journey_id, version_number, slot, status, revision)
  VALUES (p_journey_id, v_next_num, 'B', 'draft', 1)
  RETURNING id INTO v_new_v3_id;

  -- 4. Registrar consentimiento y auditoría
  INSERT INTO public.arq_replacement_consents (
    journey_id, actor_id, old_version_id, recent_version_id, new_version_id, idempotency_key
  ) VALUES (
    p_journey_id, v_user_id, p_old_version_id, p_recent_version_id, v_new_v3_id, p_idempotency_key
  );

  INSERT INTO public.arq_audit_events (
    actor_id, journey_id, event_type, target_kind, target_id, details
  ) VALUES (
    v_user_id, p_journey_id, 'DIAMOND_RENEWAL', 'diamond_version', v_new_v3_id,
    'Sustitución consentida: v' || v_v1.version_number || ' reemplazada, v' || v_v2.version_number || ' movida a A, nueva v' || v_next_num || ' en B'
  );

  RETURN jsonb_build_object(
    'status', 'success',
    'slot_a_version_id', v_v2.id,
    'slot_b_version_id', v_new_v3_id,
    'version_number', v_next_num
  );
END;
$$;
