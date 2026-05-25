import { useBandStore } from "../store";

export function BandControls() {
  const { activeIds, clearBand } = useBandStore();

  if (activeIds.length === 0) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-neutral-400">
      <span>{activeIds.length} 件乐器</span>
      <button
        className="text-red-400 hover:text-red-300 transition-colors"
        onClick={clearBand}
      >
        清空
      </button>
    </div>
  );
}
