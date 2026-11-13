'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import StarfieldCanvas from '@/components/scenes/StarfieldCanvas';
import PixelButton from '@/components/ui/PixelButton';
import { getTutorials } from '@/lib/data-loader';

export default function TutorialsCatalogPage() {
  const tutorials = getTutorials();
  const [filter, setFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'ALL ARCHIVES' },
    { id: 'vehicles', label: 'ROCKETS' },
    { id: 'instruments', label: 'SENSORS' },
    { id: 'power', label: 'POWER SYSTEMS' },
    { id: 'comms', label: 'DOWNLINK COMMS' },
    { id: 'orbits', label: 'ORBITS & TRAJECTORIES' }
  ];

  const filtered = filter === 'all'
    ? tutorials
    : tutorials.filter((t) => t.category.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="relative min-h-screen bg-horizon-dusk flex flex-col justify-between p-4 sm:p-8 lg:p-12 w-full">
      <StarfieldCanvas speed={0.5} density={60} />

      {/* Header bar (Full Width) */}
      <header className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-4 border-panel-border bg-space-void/90 p-4 sm:p-5 shadow-pixel-md gap-4 mb-6 w-full">
        <div className="flex items-center gap-4">
          <PixelButton href="/landing/" variant="neutral" size="sm">
            ◀ BACK
          </PixelButton>
          <div>
            <h1 className="font-display text-[16px] sm:text-[20px] text-hud-amber uppercase tracking-wide">
              ENGINEERING TUTORIALS & BLUEPRINTS
            </h1>
            <span className="font-small text-[10px] text-planet-teal">
              TECHNICAL SPECIFICATIONS & PHYSICS TRADE-OFF ENCYCLOPEDIA
            </span>
          </div>
        </div>

        <div className="hidden sm:block font-small text-[11px] text-hud-cream bg-panel-bg px-3 py-1 border-2 border-panel-border">
          {filtered.length} TECHNICAL BLUEPRINTS
        </div>
      </header>

      {/* Filter Chips Bar (Full Width) */}
      <div className="relative z-10 w-full flex items-center gap-2 overflow-x-auto pb-3 mb-6">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`font-display text-[10px] sm:text-[11px] px-3.5 py-1.5 uppercase transition-colors whitespace-nowrap border-2 ${
              filter === c.id
                ? 'bg-panel-bg-raised border-hud-amber text-hud-amber shadow-pixel-sm'
                : 'bg-panel-bg border-panel-border text-hull-silver hover:text-hud-cream'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Catalog Grid (Full Width, Strictly 3 Columns Max) */}
      <main className="relative z-10 w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-[#1A0F3A] border-4 border-[#6B4FD8] hover:border-hud-amber shadow-pixel-lg p-4 sm:p-5 flex flex-col justify-between transition-all hover:-translate-y-1 group"
            >
              <div>
                {/* Top outline category badge and tag */}
                <div className="flex items-center justify-between mb-3 border-b-2 border-panel-border/40 pb-2">
                  <div className="border border-planet-teal bg-space-void/80 px-2.5 py-0.5 shadow-pixel-sm">
                    <span className="font-small text-[9px] text-planet-teal tracking-wider uppercase font-bold">
                      {item.tag || item.category?.toUpperCase()}
                    </span>
                  </div>
                  <span className="font-small text-[10px] text-hull-silver uppercase tracking-widest">
                    {item.category?.toUpperCase()}
                  </span>
                </div>

                {/* Wide Cinematic Space Viewport with Large Centered Hardware Graphic */}
                <div className="w-full h-64 sm:h-72 bg-space-void border-2 border-[#6B4FD8] mb-4 flex items-center justify-center p-3 overflow-hidden relative shadow-inner">
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-hull-silver/40 border border-hull-white/30 pointer-events-none" />

                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(255,178,62,0.45)] transition-transform duration-300 group-hover:scale-105"
                  />

                  <div className="absolute top-2.5 left-2.5 bg-space-void/85 border border-panel-border/70 px-3 py-1 shadow-pixel-sm">
                    <span className="font-display text-[11px] text-hud-cream truncate block max-w-[260px]">
                      {item.title}
                    </span>
                  </div>
                </div>

                <h2 className="font-display text-[13px] sm:text-[14px] text-hud-cream mb-2 leading-snug">
                  {item.title}
                </h2>

                <p className="font-body text-[16px] sm:text-[17px] text-hud-cream/90 line-clamp-3 mb-4 leading-snug">
                  {item.description}
                </p>
              </div>

              {/* Bold Red Full-Width Arcade Button Styled after Reference Image */}
              <button
                type="button"
                onClick={() => {
                  window.location.href = `/tutorials/${item.id}/`;
                }}
                className="w-full py-3.5 px-4 bg-rocket-red hover:bg-rocket-red-dark text-white font-display text-[11px] sm:text-[12px] tracking-wider uppercase border-2 border-rocket-outline shadow-pixel-sm transition-all flex items-center justify-center gap-2 cursor-pointer font-bold active:translate-y-1"
              >
                <span>VIEW BLUEPRINT & DATA ▶</span>
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center font-small text-[10px] text-hull-steel mt-8">
        TECHNICAL ARCHIVE ENCYCLOPEDIA • REAL-WORLD NASA / ESA / JAXA CITATIONS
      </footer>
    </div>
  );
}
