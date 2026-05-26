export interface SyllableMapping {
  lyricLineIndex: number;
  syllableIndex: number;
  text: string;
  noteId: string | null;
}

const ENGLISH_WORD_RE = /\b[a-zA-Z']+\b/g;

export function splitSyllables(text: string, language: "zh" | "en"): string[] {
  if (language === "en") {
    const words: string[] = [];
    let match: RegExpExecArray | null;
    const re = new RegExp(ENGLISH_WORD_RE);
    while ((match = re.exec(text)) !== null) {
      words.push(match[0]);
    }
    return words.length > 0 ? words : text.split(/\s+/).filter(Boolean);
  }
  // Chinese: each character is a syllable (rough approximation)
  const chars: string[] = [];
  for (const ch of text) {
    if (ch.trim() && !/[，,。.!！?？、；;：:""''（）()《》\[\]【】\s]/.test(ch)) {
      chars.push(ch);
    }
  }
  return chars;
}

export function autoAlignSyllables(
  syllables: string[],
  noteIds: string[],
): SyllableMapping[] {
  if (syllables.length === 0 || noteIds.length === 0) {
    return syllables.map((text, si) => ({
      lyricLineIndex: 0,
      syllableIndex: si,
      text,
      noteId: null,
    }));
  }

  // Distribute syllables across notes evenly
  const mappings: SyllableMapping[] = [];
  const notesPerSyllable = Math.max(1, Math.floor(noteIds.length / syllables.length));

  let noteIdx = 0;
  for (let si = 0; si < syllables.length; si++) {
    const assignedNote = noteIdx < noteIds.length ? noteIds[noteIdx] : null;
    mappings.push({
      lyricLineIndex: 0,
      syllableIndex: si,
      text: syllables[si],
      noteId: assignedNote,
    });
    noteIdx += notesPerSyllable;
  }

  return mappings;
}
