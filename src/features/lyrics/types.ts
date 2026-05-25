import type { LyricLine } from "@/shared/types/common";

export type { LyricLine };

export interface LyricsState {
  lines: LyricLine[];
  selectedLineId: string | null;
}
