CREATE SCHEMA IF NOT EXISTS app AUTHORIZATION voice_ai_migrator;
CREATE SCHEMA IF NOT EXISTS voice_ai_internal AUTHORIZATION voice_ai_migrator;

REVOKE ALL ON SCHEMA app FROM PUBLIC;
REVOKE ALL ON SCHEMA voice_ai_internal FROM PUBLIC;
GRANT USAGE ON SCHEMA app TO voice_ai_runtime, voice_ai_system;

CREATE OR REPLACE FUNCTION app.current_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
PARALLEL SAFE
AS $function$
  SELECT CASE
    WHEN current_setting('app.tenant_id', true) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      THEN current_setting('app.tenant_id', true)::uuid
    ELSE NULL
  END
$function$;

CREATE OR REPLACE FUNCTION app.current_actor_subject()
RETURNS text
LANGUAGE sql
STABLE
PARALLEL SAFE
AS $function$
  SELECT NULLIF(current_setting('app.actor_subject', true), '')
$function$;

CREATE OR REPLACE FUNCTION app.has_runtime_context(target_tenant_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
PARALLEL SAFE
AS $function$
  SELECT
    target_tenant_id = app.current_tenant_id()
    AND app.current_actor_subject() IS NOT NULL
    AND current_setting('app.membership_id', true) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    AND current_setting('app.membership_version', true) ~ '^[1-9][0-9]*$'
    AND current_setting('app.membership_role', true) IN ('tenant_owner', 'tenant_admin', 'agent', 'viewer')
$function$;

CREATE TABLE IF NOT EXISTS app.system_access_log (
  id uuid PRIMARY KEY,
  actor_ref text NOT NULL CHECK (actor_ref ~ '^sys_[A-Za-z0-9_-]{8,64}$'),
  reason_code text NOT NULL CHECK (reason_code ~ '^[a-z][a-z0-9_.:-]{2,63}$'),
  operation text NOT NULL CHECK (operation ~ '^[a-z][a-z0-9_.:-]{2,127}$'),
  session_role name NOT NULL DEFAULT session_user,
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp()
);

CREATE OR REPLACE FUNCTION app.has_system_access()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, app
AS $function$
  SELECT
    pg_has_role(session_user, 'voice_ai_system', 'member')
    AND EXISTS (
      SELECT 1
      FROM app.system_access_log AS access
      WHERE access.id::text = current_setting('app.system_access_id', true)
        AND access.session_role = session_user
    )
$function$;

REVOKE ALL ON FUNCTION app.current_tenant_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION app.current_actor_subject() FROM PUBLIC;
REVOKE ALL ON FUNCTION app.has_runtime_context(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION app.has_system_access() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app.current_tenant_id() TO voice_ai_runtime;
GRANT EXECUTE ON FUNCTION app.current_actor_subject() TO voice_ai_runtime;
GRANT EXECUTE ON FUNCTION app.has_runtime_context(uuid) TO voice_ai_runtime;
GRANT EXECUTE ON FUNCTION app.has_system_access() TO voice_ai_system;

CREATE TABLE IF NOT EXISTS app.tenants (
  id uuid PRIMARY KEY,
  tenant_id uuid GENERATED ALWAYS AS (id) STORED NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'suspended')),
  version integer NOT NULL CHECK (version > 0),
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  CONSTRAINT tenants_tenant_id_unique UNIQUE (tenant_id)
);

CREATE TABLE IF NOT EXISTS app.memberships (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES app.tenants(id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  subject text NOT NULL CHECK (length(subject) BETWEEN 1 AND 255),
  role text NOT NULL CHECK (role IN ('tenant_owner', 'tenant_admin', 'agent', 'viewer')),
  status text NOT NULL CHECK (status IN ('active', 'disabled')),
  version integer NOT NULL CHECK (version > 0),
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  CONSTRAINT memberships_subject_tenant_unique UNIQUE (subject, tenant_id)
);

CREATE INDEX IF NOT EXISTS memberships_tenant_id_index ON app.memberships(tenant_id);

ALTER TABLE app.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.tenants FORCE ROW LEVEL SECURITY;
ALTER TABLE app.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.memberships FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenants_migrator_all ON app.tenants;
CREATE POLICY tenants_migrator_all ON app.tenants
  FOR ALL TO voice_ai_migrator
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS memberships_migrator_all ON app.memberships;
CREATE POLICY memberships_migrator_all ON app.memberships
  FOR ALL TO voice_ai_migrator
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS tenants_runtime_select ON app.tenants;
CREATE POLICY tenants_runtime_select ON app.tenants
  FOR SELECT TO voice_ai_runtime
  USING (
    tenant_id = app.current_tenant_id()
    AND EXISTS (
      SELECT 1
      FROM app.memberships AS membership
      WHERE membership.tenant_id = tenants.id
        AND membership.subject = app.current_actor_subject()
    )
  );

DROP POLICY IF EXISTS tenants_runtime_insert ON app.tenants;
CREATE POLICY tenants_runtime_insert ON app.tenants
  FOR INSERT TO voice_ai_runtime
  WITH CHECK (app.has_runtime_context(tenant_id));

DROP POLICY IF EXISTS tenants_runtime_update ON app.tenants;
CREATE POLICY tenants_runtime_update ON app.tenants
  FOR UPDATE TO voice_ai_runtime
  USING (app.has_runtime_context(tenant_id))
  WITH CHECK (app.has_runtime_context(tenant_id));

DROP POLICY IF EXISTS tenants_runtime_delete ON app.tenants;
CREATE POLICY tenants_runtime_delete ON app.tenants
  FOR DELETE TO voice_ai_runtime
  USING (app.has_runtime_context(tenant_id));

DROP POLICY IF EXISTS tenants_system_select ON app.tenants;
CREATE POLICY tenants_system_select ON app.tenants
  FOR SELECT TO voice_ai_system
  USING (app.has_system_access());

DROP POLICY IF EXISTS memberships_runtime_select ON app.memberships;
CREATE POLICY memberships_runtime_select ON app.memberships
  FOR SELECT TO voice_ai_runtime
  USING (
    tenant_id = app.current_tenant_id()
    AND (
      subject = app.current_actor_subject()
      OR app.has_runtime_context(tenant_id)
    )
  );

DROP POLICY IF EXISTS memberships_runtime_insert ON app.memberships;
CREATE POLICY memberships_runtime_insert ON app.memberships
  FOR INSERT TO voice_ai_runtime
  WITH CHECK (app.has_runtime_context(tenant_id));

DROP POLICY IF EXISTS memberships_runtime_update ON app.memberships;
CREATE POLICY memberships_runtime_update ON app.memberships
  FOR UPDATE TO voice_ai_runtime
  USING (app.has_runtime_context(tenant_id))
  WITH CHECK (app.has_runtime_context(tenant_id));

DROP POLICY IF EXISTS memberships_runtime_delete ON app.memberships;
CREATE POLICY memberships_runtime_delete ON app.memberships
  FOR DELETE TO voice_ai_runtime
  USING (app.has_runtime_context(tenant_id));

DROP POLICY IF EXISTS memberships_system_select ON app.memberships;
CREATE POLICY memberships_system_select ON app.memberships
  FOR SELECT TO voice_ai_system
  USING (app.has_system_access());

REVOKE ALL ON ALL TABLES IN SCHEMA app FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON app.tenants, app.memberships TO voice_ai_runtime;
GRANT SELECT ON app.tenants, app.memberships TO voice_ai_system;
GRANT INSERT ON app.system_access_log TO voice_ai_system;

ALTER DEFAULT PRIVILEGES FOR ROLE voice_ai_migrator IN SCHEMA app REVOKE ALL ON TABLES FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE voice_ai_migrator IN SCHEMA app REVOKE ALL ON FUNCTIONS FROM PUBLIC;
