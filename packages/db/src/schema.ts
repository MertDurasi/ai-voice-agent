import { check, integer, pgSchema, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const applicationSchema = pgSchema('app');

export const tenants = applicationSchema.table(
  'tenants',
  {
    id: uuid().primaryKey(),
    tenantId: uuid('tenant_id').generatedAlwaysAs(sql`id`),
    status: text().notNull(),
    version: integer().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check('tenants_status_check', sql`${table.status} in ('active', 'suspended')`),
    check('tenants_version_check', sql`${table.version} > 0`),
    uniqueIndex('tenants_tenant_id_unique').on(table.tenantId),
  ],
);

export const memberships = applicationSchema.table(
  'memberships',
  {
    id: uuid().primaryKey(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict', onUpdate: 'restrict' }),
    subject: text().notNull(),
    role: text().notNull(),
    status: text().notNull(),
    version: integer().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check(
      'memberships_role_check',
      sql`${table.role} in ('tenant_owner', 'tenant_admin', 'agent', 'viewer')`,
    ),
    check('memberships_status_check', sql`${table.status} in ('active', 'disabled')`),
    check('memberships_version_check', sql`${table.version} > 0`),
    check('memberships_subject_check', sql`length(${table.subject}) between 1 and 255`),
    uniqueIndex('memberships_subject_tenant_unique').on(table.subject, table.tenantId),
  ],
);

export const systemAccessLog = applicationSchema.table(
  'system_access_log',
  {
    id: uuid().primaryKey(),
    actorRef: text('actor_ref').notNull(),
    reasonCode: text('reason_code').notNull(),
    operation: text().notNull(),
    sessionRole: text('session_role')
      .notNull()
      .default(sql`session_user`),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check(
      'system_access_log_actor_ref_check',
      sql`${table.actorRef} ~ '^sys_[A-Za-z0-9_-]{8,64}$'`,
    ),
    check(
      'system_access_log_reason_code_check',
      sql`${table.reasonCode} ~ '^[a-z][a-z0-9_.:-]{2,63}$'`,
    ),
    check(
      'system_access_log_operation_check',
      sql`${table.operation} ~ '^[a-z][a-z0-9_.:-]{2,127}$'`,
    ),
  ],
);
