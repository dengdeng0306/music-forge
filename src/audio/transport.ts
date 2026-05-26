import * as Tone from "tone";
import { getInstrument, createInstrument } from "./instruments";
import type { Note } from "@/shared/types/common";
import { midiToNoteName } from "@/shared/utils/music";

let isStarted = false;
let positionCallbacks: Array<(beat: number) => void> = [];
let scheduledIds: number[] = [];

export function initTransport(): void {
  Tone.Transport.bpm.value = 120;
}

export function setBpm(bpm: number): void {
  Tone.Transport.bpm.value = bpm;
}

export function getBpm(): number {
  return Tone.Transport.bpm.value;
}

export async function start(): Promise<void> {
  await Tone.start();
  if (!isStarted) {
    Tone.Transport.start();
    isStarted = true;
  }
}

export function stop(): void {
  Tone.Transport.stop();
  Tone.Transport.cancel();
  isStarted = false;
  clearScheduled();
}

export function pause(): void {
  Tone.Transport.pause();
}

export function getState(): string {
  return Tone.Transport.state;
}

export function getCurrentBeat(): number {
  const seconds = Tone.Transport.seconds;
  const bpm = Tone.Transport.bpm.value;
  return (seconds / 60) * bpm;
}

export function onPosition(cb: (beat: number) => void): () => void {
  positionCallbacks.push(cb);
  return () => {
    positionCallbacks = positionCallbacks.filter((c) => c !== cb);
  };
}

export function scheduleNotes(
  notes: Note[],
  instrumentId: string,
  bpm: number,
): void {
  const synth = getInstrument(instrumentId) ?? createInstrument(instrumentId);
  const secondsPerBeat = 60 / bpm;

  for (const note of notes) {
    const startTime = note.startTime * secondsPerBeat;
    const duration = note.duration * secondsPerBeat;
    const noteName = midiToNoteName(note.pitch);
    const id = Tone.Transport.schedule((time) => {
      synth.triggerAttackRelease(noteName, duration, time, note.velocity);
    }, startTime);
    scheduledIds.push(id);
  }
}

export function clearScheduled(): void {
  for (const id of scheduledIds) {
    Tone.Transport.clear(id);
  }
  scheduledIds = [];
}

// ── position tick loop ──
let tickInterval: ReturnType<typeof setInterval> | null = null;

function startTickLoop(): void {
  if (tickInterval) return;
  tickInterval = setInterval(() => {
    const beat = getCurrentBeat();
    for (const cb of positionCallbacks) {
      cb(beat);
    }
  }, 50); // 20 fps
}

function stopTickLoop(): void {
  if (tickInterval) {
    clearInterval(tickInterval);
    tickInterval = null;
  }
}

Tone.Transport.on("start", startTickLoop);
Tone.Transport.on("stop", stopTickLoop);
Tone.Transport.on("pause", stopTickLoop);
