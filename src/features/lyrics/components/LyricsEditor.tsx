import { useLyricsStore } from "../store";
import { Plus, X } from "lucide-react";

export function LyricsEditor() {
  const { lines, selectedLineId, addLine, updateLine, deleteLine, selectLine } =
    useLyricsStore();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-300">作词</h3>
        <button
          className="p-1 rounded-md hover:bg-neutral-700 transition-colors text-neutral-400"
          onClick={() => addLine()}
          title="添加一行"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
        {lines.map((line) => (
          <div
            key={line.id}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors
              ${line.id === selectedLineId ? "bg-purple-500/20" : "bg-neutral-800 hover:bg-neutral-750"}`}
            onClick={() => selectLine(line.id)}
          >
            <input
              type="text"
              value={line.text}
              onChange={(e) => updateLine(line.id, { text: e.target.value })}
              placeholder="输入歌词..."
              className="flex-1 bg-transparent text-sm text-neutral-200 placeholder-neutral-600
                outline-none"
            />
            <button
              className="text-neutral-600 hover:text-red-400 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                deleteLine(line.id);
              }}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {lines.length === 0 && (
          <p className="text-xs text-neutral-500 text-center py-4">
            点击 + 添加第一行歌词
          </p>
        )}
      </div>
    </div>
  );
}
