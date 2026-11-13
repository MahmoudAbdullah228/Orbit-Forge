/**
 * 8-Bit Chiptune Sound Synthesizer via Web Audio API
 * Zero external audio assets required; respects user mute and volume settings.
 */

import { getStorageItem, setStorageItem } from './storage';

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isAudioMuted() {
  return Boolean(getStorageItem('audio_muted', false));
}

export function setAudioMuted(muted) {
  setStorageItem('audio_muted', Boolean(muted));
}

export function getAudioVolume() {
  return Number(getStorageItem('audio_volume', 0.5));
}

export function setAudioVolume(vol) {
  setStorageItem('audio_volume', Math.max(0, Math.min(1, Number(vol))));
}

function playTone(freq, type = 'square', duration = 0.1, gainMultiplier = 1) {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    const masterVol = getAudioVolume();
    const effectiveGain = Math.max(0.01, masterVol * 0.2 * gainMultiplier);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gainNode.gain.setValueAtTime(effectiveGain, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    // Silent catch on unsupported audio states
  }
}

export const sounds = {
  hover: () => {
    playTone(440, 'square', 0.04, 0.4);
  },
  click: () => {
    playTone(660, 'square', 0.06, 0.8);
    setTimeout(() => playTone(880, 'square', 0.08, 0.8), 50);
  },
  select: () => {
    playTone(520, 'square', 0.08, 0.6);
  },
  error: () => {
    playTone(150, 'sawtooth', 0.18, 1);
    setTimeout(() => playTone(110, 'sawtooth', 0.22, 1), 80);
  },
  countdown: (pitch = 440) => {
    playTone(pitch, 'square', 0.12, 0.9);
  },
  launch: () => {
    if (isAudioMuted()) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    // White noise / rumble for rocket thrust
    try {
      const bufferSize = ctx.sampleRate * 1.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(800, ctx.currentTime + 1.5);

      const gain = ctx.createGain();
      const masterVol = getAudioVolume();
      gain.gain.setValueAtTime(masterVol * 0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch (e) {}
  },
  success: () => {
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 'square', 0.16, 0.9), i * 110);
    });
  },
  failure: () => {
    const notes = [440, 392, 349, 261];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 'sawtooth', 0.2, 1), i * 130);
    });
  },
  transmission: () => {
    playTone(900, 'sine', 0.06, 0.6);
    setTimeout(() => playTone(1200, 'sine', 0.08, 0.6), 70);
  }
};
