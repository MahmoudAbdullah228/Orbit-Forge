'use client';

import React from 'react';
import StarfieldCanvas from '@/components/scenes/StarfieldCanvas';
import IntroDialog from '@/components/scenes/IntroDialog';

export default function IntroPage() {
  return (
    <div className="relative min-h-screen bg-horizon-dusk overflow-hidden flex flex-col justify-between">
      <StarfieldCanvas speed={0.8} density={60} />
      <IntroDialog />
    </div>
  );
}
