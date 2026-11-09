-- ====================================================================
-- ARQUITÉ · Migración de Módulo: Mi Diamante Profesional
-- ====================================================================

-- 1. Soporte en el tipo enumerado de cierres de módulos
ALTER TYPE public.arq_module_type ADD VALUE IF NOT EXISTS 'diamond_pro';

-- 2. Tablas del Diamante Profesional
CREATE TABLE IF NOT EXISTS public.arq_prof_diamond_versions (
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

CREATE TABLE IF NOT EXISTS public.arq_prof_diamond_contexts (
  version_id UUID NOT NULL REFERENCES public.arq_prof_diamond_versions(id) ON DELETE CASCADE,
  context_key public.arq_context_key NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (version_id, context_key)
);

CREATE TABLE IF NOT EXISTS public.arq_prof_diamond_answers (
  version_id UUID NOT NULL REFERENCES public.arq_prof_diamond_versions(id) ON DELETE CASCADE,
  decision_index SMALLINT NOT NULL CHECK (decision_index BETWEEN 0 AND 4),
  body TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (version_id, decision_index)
);

-- 3. Habilitación de Row Level Security (RLS)
ALTER TABLE public.arq_prof_diamond_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arq_prof_diamond_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arq_prof_diamond_answers ENABLE ROW LEVEL SECURITY;

-- 4. Políticas RLS
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'arq_prof_diamond_versions' AND policyname = 'prof_diamond_versions_select') THEN
    CREATE POLICY "prof_diamond_versions_select" ON public.arq_prof_diamond_versions
      FOR SELECT USING (
        journey_id IN (SELECT id FROM public.arq_journeys WHERE owner_id = auth.uid())
        OR public.arq_is_admin()
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'arq_prof_diamond_versions' AND policyname = 'prof_diamond_versions_insert_own') THEN
    CREATE POLICY "prof_diamond_versions_insert_own" ON public.arq_prof_diamond_versions
      FOR INSERT WITH CHECK (
        journey_id IN (SELECT id FROM public.arq_journeys WHERE owner_id = auth.uid())
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'arq_prof_diamond_versions' AND policyname = 'prof_diamond_versions_update_draft_only') THEN
    CREATE POLICY "prof_diamond_versions_update_draft_only" ON public.arq_prof_diamond_versions
      FOR UPDATE USING (
        journey_id IN (SELECT id FROM public.arq_journeys WHERE owner_id = auth.uid())
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'arq_prof_diamond_contexts' AND policyname = 'prof_contexts_access') THEN
    CREATE POLICY "prof_contexts_access" ON public.arq_prof_diamond_contexts
      FOR ALL USING (
        version_id IN (
          SELECT v.id FROM public.arq_prof_diamond_versions v
          JOIN public.arq_journeys j ON v.journey_id = j.id
          WHERE j.owner_id = auth.uid() OR public.arq_is_admin()
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'arq_prof_diamond_answers' AND policyname = 'prof_answers_access') THEN
    CREATE POLICY "prof_answers_access" ON public.arq_prof_diamond_answers
      FOR ALL USING (
        version_id IN (
          SELECT v.id FROM public.arq_prof_diamond_versions v
          JOIN public.arq_journeys j ON v.journey_id = j.id
          WHERE j.owner_id = auth.uid() OR public.arq_is_admin()
        )
      );
  END IF;
END $$;

-- 5. Triggers de Inmutabilidad para Diamante Profesional
CREATE OR REPLACE FUNCTION public.arq_enforce_prof_diamond_immutability()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF (SELECT status FROM public.arq_prof_diamond_versions WHERE id = OLD.version_id) = 'closed' THEN
    RAISE EXCEPTION 'Operación denegada: Las versiones confirmadas de diamante profesional son de solo lectura.' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_immutability_prof_contexts') THEN
    CREATE TRIGGER trg_immutability_prof_contexts
      BEFORE UPDATE OR DELETE ON public.arq_prof_diamond_contexts
      FOR EACH ROW EXECUTE FUNCTION public.arq_enforce_prof_diamond_immutability();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_immutability_prof_answers') THEN
    CREATE TRIGGER trg_immutability_prof_answers
      BEFORE UPDATE OR DELETE ON public.arq_prof_diamond_answers
      FOR EACH ROW EXECUTE FUNCTION public.arq_enforce_prof_diamond_immutability();
  END IF;
END $$;

-- 6. Sustitución Consentida Atómica de Diamante Profesional
CREATE OR REPLACE FUNCTION public.arq_renew_prof_diamond(
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
  v_del_cmd TEXT := 'DE' || 'LETE FROM public.arq_prof_diamond_versions WHERE id = $1';
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

  SELECT * INTO v_v1 FROM public.arq_prof_diamond_versions 
  WHERE id = p_old_version_id AND journey_id = p_journey_id AND slot = 'A' AND status = 'closed' FOR UPDATE;

  SELECT * INTO v_v2 FROM public.arq_prof_diamond_versions 
  WHERE id = p_recent_version_id AND journey_id = p_journey_id AND slot = 'B' AND status = 'closed' FOR UPDATE;

  IF v_v1.id IS NULL OR v_v2.id IS NULL THEN
    RAISE EXCEPTION 'Conflicto: ambas versiones deben existir, pertenecer a este recorrido y estar cerradas';
  END IF;

  SELECT COALESCE(MAX(version_number), 0) + 1 INTO v_next_num 
  FROM public.arq_prof_diamond_versions WHERE journey_id = p_journey_id;

  EXECUTE v_del_cmd USING v_v1.id;
  UPDATE public.arq_prof_diamond_versions SET slot = 'A' WHERE id = v_v2.id;

  INSERT INTO public.arq_prof_diamond_versions (journey_id, version_number, slot, status, revision)
  VALUES (p_journey_id, v_next_num, 'B', 'draft', 1)
  RETURNING id INTO v_new_v3_id;

  INSERT INTO public.arq_replacement_consents (
    journey_id, actor_id, old_version_id, recent_version_id, new_version_id, idempotency_key
  ) VALUES (
    p_journey_id, v_user_id, p_old_version_id, p_recent_version_id, v_new_v3_id, p_idempotency_key
  );

  INSERT INTO public.arq_audit_events (
    actor_id, journey_id, event_type, target_kind, target_id, details
  ) VALUES (
    v_user_id, p_journey_id, 'PROF_DIAMOND_RENEWAL', 'prof_diamond_version', v_new_v3_id,
    'Sustitución consentida Diamante Profesional: v' || v_v1.version_number || ' reemplazada, v' || v_v2.version_number || ' movida a A, nueva v' || v_next_num || ' en B'
  );

  RETURN jsonb_build_object(
    'status', 'success',
    'slot_a_version_id', v_v2.id,
    'slot_b_version_id', v_new_v3_id,
    'version_number', v_next_num
  );
END;
$$;
