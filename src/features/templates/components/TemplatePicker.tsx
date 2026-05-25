import { STYLE_PRESETS } from "../data";
import { useBandStore } from "@/features/band/store";
import { useComposerStore } from "@/features/composer/store";
import { getChordsInKey } from "@/shared/utils/music";
import type { StylePreset } from "@/shared/types/common";
import { Music, Zap, MicVocal, Radio, Guitar, Disc3 } from "lucide-react";

const iconMap: Record<string, typeof Music> = {
  pop: Music,
  folk: Guitar,
  electronic: Zap,
  hiphop: Radio,
  rock: Guitar,
  rnb: MicVocal,
};

interface TemplatePickerProps {
  onSelect?: () => void;
}

export function TemplatePicker({ onSelect }: TemplatePickerProps) {
  const { clearBand, addInstrument } = useBandStore();
  const { setBpm, setKey, clearNotes, addChord } = useComposerStore();

  const handleSelect = (preset: StylePreset) => {
    clearBand();
    clearNotes();
    setBpm(preset.bpm);

    for (const instId of preset.instruments) {
      addInstrument(instId);
    }

    const key = "C";
    setKey(key);
    const chords = getChordsInKey(key);
    const degreeToName: Record<string, string> = {
      I: chords[0]?.name ?? "C",
      ii: chords[1]?.name ?? "Dm",
      iii: chords[2]?.name ?? "Em",
      IV: chords[3]?.name ?? "F",
      V: chords[4]?.name ?? "G",
      vi: chords[5]?.name ?? "Am",
      vii: chords[6]?.name ?? "Bdim",
      bVII: "Bb",
      bIII: "Eb",
      VI: chords[5]?.name ?? "Am",
      VII: chords[6]?.name ?? "Bdim",
    };

    preset.chordProgression.forEach((degree, idx) => {
      const name = degreeToName[degree] ?? degree;
      const chord = chords.find((c) => c.name === name);
      if (chord) {
        addChord({
          name: chord.name,
          notes: chord.notes,
          startTime: idx * 2,
          duration: 2,
        });
      }
    });

    onSelect?.();
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-neutral-300">风格模板</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {STYLE_PRESETS.map((preset) => {
          const Icon = iconMap[preset.id] ?? Disc3;
          return (
            <button
              key={preset.id}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-neutral-800
                hover:bg-neutral-700 hover:border-purple-500 border-2 border-transparent
                transition-all text-left"
              onClick={() => handleSelect(preset)}
            >
              <Icon className="w-8 h-8 text-purple-400" />
              <div>
                <div className="text-sm font-medium text-neutral-200">{preset.name}</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">{preset.description}</div>
                <div className="text-[10px] text-neutral-600 mt-1">BPM {preset.bpm}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
