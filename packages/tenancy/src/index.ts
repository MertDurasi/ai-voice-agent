import { createHash } from 'node:crypto';

export const tenantRoles = Object.freeze([
  'tenant_owner',
  'tenant_admin',
  'agent',
  'viewer',
] as const);

export const tenantPermissions = Object.freeze([
  'tenant:read',
  'tenant:manage',
  'members:read',
  'members:manage',
  'work:read',
  'work:write',
] as const);

export type TenantRole = (typeof tenantRoles)[number];
export type TenantPermission = (typeof tenantPermissions)[number];
export type TenantStatus = 'active' | 'suspended';
export type MembershipStatus = 'active' | 'disabled';

export interface Tenant {
  readonly id: string;
  readonly status: TenantStatus;
  readonly version: number;
}

export interface Membership {
  readonly id: string;
  readonly role: TenantRole;
  readonly status: MembershipStatus;
  readonly subject: string;
  readonly tenantId: string;
  readonly version: number;
}

export interface TenantContext {
  readonly actorSubject: string;
  readonly membershipId: string;
  readonly membershipVersion: number;
  readonly role: TenantRole;
  readonly tenantId: string;
}

export interface MembershipResolution {
  readonly membership: Membership;
  readonly tenant: Tenant;
}

export interface MembershipDirectory {
  findBySubjectAndTenant(
    subject: string,
    tenantId: string,
  ): Promise<MembershipResolution | undefined>;
}

export interface TenantPrincipal {
  readonly subject: string;
}

export interface TenantLogCorrelation {
  readonly actorRef: string;
  readonly tenantRef: string;
}

export type JsonPrimitive = boolean | null | number | string;
export type JsonValue =
  JsonPrimitive | readonly JsonValue[] | { readonly [key: string]: JsonValue };

export interface TenantJobEnvelope<TPayload extends JsonValue = JsonValue> {
  readonly context: TenantContext;
  readonly jobId: string;
  readonly jobType: string;
  readonly payload: TPayload;
  readonly schemaVersion: 1;
}

export class TenantAccessDeniedError extends Error {
  public readonly code = 'tenant_access_denied';

  public constructor(options?: ErrorOptions) {
    super('Tenant access denied.', options);
    this.name = 'TenantAccessDeniedError';
  }
}

export class InvalidTenantContractError extends Error {
  public readonly code = 'tenant_contract_invalid';

  public constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'InvalidTenantContractError';
  }
}

const rolePermissions: Readonly<Record<TenantRole, ReadonlySet<TenantPermission>>> = Object.freeze({
  agent: new Set<TenantPermission>(['tenant:read', 'work:read', 'work:write']),
  tenant_admin: new Set<TenantPermission>([
    'tenant:read',
    'members:read',
    'members:manage',
    'work:read',
    'work:write',
  ]),
  tenant_owner: new Set<TenantPermission>(tenantPermissions),
  viewer: new Set<TenantPermission>(['tenant:read', 'work:read']),
});

const tenantRoleSet = new Set<string>(tenantRoles);
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;
const jobTypePattern = /^[a-z][a-z0-9_.:-]{0,127}$/u;
const forbiddenPayloadKeys = new Set([
  'actorsubject',
  'membershipid',
  'membershipversion',
  'tenantcontext',
  'tenantid',
  'tenantref',
]);
const forbiddenObjectKeys = new Set(['__proto__', 'constructor', 'prototype']);

function assertUuid(value: string, field: string): void {
  if (!uuidPattern.test(value)) throw new InvalidTenantContractError(`${field} must be a UUID.`);
}

function assertVersion(value: number, field: string): void {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new InvalidTenantContractError(`${field} must be a positive integer.`);
  }
}

function assertSubject(value: string): void {
  if (value.length === 0 || value.length > 255 || /[\u0000-\u001f\u007f]/u.test(value)) {
    throw new InvalidTenantContractError('subject is invalid.');
  }
}

function isTenantRole(value: unknown): value is TenantRole {
  return typeof value === 'string' && tenantRoleSet.has(value);
}

function freezeTenantContext(value: TenantContext): TenantContext {
  assertSubject(value.actorSubject);
  assertUuid(value.membershipId, 'membershipId');
  assertVersion(value.membershipVersion, 'membershipVersion');
  if (!isTenantRole(value.role)) throw new InvalidTenantContractError('role is invalid.');
  assertUuid(value.tenantId, 'tenantId');
  return Object.freeze({ ...value });
}

export function createTenant(value: Tenant): Tenant {
  assertUuid(value.id, 'tenant.id');
  assertVersion(value.version, 'tenant.version');
  if (value.status !== 'active' && value.status !== 'suspended') {
    throw new InvalidTenantContractError('tenant.status is invalid.');
  }
  return Object.freeze({ ...value });
}

export function createMembership(value: Membership): Membership {
  assertUuid(value.id, 'membership.id');
  assertSubject(value.subject);
  assertUuid(value.tenantId, 'membership.tenantId');
  assertVersion(value.version, 'membership.version');
  if (!isTenantRole(value.role))
    throw new InvalidTenantContractError('membership.role is invalid.');
  if (value.status !== 'active' && value.status !== 'disabled') {
    throw new InvalidTenantContractError('membership.status is invalid.');
  }
  return Object.freeze({ ...value });
}

export function roleAllows(role: TenantRole, permission: TenantPermission): boolean {
  return rolePermissions[role].has(permission);
}

export function permissionsForRole(role: TenantRole): readonly TenantPermission[] {
  return Object.freeze(tenantPermissions.filter((permission) => roleAllows(role, permission)));
}

function correlationRef(namespace: 'actor' | 'tenant', value: string): string {
  return `${namespace === 'actor' ? 'act' : 'ten'}_${createHash('sha256')
    .update(`voice-ai:${namespace}:`, 'utf8')
    .update(value, 'utf8')
    .digest('base64url')
    .slice(0, 22)}`;
}

export function tenantLogCorrelation(context: TenantContext): TenantLogCorrelation {
  const validated = freezeTenantContext(context);
  return Object.freeze({
    // The high-entropy membership UUID avoids deriving a stable log key from a
    // potentially human-readable identity-provider subject.
    actorRef: correlationRef('actor', validated.membershipId),
    tenantRef: correlationRef('tenant', validated.tenantId),
  });
}

export class EmptyMembershipDirectory implements MembershipDirectory {
  public findBySubjectAndTenant(): Promise<undefined> {
    return Promise.resolve(undefined);
  }
}

export class InMemoryMembershipDirectory implements MembershipDirectory {
  readonly #memberships: ReadonlyMap<string, Membership>;
  readonly #tenants: ReadonlyMap<string, Tenant>;

  public constructor(tenants: readonly Tenant[], memberships: readonly Membership[]) {
    const tenantEntries = tenants.map((tenant) => {
      const validated = createTenant(tenant);
      return [validated.id, validated] as const;
    });
    const membershipEntries = memberships.map((membership) => {
      const validated = createMembership(membership);
      return [`${validated.subject}\u0000${validated.tenantId}`, validated] as const;
    });
    if (new Set(tenantEntries.map(([key]) => key)).size !== tenantEntries.length) {
      throw new InvalidTenantContractError('tenant IDs must be unique.');
    }
    if (new Set(membershipEntries.map(([key]) => key)).size !== membershipEntries.length) {
      throw new InvalidTenantContractError('subject and tenant membership must be unique.');
    }
    if (new Set(membershipEntries.map(([, value]) => value.id)).size !== membershipEntries.length) {
      throw new InvalidTenantContractError('membership IDs must be unique.');
    }
    this.#tenants = new Map(tenantEntries);
    this.#memberships = new Map(membershipEntries);
    Object.freeze(this);
  }

  public findBySubjectAndTenant(
    subject: string,
    tenantId: string,
  ): Promise<MembershipResolution | undefined> {
    const membership = this.#memberships.get(`${subject}\u0000${tenantId}`);
    const tenant = this.#tenants.get(tenantId);
    return Promise.resolve(
      membership === undefined || tenant === undefined
        ? undefined
        : Object.freeze({ membership, tenant }),
    );
  }
}

function contextFrom(resolution: MembershipResolution): TenantContext {
  return freezeTenantContext({
    actorSubject: resolution.membership.subject,
    membershipId: resolution.membership.id,
    membershipVersion: resolution.membership.version,
    role: resolution.membership.role,
    tenantId: resolution.membership.tenantId,
  });
}

async function resolveActiveMembership(
  directory: MembershipDirectory,
  subject: string,
  tenantId: string,
): Promise<TenantContext> {
  let resolution: MembershipResolution | undefined;
  try {
    assertSubject(subject);
    assertUuid(tenantId, 'tenantId');
    resolution = await directory.findBySubjectAndTenant(subject, tenantId);
  } catch (cause) {
    throw new TenantAccessDeniedError({ cause });
  }
  if (
    resolution === undefined ||
    resolution.tenant.status !== 'active' ||
    resolution.membership.status !== 'active' ||
    resolution.tenant.id !== tenantId ||
    resolution.tenant.id !== resolution.membership.tenantId ||
    resolution.membership.subject !== subject
  ) {
    throw new TenantAccessDeniedError();
  }
  try {
    return contextFrom(resolution);
  } catch (cause) {
    throw new TenantAccessDeniedError({ cause });
  }
}

export class TenantContextResolver {
  public constructor(private readonly directory: MembershipDirectory) {}

  public resolve(principal: TenantPrincipal, selectedTenantId: string): Promise<TenantContext> {
    // The selected ID is only a lookup key. The returned ID, role and version
    // always come from the authoritative Membership record.
    return resolveActiveMembership(this.directory, principal.subject, selectedTenantId);
  }
}

function normalizedSelectorKey(key: string): string {
  return key.replaceAll(/[_-]/gu, '').toLowerCase();
}

export function containsTenantSelector(value: unknown, depth = 0): boolean {
  if (depth > 16) return true;
  if (Array.isArray(value)) return value.some((entry) => containsTenantSelector(entry, depth + 1));
  if (typeof value !== 'object' || value === null) return false;
  return Object.entries(value).some(
    ([key, nested]) =>
      forbiddenPayloadKeys.has(normalizedSelectorKey(key)) ||
      containsTenantSelector(nested, depth + 1),
  );
}

function copyJson(value: unknown, depth = 0): JsonValue {
  if (depth > 16) throw new InvalidTenantContractError('job payload nesting is too deep.');
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (Array.isArray(value)) {
    return Object.freeze(value.map((entry) => copyJson(entry, depth + 1)));
  }
  if (typeof value !== 'object') throw new InvalidTenantContractError('job payload must be JSON.');
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new InvalidTenantContractError('job payload must contain plain objects.');
  }
  const entries = Object.entries(value);
  if (entries.length > 100)
    throw new InvalidTenantContractError('job payload has too many fields.');
  const result: Record<string, JsonValue> = {};
  for (const [key, nested] of entries) {
    if (forbiddenObjectKeys.has(key)) {
      throw new InvalidTenantContractError('job payload contains a forbidden object key.');
    }
    result[key] = copyJson(nested, depth + 1);
  }
  return Object.freeze(result);
}

function validatedEnvelope(value: TenantJobEnvelope): TenantJobEnvelope {
  if (value.schemaVersion !== 1) throw new InvalidTenantContractError('schemaVersion is invalid.');
  assertUuid(value.jobId, 'jobId');
  if (!jobTypePattern.test(value.jobType))
    throw new InvalidTenantContractError('jobType is invalid.');
  const context = freezeTenantContext(value.context);
  if (containsTenantSelector(value.payload)) {
    throw new InvalidTenantContractError('job payload contains a tenant selector.');
  }
  const payload = copyJson(value.payload);
  return Object.freeze({
    context,
    jobId: value.jobId,
    jobType: value.jobType,
    payload,
    schemaVersion: 1,
  });
}

export function createTenantJobEnvelope<TPayload extends JsonValue>(
  context: TenantContext,
  input: Readonly<{ jobId: string; jobType: string; payload: TPayload }>,
): TenantJobEnvelope<TPayload> {
  return validatedEnvelope({ context, ...input, schemaVersion: 1 }) as TenantJobEnvelope<TPayload>;
}

export class TenantJobConsumer {
  public constructor(private readonly directory: MembershipDirectory) {}

  public async consume<TResult, TPayload extends JsonValue>(
    candidate: TenantJobEnvelope<TPayload>,
    work: (
      context: TenantContext,
      payload: TPayload,
      correlation: TenantLogCorrelation,
    ) => Promise<TResult>,
  ): Promise<TResult> {
    let envelope: TenantJobEnvelope<TPayload>;
    try {
      envelope = validatedEnvelope(candidate) as TenantJobEnvelope<TPayload>;
    } catch (cause) {
      throw new TenantAccessDeniedError({ cause });
    }
    const authoritative = await resolveActiveMembership(
      this.directory,
      envelope.context.actorSubject,
      envelope.context.tenantId,
    );
    if (
      authoritative.membershipId !== envelope.context.membershipId ||
      authoritative.membershipVersion !== envelope.context.membershipVersion ||
      authoritative.role !== envelope.context.role
    ) {
      throw new TenantAccessDeniedError();
    }
    return work(authoritative, envelope.payload, tenantLogCorrelation(authoritative));
  }
}
