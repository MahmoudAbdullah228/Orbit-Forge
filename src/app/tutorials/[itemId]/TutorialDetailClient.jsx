'use client';

import React from 'react';
import Link from 'next/link';
import StarfieldCanvas from '@/components/scenes/StarfieldCanvas';
import PixelButton from '@/components/ui/PixelButton';
import PixelPanel from '@/components/ui/PixelPanel';
import Chip from '@/components/ui/Chip';
import { getTutorialById } from '@/lib/data-loader';

export default function TutorialDetailClient({ itemId }) {
  const item = getTutorialById(itemId);

  if (!item) {
    return (
      <div className="min-h-screen bg-space-void text-hud-cream p-8 flex flex-col items-center justify-center">
        <h1 className="font-display text-xl text-danger mb-4">ITEM NOT FOUND</h1>
        <PixelButton href="/tutorials/" variant="neutral">RETURN TO TUTORIALS</PixelButton>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-horizon-dusk flex flex-col justify-between p-4 sm:p-8 lg:p-12 w-full">
      <StarfieldCanvas speed={0.4} density={50} />

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between border-b-4 border-panel-border bg-space-void/90 p-4 sm:p-5 shadow-pixel-md mb-8 w-full">
        <div className="flex items-center gap-4">
          <PixelButton href="/tutorials/" variant="neutral" size="sm">
            ◀ ALL TUTORIALS
          </PixelButton>
          <div>
            <h1 className="font-display text-[15px] sm:text-[18px] text-hud-amber uppercase">
              {item.title}
            </h1>
            <span className="font-small text-[10px] text-planet-teal">
              SUBSYSTEM BLUEPRINT & PHYSICS TRADE-OFFS
            </span>
          </div>
        </div>

        <Chip color="teal">{item.tag}</Chip>
      </header>

      {/* Main 3-Column Grid Layout (Full Width) */}
      <main className="relative z-10 w-full flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2 cols of 3): Explanations, Trade-offs, Constraints */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <PixelPanel title="ENGINEERING SPECIFICATION" variant="default">
            <p className="font-body text-[18px] sm:text-[20px] text-hud-cream leading-relaxed mb-4">
              {item.description}
            </p>

            {item.engineeringSpecification && item.engineeringSpecification !== item.description && (
              <div className="bg-space-void/80 p-3.5 border border-panel-border/60 mb-4">
                <span className="font-display text-[11px] text-planet-teal uppercase block mb-1">
                  FULL AEROSPACE SPECIFICATION:
                </span>
                <p className="font-body text-[16px] sm:text-[17px] text-hud-cream/95 leading-relaxed">
                  {item.engineeringSpecification}
                </p>
              </div>
            )}

            <div className="bg-space-void p-4 border-2 border-panel-border mb-4">
              <span className="font-display text-[12px] text-flame-yellow uppercase block mb-1">
                PHYSICS & DESIGN TRADE-OFF:
              </span>
              <p className="font-body text-[17px] sm:text-[18px] text-hud-cream/90 leading-snug">
                {item.physics_tradeoff}
              </p>
            </div>

            <div className="mb-4">
              <span className="font-display text-[12px] text-hud-amber uppercase block mb-2">
                AFFECTED MISSION CONSTRAINTS:
              </span>
              <ul className="list-disc list-inside font-body text-[16px] sm:text-[17px] text-hud-cream space-y-1">
                {item.constraints_affected.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="border-t-2 border-panel-border pt-3">
              <span className="font-display text-[11px] text-planet-teal uppercase block mb-1">
                REAL-WORLD FLIGHT HERITAGE:
              </span>
              <p className="font-body text-[16px] sm:text-[17px] text-hud-cream">
                {item.real_heritage}
              </p>
            </div>
          </PixelPanel>

          {/* Source Link */}
          {item.source_url && (
            <div className="bg-panel-bg border-2 border-panel-border p-3.5 flex items-center justify-between">
              <span className="font-small text-[10px] text-hull-silver">
                PRIMARY SOURCE: {item.source_name}
              </span>
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-[10px] text-porthole-blue hover:text-porthole-light underline flex items-center gap-1"
              >
                VERIFY SOURCE ↗
              </a>
            </div>
          )}
        </div>

        {/* Right Column (1 col of 3): Pixel Image & Telemetry Stats */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <PixelPanel title="HARDWARE VISUALIZATION" variant="raised">
            <div className="w-full h-72 sm:h-80 bg-space-void border-2 border-panel-border p-4 flex items-center justify-center mb-4 overflow-hidden relative shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(255,178,62,0.4)] transition-transform duration-300 hover:scale-105"
              />
            </div>

            <h3 className="font-display text-[12px] sm:text-[13px] text-hud-amber mb-3 uppercase">
              SUBSYSTEM METRICS:
            </h3>

            <div className="bg-space-void p-3 border border-panel-border/60 flex flex-col gap-2 font-body text-[16px]">
              {Object.entries(item.stats || {}).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between border-b border-panel-border/40 pb-1">
                  <span className="font-small text-[11px] text-hull-silver uppercase">
                    {key.replace('_', ' ')}:
                  </span>
                  <span className="font-display text-[12px] text-hud-cream">
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </PixelPanel>

          <PixelButton href="/missions/" variant="primary" className="w-full">
            TEST IN CAMPAIGN ▶
          </PixelButton>
        </div>
      </main>

      <footer className="relative z-10 text-center font-small text-[10px] text-hull-steel mt-8">
        TECHNICAL ARCHIVE ITEM • VERIFIED SOURCE: {item.source_name}
      </footer>
    </div>
  );
}
