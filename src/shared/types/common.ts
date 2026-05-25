export type InstrumentId = string;
export type TrackId = string;
export type ProjectId = string;
export type NoteId = string;
export type ChordId = string;

export interface Note {
  id: NoteId;
  pitch: number;
  startTime: number;
  duration: number;
  velocity: number;
}

export interface Chord {
  id: ChordId;
  name: string;
  notes: number[];
  startTime: number;
  duration: number;
}

export interface Instrument {
  id: InstrumentId;
  name: string;
  category: InstrumentCategory;
  icon: string;
  toneSample: string;
  range: [number, number];
}

export type InstrumentCategory =
  | "drums"
  | "bass"
  | "guitar"
  | "keys"
  | "strings"
  | "brass"
  | "vocals"
  | "fx";

export interface Track {
  id: TrackId;
  instrumentId: InstrumentId;
  notes: Note[];
  volume: number;
  pan: number;
  muted: boolean;
  solo: boolean;
}

export interface Project {
  id: ProjectId;
  name: string;
  bpm: number;
  key: string;
  timeSignature: [number, number];
  tracks: Track[];
  chords: Chord[];
  lyrics: LyricLine[];
  createdAt: string;
  updatedAt: string;
}

export interface LyricLine {
  id: string;
  text: string;
  syllables: string[];
  startNote: number | null;
  endNote: number | null;
}

export type StyleTemplate =
  | "pop"
  | "folk"
  | "electronic"
  | "hiphop"
  | "rock"
  | "rnb";

export interface StylePreset {
  id: StyleTemplate;
  name: string;
  description: string;
  bpm: number;
  instruments: InstrumentId[];
  chordProgression: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
