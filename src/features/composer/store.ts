import { create } from "zustand";
import type { Note, Chord, NoteId, ChordId } from "@/shared/types/common";
import { generateId } from "@/shared/utils/id";

interface ComposerStore {
  notes: Note[];
  chords: Chord[];
  selectedNoteId: NoteId | null;
  isPlaying: boolean;
  currentTime: number;
  bpm: number;
  key: string;

  addNote: (note: Omit<Note, "id">) => void;
  updateNote: (id: NoteId, patch: Partial<Note>) => void;
  deleteNote: (id: NoteId) => void;
  selectNote: (id: NoteId | null) => void;
  clearNotes: () => void;

  addChord: (chord: Omit<Chord, "id">) => void;
  updateChord: (id: ChordId, patch: Partial<Chord>) => void;
  deleteChord: (id: ChordId) => void;

  setPlaying: (playing: boolean) => void;
  setCurrentTime: (t: number) => void;
  setBpm: (bpm: number) => void;
  setKey: (key: string) => void;
}

export const useComposerStore = create<ComposerStore>((set, get) => ({
  notes: [],
  chords: [],
  selectedNoteId: null,
  isPlaying: false,
  currentTime: 0,
  bpm: 120,
  key: "C",

  addNote(note) {
    const id = generateId("n");
    set({ notes: [...get().notes, { ...note, id }] });
  },

  updateNote(id, patch) {
    set({
      notes: get().notes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    });
  },

  deleteNote(id) {
    set({ notes: get().notes.filter((n) => n.id !== id) });
  },

  selectNote(id) {
    set({ selectedNoteId: id });
  },

  clearNotes() {
    set({ notes: [], selectedNoteId: null });
  },

  addChord(chord) {
    const id = generateId("ch");
    set({ chords: [...get().chords, { ...chord, id }] });
  },

  updateChord(id, patch) {
    set({
      chords: get().chords.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    });
  },

  deleteChord(id) {
    set({ chords: get().chords.filter((c) => c.id !== id) });
  },

  setPlaying(playing) {
    set({ isPlaying: playing });
  },

  setCurrentTime(t) {
    set({ currentTime: t });
  },

  setBpm(bpm) {
    set({ bpm });
  },

  setKey(key) {
    set({ key });
  },
}));
