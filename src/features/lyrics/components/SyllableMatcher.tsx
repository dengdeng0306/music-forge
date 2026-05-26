import { useMemo } from "react";
import { useLyricsStore } from "../store";
import { useComposerStore } from "@/features/composer/store";
import { splitSyllables, autoAlignSyllables } from "@/shared/utils/syllables";
import { midiToNoteName } from "@/shared/utils/music";

export function SyllableMatcher() {
  const { lines } = useLyricsStore();
  const { notes } = useComposerStore();

  const fullText = useMemo(
    () => lines.map((l) => l.text).filter(Boolean).join(""),
    [lines],
  );

  const syllables = useMemo(() => splitSyllables(fullText, "zh"), [fullText]);
  const noteIds = useMemo(() => notes.map((n) => n.id), [notes]);
  const mappings = useMemo(
    () => autoAlignSyllables(syllables, noteIds),
    [syllables, noteIds],
  );

  if (syllables.length === 0 || notes.length === 0) {
    return (
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-neutral-300">音节对齐</h3>
        <p className="text-xs text-neutral-500">
          {notes.length === 0 ? "先在钢琴卷帘上添加音符" : "先在歌词编辑器中输入歌词"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-neutral-300">音节对齐</h3>
      <div className="flex flex-wrap gap-1 items-center">
        {mappings.map((m, i) => {
          const note = notes.find((n) => n.id === m.noteId);
          const noteName = note ? midiToNoteName(note.pitch) : null;
          return (
            <div
              key={`${m.lyricLineIndex}-${m.syllableIndex}-${i}`}
              className="flex flex-col items-center"
            >
              <span className="text-xs text-purple-300">{m.text}</span>
              {noteName && (
                <span className="text-[10px] text-purple-500">{noteName}</span>
              )}
              {i < mappings.length - 1 && (
                <span className="text-neutral-600 mx-0.5">-</span>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 text-[11px] text-neutral-500">
        <span>音节数: {syllables.length}</span>
        <span>音符数: {notes.length}</span>
        <span>
          {notes.length >= syllables.length ? "音符充足" : "音符不足"}
        </span>
      </div>
    </div>
  );
}
