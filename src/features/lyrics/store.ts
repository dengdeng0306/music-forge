import { create } from "zustand";
import type { LyricLine } from "@/shared/types/common";
import { generateId } from "@/shared/utils/id";

interface LyricsStore {
  lines: LyricLine[];
  selectedLineId: string | null;

  addLine: (text?: string) => void;
  updateLine: (id: string, patch: Partial<LyricLine>) => void;
  deleteLine: (id: string) => void;
  selectLine: (id: string | null) => void;
  setLines: (lines: LyricLine[]) => void;
}

export const useLyricsStore = create<LyricsStore>((set, get) => ({
  lines: [],
  selectedLineId: null,

  addLine(text = "") {
    const id = generateId("ly");
    set({
      lines: [
        ...get().lines,
        {
          id,
          text,
          syllables: [],
          startNote: null,
          endNote: null,
        },
      ],
    });
  },

  updateLine(id, patch) {
    set({
      lines: get().lines.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    });
  },

  deleteLine(id) {
    set({ lines: get().lines.filter((l) => l.id !== id) });
  },

  selectLine(id) {
    set({ selectedLineId: id });
  },

  setLines(lines) {
    set({ lines });
  },
}));
