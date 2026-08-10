import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

export const metadata: Metadata = {
  description: 'Providerfreie API-, Web- und Worker-Foundation',
  robots: { follow: false, index: false },
  title: 'Voice AI Agent · Lokale Foundation',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
