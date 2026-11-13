import { Press_Start_2P, VT323, Silkscreen } from 'next/font/google';
import './globals.css';
import AudioToggle from '@/components/ui/AudioToggle';

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const silkscreen = Silkscreen({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-small',
  display: 'swap',
});

export const metadata = {
  title: 'Orbit Forge — Space Mission Design Game',
  description: 'Design, configure, and fly real robotic space missions in a retro 8-bit arcade simulator.',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${pressStart.variable} ${vt323.variable} ${silkscreen.variable}`}
    >
      <body className="bg-space-void text-hud-cream min-h-screen selection:bg-horizon-magenta selection:text-white">
        <AudioToggle />
        <main className="min-h-screen flex flex-col">{children}</main>
      </body>
    </html>
  );
}
