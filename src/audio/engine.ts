const AUDIO_CONTEXT_SYMBOL = Symbol("audio-context");

let ctx: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!ctx || ctx.state === "closed") {
    ctx = new AudioContext({ sampleRate: 44100 });
  }
  return ctx;
}

export function resumeAudioContext(): Promise<void> {
  const ac = getAudioContext();
  if (ac.state === "suspended") {
    return ac.resume();
  }
  return Promise.resolve();
}

export function suspendAudioContext(): Promise<void> {
  const ac = getAudioContext();
  if (ac.state === "running") {
    return ac.suspend();
  }
  return Promise.resolve();
}

export function getCurrentTime(): number {
  return getAudioContext().currentTime;
}
