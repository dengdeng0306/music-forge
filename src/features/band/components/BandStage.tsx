import { useDroppable } from "@dnd-kit/core";
import { useBandStore } from "../store";

export function BandStage() {
  const { activeInstruments, activeIds, removeInstrument } = useBandStore();
  const { isOver, setNodeRef } = useDroppable({ id: "band-stage" });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[120px] rounded-xl border-2 border-dashed p-4 flex flex-wrap gap-3 items-center
        transition-colors
        ${isOver ? "border-purple-400 bg-purple-500/10" : "border-neutral-600 bg-neutral-800/50"}
        ${activeIds.length === 0 ? "justify-center" : ""}`}
    >
      {activeIds.length === 0 ? (
        <p className="text-neutral-500 text-sm">拖拽乐器到这里组建你的乐队</p>
      ) : (
        activeInstruments.map((inst) => (
          <div
            key={inst.id}
            className="flex items-center gap-2 px-3 py-2 bg-neutral-700 rounded-lg cursor-pointer
              hover:bg-neutral-600 transition-colors"
            onClick={() => removeInstrument(inst.id)}
            title="点击移除"
          >
            <span className="text-sm text-neutral-200">{inst.name}</span>
            <span className="text-[10px] text-neutral-500">{inst.category}</span>
          </div>
        ))
      )}
    </div>
  );
}
