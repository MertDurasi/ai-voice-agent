DO $roles$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'voice_ai_migrator') THEN
    CREATE ROLE voice_ai_migrator NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'voice_ai_runtime') THEN
    CREATE ROLE voice_ai_runtime NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'voice_ai_system') THEN
    CREATE ROLE voice_ai_system NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'voice_ai_migration_login') THEN
    CREATE ROLE voice_ai_migration_login LOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'voice_ai_runtime_login') THEN
    CREATE ROLE voice_ai_runtime_login LOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'voice_ai_system_login') THEN
    CREATE ROLE voice_ai_system_login LOGIN;
  END IF;
END
$roles$;

ALTER ROLE voice_ai_migrator NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
ALTER ROLE voice_ai_runtime NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
ALTER ROLE voice_ai_system NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
ALTER ROLE voice_ai_migration_login LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
ALTER ROLE voice_ai_runtime_login LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
ALTER ROLE voice_ai_system_login LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;

GRANT voice_ai_migrator TO voice_ai_migration_login;
GRANT voice_ai_runtime TO voice_ai_runtime_login;
GRANT voice_ai_system TO voice_ai_system_login;

REVOKE voice_ai_runtime, voice_ai_system FROM voice_ai_migration_login;
REVOKE voice_ai_migrator, voice_ai_system FROM voice_ai_runtime_login;
REVOKE voice_ai_migrator, voice_ai_runtime FROM voice_ai_system_login;

DO $database_privileges$
BEGIN
  EXECUTE format(
    'GRANT CONNECT, CREATE ON DATABASE %I TO voice_ai_migrator',
    current_database()
  );
  EXECUTE format(
    'GRANT CONNECT ON DATABASE %I TO voice_ai_runtime, voice_ai_system',
    current_database()
  );
END
$database_privileges$;
