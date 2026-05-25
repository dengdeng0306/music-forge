import type { Note, Chord } from "@/shared/types/common";

export type { Note, Chord };

export interface ComposerState {
  notes: Note[];
  chords: Chord[];
  selectedNoteId: string | null;
  isPlaying: boolean;
  currentTime: number;
}
