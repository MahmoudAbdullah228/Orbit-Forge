'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PixelButton from '../ui/PixelButton';
import { sounds } from '@/lib/sound';
import { markIntroSeen } from '@/lib/storage';

const INTRO_MESSAGES = [
  {
    speaker: 'COMMANDER ZARA (CHIEF ARCHITECT)',
    text: 'Welcome to the ORBIT FORGE Spacecraft Integration Facility, Engineer! You have been appointed Lead Systems Architect for humanity\'s next robotic exploration fleet.'
  },
  {
    speaker: 'COMMANDER ZARA (CHIEF ARCHITECT)',
    text: 'Every space mission is a grand puzzle of competing trade-offs: BUDGET, MASS, POWER, COMMUNICATIONS, and LIFETIME. There is rarely one perfect blueprint.'
  },
  {
    speaker: 'COMMANDER ZARA (CHIEF ARCHITECT)',
    text: 'Add a heavier sensor, and your launch rocket must grow larger—draining your funding. Fly closer to dark craters, and freezing shadows will threaten your batteries.'
  },
  {
    speaker: 'COMMANDER ZARA (CHIEF ARCHITECT)',
    text: 'You will design robotic probes for the Moon, Mars, and Earth, manage live spacecraft telemetry, and guide your vessel through unexpected space hazards.'
  },
  {
    speaker: 'COMMANDER ZARA (CHIEF ARCHITECT)',
    text: 'The launchpad is cleared and flight telemetry is online. Review your flight briefings, balance your systems, and take flight into the cosmos!'
  }
];

export default function IntroDialog() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const activeMessage = INTRO_MESSAGES[currentStep];

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsTyping(true);

    const interval = setInterval(() => {
      index++;
      setDisplayedText(activeMessage.text.slice(0, index));
      if (index % 4 === 0) {
        sounds.hover();
      }
      if (index >= activeMessage.text.length) {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 22);

    return () => clearInterval(interval);
  }, [currentStep, activeMessage.text]);

  const advance = () => {
    if (isTyping) {
      // Fast-forward to full text
      setDisplayedText(activeMessage.text);
      setIsTyping(false);
      sounds.click();
      return;
    }

    if (currentStep < INTRO_MESSAGES.length - 1) {
      sounds.click();
      setCurrentStep((prev) => prev + 1);
    } else {
      finishIntro();
    }
  };

  const finishIntro = () => {
    sounds.click();
    markIntroSeen();
    router.push('/landing/');
  };

  // Keyboard navigation (Space or Enter to advance)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTyping, currentStep]);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 sm:p-8 lg:p-12 z-10">
      {/* Top Bar with SKIP Button */}
      <div className="flex items-center justify-between z-20 w-full mb-6">
        <PixelButton
          variant="secondary"
          size="sm"
          onClick={finishIntro}
          className="shadow-pixel-sm"
        >
          SKIP INTRO ▶
        </PixelButton>

        <div className="font-display text-[11px] sm:text-[13px] text-hud-amber bg-panel-bg/90 border-2 border-panel-border px-3 py-1 shadow-pixel-sm">
          MISSION BRIEFING: {currentStep + 1} / {INTRO_MESSAGES.length}
        </div>
      </div>

      {/* Main Center Stage (Spacious, Wide) */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 my-6 w-full px-2 sm:px-6">
        {/* Left/Center: Arcade Dialog Box */}
        <div
          onClick={advance}
          className="w-full lg:flex-1 bg-panel-bg/95 border-4 border-panel-border shadow-pixel-lg p-6 sm:p-10 cursor-pointer hover:border-hud-amber transition-colors flex flex-col justify-between min-h-[260px]"
          role="button"
          tabIndex={0}
          aria-label="Click to advance briefing text"
        >
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-panel-border">
              <span className="text-planet-teal text-sm">▶</span>
              <span className="font-display text-[13px] sm:text-[15px] text-hud-amber tracking-wider">
                {activeMessage.speaker}
              </span>
            </div>

            <p className="font-body text-[24px] sm:text-[28px] text-hud-cream leading-relaxed min-h-[120px]">
              {displayedText}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t-2 border-panel-border/50 text-hud-amber font-display text-[11px] sm:text-[12px]">
            <span className="text-hull-steel">CLICK / ENTER / SPACE TO CONTINUE</span>
            <span className="blink-arcade text-base">▶</span>
          </div>
        </div>

        {/* Right side: Astronaut Avatar */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 relative bg-panel-bg/60 border-4 border-panel-border p-2 shadow-pixel-lg flex items-center justify-center">
            <img
              src="/assets/avatars/astronaut.png"
              alt="Astronaut Flight Director"
              className="w-full h-full object-contain filter drop-shadow-[0_8px_0_rgba(10,6,38,0.8)]"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <span className="mt-2 font-display text-[12px] text-hud-cream uppercase bg-panel-bg px-3 py-1 border border-panel-border">
            CHIEF ENGINEER
          </span>
        </div>
      </div>

      {/* Bottom ticker banner */}
      <div className="text-center font-small text-[10px] sm:text-[11px] text-hull-steel uppercase tracking-widest z-10">
        NASA SPACE APPS CHALLENGE 2026 • SPACE MISSION DESIGN GAME
      </div>
    </div>
  );
}
