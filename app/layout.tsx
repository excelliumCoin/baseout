'use client';
import React, { useEffect } from 'react';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const url = new URL(window.location.href);
    const isMini = url.pathname.startsWith('/mini') || url.searchParams.get('miniApp') === 'true';
    if (isMini) {
      import('@farcaster/miniapp-sdk').then(async ({ sdk }) => {
        try { await sdk.actions.ready(); } catch {}
      });
    }
  }, []);

  return (
    <html lang="tr">
      <body className="min-h-dvh bg-[#0b0f1a] text-white antialiased">{children}</body>
    </html>
  );
}
