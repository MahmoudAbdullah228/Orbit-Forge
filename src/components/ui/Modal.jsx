'use client';

import React, { useEffect } from 'react';
import PixelButton from './PixelButton';
import { sounds } from '@/lib/sound';

/**
 * Modal - Arcade dialog box with Level-2 shadow and dithered backdrop
 */
export default function Modal({ isOpen, onClose, title, children, actions, className = '' }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        sounds.click();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-void/85 backdrop-blur-[1px]">
      <div
        role="dialog"
        aria-modal="true"
        className={`w-full max-w-xl bg-panel-bg border-4 border-panel-border shadow-pixel-lg ${className}`}
      >
        {/* Header */}
        <div className="bg-panel-bg-raised border-b-4 border-panel-border px-4 py-3 flex items-center justify-between">
          <h2 className="text-hud-amber font-display text-[14px] sm:text-[16px] uppercase tracking-wide">
            {title}
          </h2>
          <button
            onClick={() => {
              sounds.click();
              onClose();
            }}
            className="text-hull-steel hover:text-danger font-display text-[16px] px-2"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 text-hud-cream font-body text-[20px] sm:text-[22px] max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {/* Actions */}
        {actions && (
          <div className="bg-panel-bg-raised border-t-4 border-panel-border px-4 py-3 flex items-center justify-end gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
