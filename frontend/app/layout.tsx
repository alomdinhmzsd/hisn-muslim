// layout.tsx
import './globals.css';
import type { Metadata } from "next";
import { Star } from 'lucide-react';
import Link from 'next/link';
import ClientFavCount from './components/ClientFavCount';
import InstallPrompt from './components/InstallPrompt'

const APP_NAME = "Hisn Muslim";
const APP_DESCRIPTION = "Fortress of the Muslim - Duas and Adhkar";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Block Dark Reader and other extensions */}
        <meta name="darkreader-lock" content="none" />
        <meta name="cz-shortcut-listen" content="none" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent extensions from modifying attributes
              if (typeof window !== 'undefined') {
                // Block Dark Reader
                window.__darkreader__ = { isEnabled: false };

                // Block attribute observers
                const observer = new MutationObserver(() => {});
                observer.disconnect();
              }
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        {/* CLEAN NAV BAR - MATCHING MOCKUP */}
        <nav className="main-nav">
          <div className="nav-container">
            {/* Left: Logo/Title */}
            <div className="nav-left">
              <Link href="/" className="nav-logo">
                Hisn Al-Muslim
              </Link>
            </div>

            {/* Right: Favorites Count - Moved to Client Component */}
            <div className="nav-right">
              <ClientFavCount />
            </div>
          </div>
        </nav>

        {children}

        <footer className="main-footer">
          <div className="footer-content">
            <p>© {new Date().getFullYear()} Hisn Al-Muslim Digital</p>
            <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>Built for the Ummah</p>
          </div>
        </footer>
      </body>
    </html>
  );
}