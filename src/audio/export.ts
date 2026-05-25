import { getAudioContext } from "./engine";

export async function renderToWav(duration: number): Promise<Blob> {
  const ac = getAudioContext();
  const offlineCtx = new OfflineAudioContext(2, ac.sampleRate * duration, ac.sampleRate);

  // FIXME: Wire through the master bus output in a later task.
  // For now this is a placeholder that renders silence.

  const rendered = await offlineCtx.startRendering();
  const samples = new Float32Array(rendered.length);
  let offset = 0;
  for (let ch = 0; ch < rendered.numberOfChannels; ch++) {
    const channelData = rendered.getChannelData(ch);
    for (let i = 0; i < channelData.length; i++) {
      samples[offset + i] += channelData[i];
    }
    offset += channelData.length;
  }

  return encodeWav(samples, ac.sampleRate);
}

export function exportMidi(notes: Array<{ pitch: number; start: number; duration: number; velocity: number }>): Uint8Array {
  // Minimal MIDI type-0 file (header + one track)
  const encoder = new TextEncoder();
  const headerSize = 14;
  const trackEvents: number[] = [];

  // Set tempo 120 bpm (500000 us per quarter)
  trackEvents.push(0x00, 0xff, 0x51, 0x03, 0x07, 0xa1, 0x20);

  for (const n of notes) {
    const delta = Math.round(n.start * 480);
    const dur = Math.round(n.duration * 480);
    const vel = Math.min(127, Math.max(1, Math.round(n.velocity * 127)));
    trackEvents.push(
      ...encodeVarLen(delta), 0x90, n.pitch & 0x7f, vel,
      ...encodeVarLen(dur), 0x80, n.pitch & 0x7f, 0,
    );
  }
  trackEvents.push(0x00, 0xff, 0x2f, 0x00);

  const trackData = new Uint8Array(trackEvents);
  const trackLen = trackData.length;
  const totalSize = headerSize + trackLen + 0; // track chunk header
  // We'll build the final array

  const file = new Uint8Array(14 + 8 + trackLen);
  const view = new DataView(file.buffer);

  encoder.encodeInto("MThd", new Uint8Array(file.buffer, 0, 4));
  view.setUint32(4, 6); // header length
  view.setUint16(8, 0); // format 0
  view.setUint16(10, 1); // one track
  view.setUint16(12, 480); // ticks per quarter

  encoder.encodeInto("MTrk", new Uint8Array(file.buffer, 14, 4));
  view.setUint32(18, trackLen);
  file.set(trackData, 22);

  return file;
}

// ── helpers ──

function encodeWav(samples: Float32Array, sampleRate: number): Blob {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = samples.length * (bitsPerSample / 8);
  const buf = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buf);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  return new Blob([buf], { type: "audio/wav" });
}

function writeString(view: DataView, offset: number, str: string): void {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  const dest = new Uint8Array(view.buffer, offset, bytes.length);
  dest.set(bytes);
}

function encodeVarLen(value: number): number[] {
  const result: number[] = [];
  let v = Math.max(0, Math.round(value));
  if (v === 0) {
    return [0];
  }
  const buffer: number[] = [];
  buffer.push(v & 0x7f);
  v >>= 7;
  while (v > 0) {
    buffer.push((v & 0x7f) | 0x80);
    v >>= 7;
  }
  return buffer.reverse();
}
