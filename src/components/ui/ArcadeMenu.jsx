'use client';

import React, { useState, useEffect } from 'react';
import { sounds } from '@/lib/sound';

/**
 * ArcadeMenu - Retro arcade menu list with keyboard navigation and sound.
 *
 * @param {Object} props
 * @param {Array<{ id: string, label: string, action: () => void, disabled?: boolean, badge?: string }>} props.items
 * @param {string} [props.className='']
 */
export default function ArcadeMenu({ items, className = '' }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        sounds.hover();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        sounds.hover();
        setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const item = items[selectedIndex];
        if (item && !item.disabled) {
          sounds.click();
          item.action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex]);

  return (
    <div
      role="menu"
      tabIndex={0}
      className={`border-4 border-hud-cream bg-space-void/90 p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 shadow-pixel-lg ${className}`}
    >
      {items.map((item, index) => {
        const isSelected = selectedIndex === index;
        return (
          <button
            key={item.id}
            role="menuitem"
            disabled={item.disabled}
            onMouseEnter={() => {
              if (!item.disabled) {
                sounds.hover();
                setSelectedIndex(index);
              }
            }}
            onClick={() => {
              if (!item.disabled) {
                sounds.click();
                item.action();
              }
            }}
            className={`flex items-center justify-between text-left px-3 py-2 font-display text-[12px] sm:text-[14px] transition-colors ${
              item.disabled
                ? 'text-hull-steel cursor-not-allowed opacity-50'
                : isSelected
                ? 'text-hud-amber bg-panel-bg-raised/70'
                : 'text-hud-cream hover:text-hud-amber'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-5 text-hud-amber ${isSelected ? 'opacity-100 blink-arcade' : 'opacity-0'}`}>
                ▶
              </span>
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className="text-[10px] font-small px-2 py-0.5 bg-panel-border text-hull-white uppercase">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
