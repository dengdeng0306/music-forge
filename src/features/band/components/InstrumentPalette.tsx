import { INSTRUMENT_LIBRARY } from "@/features/templates/data";
import type { InstrumentCategory } from "@/shared/types/common";
import { InstrumentCard } from "./InstrumentCard";
import { useBandStore } from "../store";

const categories: { id: InstrumentCategory; label: string }[] = [
  { id: "drums", label: "鼓组" },
  { id: "bass", label: "贝斯" },
  { id: "guitar", label: "吉他" },
  { id: "keys", label: "键盘" },
  { id: "strings", label: "弦乐" },
  { id: "brass", label: "铜管" },
  { id: "vocals", label: "人声" },
  { id: "fx", label: "FX" },
];

export function InstrumentPalette() {
  const { activeIds, toggleInstrument } = useBandStore();

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-neutral-300">乐器库</h3>
      {categories.map((cat) => {
        const instruments = INSTRUMENT_LIBRARY.filter((i) => i.category === cat.id);
        if (instruments.length === 0) return null;
        return (
          <div key={cat.id}>
            <span className="text-[11px] uppercase tracking-wide text-neutral-500">{cat.label}</span>
            <div className="grid grid-cols-4 gap-2 mt-1">
              {instruments.map((inst) => (
                <InstrumentCard
                  key={inst.id}
                  instrument={inst}
                  isActive={activeIds.includes(inst.id)}
                  onClick={() => toggleInstrument(inst.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
