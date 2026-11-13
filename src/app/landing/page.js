'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import StarfieldCanvas from '@/components/scenes/StarfieldCanvas';
import ArcadeMenu from '@/components/ui/ArcadeMenu';

export default function LandingPage() {
  const router = useRouter();

  const menuItems = [
    {
      id: 'play',
      label: 'PLAY MISSION CAMPAIGN',
      action: () => router.push('/missions/')
    },
    {
      id: 'tutorials',
      label: 'ENGINEERING TUTORIALS & BLUEPRINTS',
      action: () => router.push('/tutorials/')
    },
    {
      id: 'replay',
      label: 'REPLAY FLIGHT DIRECTOR INTRO',
      action: () => router.push('/')
    }
  ];

  return (
    <div className="relative min-h-screen bg-horizon-dusk flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-hidden w-full">
      <StarfieldCanvas speed={1} density={80} />

      {/* Top Arcade Header (Full Width) */}
      <header className="relative z-10 flex items-center justify-between border-b-4 border-panel-border bg-space-void/90 p-4 sm:p-5 shadow-pixel-md w-full">
        <div className="flex items-center gap-3">
          <span className="text-rocket-red text-2xl sm:text-3xl">🚀</span>
          <div>
            <h1 className="font-display text-[18px] sm:text-[24px] text-hud-amber tracking-wider uppercase">
              ORBIT FORGE
            </h1>
            <span className="font-small text-[10px] sm:text-[11px] text-planet-teal">
              NASA SPACE APPS CHALLENGE 2026 • SPACE MISSION DESIGN GAME
            </span>
          </div>
        </div>

        {/* Hearts and HI-SCORE */}
        <div className="flex items-center gap-6 sm:gap-10">
          <div className="hidden sm:flex flex-col items-end font-display text-[12px]">
            <span className="text-hull-steel text-[9px] tracking-wider">HI-SCORE</span>
            <span className="text-flame-yellow">99990 PTS</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-small text-[10px] text-hull-silver mr-1 hidden sm:inline">LIVES</span>
            {['❤️', '❤️', '❤️', '❤️', '❤️'].map((heart, i) => (
              <span key={i} className="text-base sm:text-lg">{heart}</span>
            ))}
          </div>
        </div>
      </header>

      {/* Main Expansive Hero Section (Full Width across screen) */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 my-8 w-full px-2 sm:px-6">
        {/* Left Column: Arcade Menu first, then compact info below */}
        <div className="w-full lg:flex-1 flex flex-col gap-5">
          <div>
            <span className="font-small text-[10px] sm:text-[11px] text-horizon-pink uppercase tracking-widest block mb-1 font-bold">
              SYSTEMS ENGINEERING & AEROSPACE SIMULATOR
            </span>
            <h2 className="font-display text-[22px] sm:text-[30px] text-hud-cream leading-tight">
              DESIGN. BALANCE. LAUNCH.
            </h2>
          </div>

          {/* Arcade Menu (Interactive Options First) */}
          <ArcadeMenu items={menuItems} className="w-full" />

          {/* Compact Info Section placed UNDER the play and tutorial options */}
          <div className="bg-panel-bg/90 border-2 border-panel-border p-3.5 sm:p-4 shadow-pixel-sm">
            <p className="font-body text-[15px] sm:text-[16px] text-hud-cream/90 leading-snug mb-3">
              Every space mission requires careful consideration of competing demands across <span className="text-res-budget">Budget</span>, <span className="text-res-mass">Mass</span>, <span className="text-res-power">Power</span>, <span className="text-res-data">Data</span>, <span className="text-res-comms">Communications</span>, and <span className="text-res-time">Lifetime</span>.
            </p>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-space-void/80 p-2 border border-panel-border/60 text-center">
                <span className="font-small text-[8px] sm:text-[9px] text-hull-silver block">DESTINATIONS</span>
                <span className="font-display text-[10px] sm:text-[11px] text-planet-teal">MOON • MARS • EARTH</span>
              </div>
              <div className="bg-space-void/80 p-2 border border-panel-border/60 text-center">
                <span className="font-small text-[8px] sm:text-[9px] text-hull-silver block">FLIGHT MISSIONS</span>
                <span className="font-display text-[10px] sm:text-[11px] text-hud-amber">3 FLIGHT MISSIONS</span>
              </div>
              <div className="bg-space-void/80 p-2 border border-panel-border/60 text-center">
                <span className="font-small text-[8px] sm:text-[9px] text-hull-silver block">SCIENTIFIC DATA</span>
                <span className="font-display text-[10px] sm:text-[11px] text-success">VERIFIED NASA</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-hull-steel font-small text-[10px] px-2">
            <span>USE ↑ / ↓ KEYS AND ENTER TO NAVIGATE CONSOLE</span>
            <span className="text-hud-amber">BUILD 1.0.3 • NASA SPACE APPS</span>
          </div>
        </div>

        {/* Right Column: Hero Visuals with Astronaut & Realistic Hardware */}
        <div className="flex flex-col items-center flex-shrink-0 w-full lg:w-auto">
          <div className="w-72 h-72 sm:w-96 sm:h-96 lg:w-[480px] lg:h-[480px] relative bg-panel-bg/90 border-4 border-panel-border p-6 shadow-pixel-lg flex items-center justify-center overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-25 pointer-events-none" />
            <img
              src="/assets/avatars/astronaut.png"
              alt="Orbit Forge Astronaut Hero"
              className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(10,6,38,0.95)] animate-pulse transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div className="mt-4 bg-space-void border-2 border-hud-amber px-6 py-2 shadow-pixel-sm text-center">
            <span className="font-display text-[12px] sm:text-[13px] text-hud-amber uppercase tracking-widest font-bold">
              FLIGHT DIRECTOR ZARA • ONLINE & READY
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center font-small text-[10px] text-hull-steel mt-6">
        NASA SPACE APPS CHALLENGE 2026 • SINGLE RETRO ARCADE THEME • PERSISTENT LOCALSTORAGE STATE
      </footer>
    </div>
  );
}
