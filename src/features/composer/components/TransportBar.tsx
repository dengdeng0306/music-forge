import { Play, Pause, Square } from "lucide-react";
import { useComposerStore } from "../store";
import { startTransport, stopTransport, pauseTransport } from "@/audio/transport";

export function TransportBar() {
  const { isPlaying, bpm, setBpm, setPlaying, setCurrentTime } = useComposerStore();

  const handlePlay = async () => {
    await startTransport();
    setPlaying(true);
  };

  const handlePause = () => {
    pauseTransport();
    setPlaying(false);
  };

  const handleStop = () => {
    stopTransport();
    setPlaying(false);
    setCurrentTime(0);
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-neutral-800 rounded-lg">
      <button
        className="p-1.5 rounded-md hover:bg-neutral-700 transition-colors text-neutral-200"
        onClick={handleStop}
        title="停止"
      >
        <Square className="w-4 h-4 fill-current" />
      </button>
      {isPlaying ? (
        <button
          className="p-1.5 rounded-md hover:bg-neutral-700 transition-colors text-purple-400"
          onClick={handlePause}
          title="暂停"
        >
          <Pause className="w-4 h-4 fill-current" />
        </button>
      ) : (
        <button
          className="p-1.5 rounded-md hover:bg-neutral-700 transition-colors text-purple-400"
          onClick={handlePlay}
          title="播放"
        >
          <Play className="w-4 h-4 fill-current" />
        </button>
      )}
      <div className="flex items-center gap-1.5 text-sm">
        <span className="text-neutral-400">BPM</span>
        <input
          type="number"
          min={40}
          max={240}
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="w-14 px-1.5 py-0.5 bg-neutral-700 rounded text-neutral-200 text-center text-sm
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
    </div>
  );
}
