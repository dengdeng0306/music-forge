import * as Tone from "tone";
import type { Time } from "tone/build/esm/core/type/Units";

let transportStarted = false;

export function initTransport(): void {
  Tone.Transport.bpm.value = 120;
}

export function setBpm(bpm: number): void {
  Tone.Transport.bpm.value = bpm;
}

export function getBpm(): number {
  return Tone.Transport.bpm.value;
}

export async function startTransport(): Promise<void> {
  await Tone.start();
  if (!transportStarted) {
    Tone.Transport.start();
    transportStarted = true;
  }
}

export function stopTransport(): void {
  Tone.Transport.stop();
  transportStarted = false;
}

export function pauseTransport(): void {
  Tone.Transport.pause();
}

export function getTransportTime(): Time {
  return Tone.Transport.seconds;
}

export function getTransportState(): string {
  return Tone.Transport.state;
}

export function scheduleNote(
  time: number,
  note: string,
  duration: string,
  synth: Tone.PolySynth | Tone.Synth,
): void {
  synth.triggerAttackRelease(note, duration, time);
}
