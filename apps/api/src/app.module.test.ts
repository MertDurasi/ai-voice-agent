import { describe, expect, it } from 'vitest';

import { AppModule } from './app.module';

describe('AppModule', () => {
  it('exposes the empty API composition root', () => {
    expect(AppModule).toBeDefined();
  });
});
