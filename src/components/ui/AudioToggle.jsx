'use client';

import React, { useState, useEffect } from 'react';
import { isAudioMuted, setAudioMuted, sounds } from '@/lib/sound';
import { getStorageItem, setStorageItem } from '@/lib/storage';

export default function AudioToggle() {
  const [muted, setMuted] = useState(false);
  const [crtActive, setCrtActive] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    setMuted(isAudioMuted());
    const savedCrt = getStorageItem('crt_overlay', false);
    setCrtActive(savedCrt);
    if (savedCrt) {
      document.body.classList.add('crt-active');
    }
  }, []);

  const toggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    setAudioMuted(nextMuted);
    if (!nextMuted) {
      sounds.click();
    }
  };

  const toggleCrt = () => {
    const nextCrt = !crtActive;
    setCrtActive(nextCrt);
    setStorageItem('crt_overlay', nextCrt);
    if (nextCrt) {
      document.body.classList.add('crt-active');
    } else {
      document.body.classList.remove('crt-active');
    }
    sounds.click();
  };

  return (
    <>
      {crtActive && <div className="crt-overlay" aria-hidden="true" />}
      <div className="fixed top-3 right-3 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleMute}
          title={muted ? 'Unmute Audio' : 'Mute Audio'}
          className="bg-panel-bg border-2 border-panel-border hover:border-hud-amber text-hud-amber px-2.5 py-1 font-display text-[11px] shadow-pixel-sm flex items-center gap-1.5"
          aria-label={muted ? 'Unmute Audio' : 'Mute Audio'}
        >
          <span>{muted ? '🔇' : '🔊'}</span>
          <span className="hidden sm:inline">{muted ? 'MUTED' : 'SFX ON'}</span>
        </button>

        <button
          type="button"
          onClick={toggleCrt}
          title="Toggle CRT Scanlines"
          className={`border-2 px-2.5 py-1 font-display text-[11px] shadow-pixel-sm flex items-center gap-1.5 ${
            crtActive
              ? 'bg-panel-bg-raised border-hud-amber text-hud-amber'
              : 'bg-panel-bg border-panel-border text-hull-steel hover:border-hud-amber hover:text-hud-amber'
          }`}
          aria-label="Toggle CRT Scanline Effect"
        >
          <span>📺</span>
          <span className="hidden sm:inline">CRT</span>
        </button>
      </div>
    </>
  );
}
