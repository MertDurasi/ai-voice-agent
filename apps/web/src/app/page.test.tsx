import { describe, expect, it } from 'vitest';

import Page from './page';

describe('Page', () => {
  it('renders the provider-free foundation shell', () => {
    expect(Page().type).toBe('main');
  });
});
