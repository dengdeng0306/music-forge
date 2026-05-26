import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { generateLyrics, type LyricsGenParams } from "../api";
import { useLyricsStore } from "../store";

const MOODS = ["浪漫", "伤感", "快乐", "励志", "孤独", "温暖", "愤怒", "梦幻"];
const TOPICS = ["爱情", "友情", "梦想", "离别", "成长", "自然", "城市", "回忆"];

export function LyricsGenPanel() {
  const [params, setParams] = useState<LyricsGenParams>({
    topic: "爱情",
    mood: "浪漫",
    style: "流行",
    lineCount: 8,
    language: "zh",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setLines } = useLyricsStore();

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const lines = await generateLyrics(params);
      const lyricLines = lines.map((text) => ({
        id: crypto.randomUUID(),
        text,
        syllables: [],
        startNote: null,
        endNote: null,
      }));
      setLines(lyricLines);
    } catch (e) {
      setError(e instanceof Error ? e.message : "生成失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-neutral-300 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
        AI 歌词生成
      </h3>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[11px] text-neutral-500">主题</label>
          <select
            value={params.topic}
            onChange={(e) => setParams((p) => ({ ...p, topic: e.target.value }))}
            className="w-full mt-0.5 bg-neutral-700 text-neutral-200 text-xs rounded-md px-2 py-1.5 border border-neutral-600"
          >
            {TOPICS.map((t) => (<option key={t} value={t}>{t}</option>))}
          </select>
        </div>
        <div>
          <label className="text-[11px] text-neutral-500">情绪</label>
          <select
            value={params.mood}
            onChange={(e) => setParams((p) => ({ ...p, mood: e.target.value }))}
            className="w-full mt-0.5 bg-neutral-700 text-neutral-200 text-xs rounded-md px-2 py-1.5 border border-neutral-600"
          >
            {MOODS.map((m) => (<option key={m} value={m}>{m}</option>))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[11px] text-neutral-500">风格</label>
          <input
            type="text"
            value={params.style}
            onChange={(e) => setParams((p) => ({ ...p, style: e.target.value }))}
            className="w-full mt-0.5 bg-neutral-700 text-neutral-200 text-xs rounded-md px-2 py-1.5 border border-neutral-600 outline-none"
            placeholder="流行、摇滚..."
          />
        </div>
        <div>
          <label className="text-[11px] text-neutral-500">行数</label>
          <input
            type="number"
            min={4}
            max={32}
            value={params.lineCount}
            onChange={(e) => setParams((p) => ({ ...p, lineCount: Number(e.target.value) }))}
            className="w-full mt-0.5 bg-neutral-700 text-neutral-200 text-xs rounded-md px-2 py-1.5 border border-neutral-600 outline-none"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <label className="flex items-center gap-1 text-xs text-neutral-400">
          <input
            type="radio"
            name="lang"
            checked={params.language === "zh"}
            onChange={() => setParams((p) => ({ ...p, language: "zh" }))}
          />
          中文
        </label>
        <label className="flex items-center gap-1 text-xs text-neutral-400">
          <input
            type="radio"
            name="lang"
            checked={params.language === "en"}
            onChange={() => setParams((p) => ({ ...p, language: "en" }))}
          />
          英文
        </label>
      </div>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      <button
        className="flex items-center justify-center gap-2 py-2 rounded-lg bg-purple-600 text-white text-sm
          hover:bg-purple-500 transition-colors disabled:opacity-50"
        disabled={loading}
        onClick={handleGenerate}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {loading ? "生成中..." : "生成歌词"}
      </button>
    </div>
  );
}
