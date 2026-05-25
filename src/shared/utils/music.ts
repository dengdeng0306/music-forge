const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const MAJOR_SCALE = [2, 2, 1, 2, 2, 2, 1];
const MINOR_SCALE = [2, 1, 2, 2, 1, 2, 2];

export const ALL_KEYS = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
  "Cm", "C#m", "Dm", "D#m", "Em", "Fm", "F#m", "Gm", "G#m", "Am", "A#m", "Bm",
];

export function midiToNoteName(pitch: number): string {
  const octave = Math.floor(pitch / 12) - 1;
  const name = NOTE_NAMES[pitch % 12];
  return `${name}${octave}`;
}

export function noteNameToMidi(name: string): number {
  const match = name.match(/^([A-G]#?)(\\d+)$/);
  if (!match) throw new Error(`Invalid note name: ${name}`);
  const noteIdx = NOTE_NAMES.indexOf(match[1]);
  const octave = parseInt(match[2], 10);
  return (octave + 1) * 12 + noteIdx;
}

export function getScale(key: string): number[] {
  const major = key.length === 1 || (key.length === 2 && !key.endsWith("m"));
  const root = major ? key.replace("m", "") : key.slice(0, -1);
  const rootIdx = NOTE_NAMES.indexOf(root);
  const intervals = major ? MAJOR_SCALE : MINOR_SCALE;
  const scale: number[] = [rootIdx];
  let current = rootIdx;
  for (const interval of intervals) {
    current = (current + interval) % 12;
    scale.push(current);
  }
  return scale;
}

export function getChordsInKey(key: string): Array<{ name: string; notes: number[] }> {
  const scale = getScale(key);
  const chordQualities = key.endsWith("m")
    ? ["min", "dim", "maj", "min", "min", "maj", "maj"]
    : ["maj", "min", "min", "maj", "maj", "min", "dim"];

  return scale.slice(0, 7).map((root, i) => {
    const third = scale[(i + 2) % 7];
    const fifth = scale[(i + 4) % 7];
    const rootName = NOTE_NAMES[root];
    const quality = chordQualities[i];
    return {
      name: quality === "maj" ? rootName : `${rootName}${quality === "dim" ? "dim" : "m"}`,
      notes: [root, third, fifth].map((n) => n + 60),
    };
  });
}

export const COMMON_PROGRESSIONS: Record<string, string[][]> = {
  pop: [["I", "V", "vi", "IV"], ["I", "IV", "V", "I"], ["vi", "IV", "I", "V"]],
  folk: [["I", "IV", "V", "I"], ["I", "V", "vi", "IV"]],
  electronic: [["vi", "IV", "I", "V"], ["i", "VI", "III", "VII"]],
  hiphop: [["i", "iv", "VI", "V"], ["vi", "V", "IV", "III"]],
  rock: [["I", "IV", "V", "I"], ["I", "bVII", "IV", "I"]],
  rnb: [["ii", "V", "I", "vi"], ["I", "vi", "ii", "V"]],
};
