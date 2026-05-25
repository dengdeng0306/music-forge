import { useCallback, useRef } from "react";
import { useComposerStore } from "../store";

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const ROW_HEIGHT = 20;
const BEAT_WIDTH = 60;
const TOTAL_BEATS = 16;
const START_PITCH = 48; // C3
const END_PITCH = 84; // C6

export function PianoRoll() {
  const { notes, selectedNoteId, addNote, selectNote, updateNote } = useComposerStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const pitch = END_PITCH - Math.floor(y / ROW_HEIGHT);
      const startBeat = Math.floor(x / BEAT_WIDTH);
      if (pitch < START_PITCH || pitch > END_PITCH) return;
      addNote({
        pitch,
        startTime: startBeat,
        duration: 1,
        velocity: 0.8,
      });
    },
    [addNote],
  );

  const totalRows = END_PITCH - START_PITCH + 1;

  return (
    <div className="flex flex-col">
      <h3 className="text-sm font-semibold text-neutral-300 mb-2">钢琴卷帘</h3>
      <div className="flex">
        {/* Note labels */}
        <div className="w-10 flex-shrink-0">
          {Array.from({ length: totalRows }).map((_, i) => {
            const pitch = END_PITCH - i;
            const isBlack = [1, 3, 6, 8, 10].includes(pitch % 12);
            return (
              <div
                key={pitch}
                className={`flex items-center justify-end pr-1 text-[10px] leading-none
                  ${isBlack ? "text-neutral-600" : "text-neutral-400"}
                  ${isBlack ? "bg-neutral-850" : "bg-neutral-800"}`}
                style={{ height: ROW_HEIGHT }}
              >
                {!isBlack && `${NOTE_NAMES[pitch % 12]}${Math.floor(pitch / 12) - 1}`}
              </div>
            );
          })}
        </div>
        {/* Grid */}
        <div
          ref={containerRef}
          className="flex-1 relative border border-neutral-600 rounded-r-lg overflow-hidden"
          style={{ height: totalRows * ROW_HEIGHT }}
          onClick={handleClick}
        >
          {/* Beat grid lines */}
          {Array.from({ length: TOTAL_BEATS + 1 }).map((_, i) => (
            <div
              key={`beat-${i}`}
              className="absolute top-0 bottom-0 border-l border-neutral-700"
              style={{ left: i * BEAT_WIDTH }}
            />
          ))}
          {/* Octave dividers */}
          {Array.from({ length: totalRows }).map((_, i) => {
            const pitch = END_PITCH - i;
            if (pitch % 12 === 0) {
              return (
                <div
                  key={`oct-${pitch}`}
                  className="absolute left-0 right-0 border-t border-neutral-600"
                  style={{ top: i * ROW_HEIGHT }}
                />
              );
            }
            return null;
          })}
          {/* Notes */}
          {notes.map((note) => (
            <div
              key={note.id}
              className={`absolute rounded-sm cursor-pointer border
                ${note.id === selectedNoteId
                  ? "bg-purple-500 border-purple-300"
                  : "bg-purple-600 border-purple-400 hover:bg-purple-500"}`}
              style={{
                left: note.startTime * BEAT_WIDTH,
                top: (END_PITCH - note.pitch) * ROW_HEIGHT,
                width: note.duration * BEAT_WIDTH - 2,
                height: ROW_HEIGHT - 2,
              }}
              onClick={(e) => {
                e.stopPropagation();
                selectNote(note.id);
              }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("noteId", note.id);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
