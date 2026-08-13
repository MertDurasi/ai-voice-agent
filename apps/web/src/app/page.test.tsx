import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import Page from './page';

describe('Page', () => {
  it('renders an accessible provider-free runtime shell', () => {
    const markup = renderToStaticMarkup(<Page />);

    expect(markup).toContain('Die technische Basis ist bereit');
    expect(markup).toContain('Reale Nachrichten, Telefonie, Zahlungen und Voice');
    expect(markup).toContain('aria-labelledby="runtime-title"');
    expect(markup).toContain('href="/auth/login"');
  });
});
