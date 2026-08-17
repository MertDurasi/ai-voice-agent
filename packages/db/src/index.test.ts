import type { QueryResult, QueryResultRow } from 'pg';
import { describe, expect, it } from 'vitest';

import {
  RlsSchemaViolationError,
  assertTenantRls,
  lintTenantRls,
  type DatabaseQuery,
} from './index.js';

function queryResult<TRow extends QueryResultRow>(rows: readonly TRow[]): QueryResult<TRow> {
  return {
    command: 'SELECT',
    fields: [],
    oid: 0,
    rowCount: rows.length,
    rows: [...rows],
  };
}

class FixtureDatabase implements DatabaseQuery {
  readonly #responses: readonly QueryResult<QueryResultRow>[];
  #responseIndex = 0;

  public constructor(responses: readonly QueryResult<QueryResultRow>[]) {
    this.#responses = responses;
  }

  public async query<TRow extends QueryResultRow = QueryResultRow>(): Promise<QueryResult<TRow>> {
    const response = this.#responses[this.#responseIndex];
    this.#responseIndex += 1;
    if (response === undefined) throw new Error('Unexpected schema query.');
    return response as QueryResult<TRow>;
  }
}

const completePolicies = [
  { command: 'r', has_check: false, has_using: true, table_name: 'synthetic_records' },
  { command: 'a', has_check: true, has_using: false, table_name: 'synthetic_records' },
  { command: 'w', has_check: true, has_using: true, table_name: 'synthetic_records' },
  { command: 'd', has_check: false, has_using: true, table_name: 'synthetic_records' },
] as const;

describe('tenant RLS schema contract', () => {
  it('accepts a tenant table only with tenant_id, FORCE RLS and complete command policies', async () => {
    const database = new FixtureDatabase([
      queryResult([
        {
          force_rls: true,
          has_tenant_id: true,
          rls_enabled: true,
          table_name: 'synthetic_records',
        },
      ]),
      queryResult(completePolicies),
    ]);

    await expect(lintTenantRls(database)).resolves.toEqual([]);

    const assertionDatabase = new FixtureDatabase([
      queryResult([
        {
          force_rls: true,
          has_tenant_id: true,
          rls_enabled: true,
          table_name: 'synthetic_records',
        },
      ]),
      queryResult(completePolicies),
    ]);
    await expect(assertTenantRls(assertionDatabase)).resolves.toBeUndefined();
  });

  it('reports every missing isolation invariant and fails closed', async () => {
    const tableRows = [
      {
        force_rls: false,
        has_tenant_id: false,
        rls_enabled: false,
        table_name: 'unprotected_records',
      },
    ] as const;
    const database = new FixtureDatabase([queryResult(tableRows), queryResult([])]);

    const violations = await lintTenantRls(database);

    expect(violations.map(({ code }) => code)).toEqual([
      'missing_tenant_id',
      'missing_rls',
      'missing_force_rls',
      'missing_command_policy',
      'missing_command_policy',
      'missing_command_policy',
      'missing_command_policy',
    ]);
    expect(Object.isFrozen(violations)).toBe(true);
    expect(violations.every((violation) => Object.isFrozen(violation))).toBe(true);

    const assertionDatabase = new FixtureDatabase([queryResult(tableRows), queryResult([])]);
    await expect(assertTenantRls(assertionDatabase)).rejects.toMatchObject({
      name: RlsSchemaViolationError.name,
      violations,
    });
  });

  it('requires USING and WITH CHECK on the policy commands that can expose or mutate rows', async () => {
    const database = new FixtureDatabase([
      queryResult([
        {
          force_rls: true,
          has_tenant_id: true,
          rls_enabled: true,
          table_name: 'incomplete_records',
        },
      ]),
      queryResult([
        { command: 'r', has_check: false, has_using: false, table_name: 'incomplete_records' },
        { command: 'a', has_check: false, has_using: false, table_name: 'incomplete_records' },
        { command: 'w', has_check: false, has_using: false, table_name: 'incomplete_records' },
        { command: 'd', has_check: false, has_using: false, table_name: 'incomplete_records' },
      ]),
    ]);

    await expect(lintTenantRls(database)).resolves.toEqual([
      {
        code: 'policy_missing_using',
        detail: 'USING required for command r',
        table: 'incomplete_records',
      },
      {
        code: 'policy_missing_check',
        detail: 'WITH CHECK required for command a',
        table: 'incomplete_records',
      },
      {
        code: 'policy_missing_using',
        detail: 'USING required for command w',
        table: 'incomplete_records',
      },
      {
        code: 'policy_missing_check',
        detail: 'WITH CHECK required for command w',
        table: 'incomplete_records',
      },
      {
        code: 'policy_missing_using',
        detail: 'USING required for command d',
        table: 'incomplete_records',
      },
    ]);
  });
});
