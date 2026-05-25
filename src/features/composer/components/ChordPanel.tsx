import { useComposerStore } from "../store";
import { getChordsInKey, COMMON_PROGRESSIONS, ALL_KEYS } from "@/shared/utils/music";

export function ChordPanel() {
  const { key, setKey, chords, addChord, deleteChord, bpm } = useComposerStore();
  const keyChords = getChordsInKey(key);
  const progressions = COMMON_PROGRESSIONS.pop ?? [];

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-neutral-300">和弦助手</h3>

      {/* Key selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-neutral-400">调性</span>
        <select
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="bg-neutral-700 text-neutral-200 text-sm rounded-md px-2 py-1 border border-neutral-600"
        >
          {ALL_KEYS.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
      </div>

      {/* Diatonic chords */}
      <div className="flex flex-wrap gap-1.5">
        {keyChords.map((chord) => (
          <button
            key={chord.name}
            className="px-2.5 py-1 text-xs rounded-md bg-neutral-700 text-neutral-200
              hover:bg-purple-600 hover:text-white transition-colors"
            onClick={() =>
              addChord({
                name: chord.name,
                notes: chord.notes,
                startTime: 0,
                duration: 2,
              })
            }
          >
            {chord.name}
          </button>
        ))}
      </div>

      {/* Common progressions */}
      <div>
        <span className="text-[11px] text-neutral-500">常用进行</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {progressions.map((prog, i) => (
            <button
              key={i}
              className="px-2 py-0.5 text-[11px] rounded bg-neutral-700/50 text-neutral-400
                hover:bg-neutral-600 hover:text-neutral-200 transition-colors"
              onClick={() => {
                prog.forEach((degree, idx) => {
                  const chordName = resolveRoman(degree, key);
                  const chord = keyChords.find((c) => c.name === chordName);
                  if (chord) {
                    addChord({
                      name: chord.name,
                      notes: chord.notes,
                      startTime: idx * 2,
                      duration: 2,
                    });
                  }
                });
              }}
            >
              {prog.join(" - ")}
            </button>
          ))}
        </div>
      </div>

      {/* Active chords */}
      {chords.length > 0 && (
        <div>
          <span className="text-[11px] text-neutral-500">当前和弦</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {chords.map((chord) => (
              <span
                key={chord.id}
                className="px-2 py-0.5 text-xs rounded bg-purple-500/20 text-purple-300 cursor-pointer
                  hover:bg-red-500/20 hover:text-red-300"
                onClick={() => deleteChord(chord.id)}
              >
                {chord.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function resolveRoman(roman: string, key: string): string {
  const scale = ["I", "II", "III", "IV", "V", "VI", "VII"];
  const idx = scale.indexOf(roman.toUpperCase());
  if (idx === -1) return roman;
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const root = key.replace("m", "");
  const rootIdx = noteNames.indexOf(root);
  const isMinor = key.endsWith("m");
  const intervals = isMinor
    ? [0, 2, 3, 5, 7, 8, 10]
    : [0, 2, 4, 5, 7, 9, 11];
  const target = (rootIdx + intervals[idx]) % 12;
  const quality = roman === roman.toUpperCase() ? "" : "m";
  return `${noteNames[target]}${quality}`;
}
