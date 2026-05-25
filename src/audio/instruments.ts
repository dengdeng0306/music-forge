import * as Tone from "tone";

const instruments = new Map<string, Tone.PolySynth | Tone.Sampler>();

const DEFAULT_SYNTH_OPTIONS: ConstructorParameters<typeof Tone.PolySynth>[0] = {
  voice: Tone.Synth,
  maxPolyphony: 8,
  volume: -6,
};

export function createInstrument(id: string): Tone.PolySynth {
  if (instruments.has(id)) {
    return instruments.get(id) as Tone.PolySynth;
  }
  const synth = new Tone.PolySynth(DEFAULT_SYNTH_OPTIONS).toDestination();
  instruments.set(id, synth);
  return synth;
}

export function getInstrument(id: string): Tone.PolySynth | undefined {
  return instruments.get(id) as Tone.PolySynth | undefined;
}

export function disposeInstrument(id: string): void {
  const synth = instruments.get(id) as Tone.PolySynth | undefined;
  if (synth) {
    synth.dispose();
    instruments.delete(id);
  }
}

export function disposeAllInstruments(): void {
  for (const [id, synth] of instruments) {
    synth.dispose();
  }
  instruments.clear();
}
