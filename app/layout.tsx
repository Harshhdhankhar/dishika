import type { Metadata } from 'next';
import { VoiceProvider } from '@/lib/context/VoiceContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'DISHIKA | Indian Voice Assistant',
  description: 'Your Cooperative AI Assistant - Realtime Voice Communication',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-dishika-light text-slate-900 font-system">
        <VoiceProvider>{children}</VoiceProvider>
      </body>
    </html>
  );
}
