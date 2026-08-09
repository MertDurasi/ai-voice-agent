import { describe, expect, it } from 'vitest';

import { WorkerModule } from './worker.module';

describe('WorkerModule', () => {
  it('exposes the empty worker composition root', () => {
    expect(WorkerModule).toBeDefined();
  });
});
