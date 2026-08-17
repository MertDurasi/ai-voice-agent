CREATE OR REPLACE FUNCTION app.has_runtime_context(target_tenant_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, app
AS $function$
  SELECT
    pg_has_role(session_user, 'voice_ai_runtime', 'member')
    AND target_tenant_id = app.current_tenant_id()
    AND EXISTS (
      SELECT 1
      FROM app.memberships AS membership
      JOIN app.tenants AS tenant ON tenant.id = membership.tenant_id
      WHERE membership.id::text = current_setting('app.membership_id', true)
        AND membership.tenant_id = target_tenant_id
        AND membership.subject = app.current_actor_subject()
        AND membership.version::text = current_setting('app.membership_version', true)
        AND membership.role = current_setting('app.membership_role', true)
        AND membership.status = 'active'
        AND tenant.status = 'active'
    )
$function$;

REVOKE ALL ON FUNCTION app.has_runtime_context(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app.has_runtime_context(uuid) TO voice_ai_runtime;
