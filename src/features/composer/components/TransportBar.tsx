import { useCallback, useEffect, useState } from "react";
import { Play, Pause, Square } from "lucide-react";
import { useComposerStore } from "../store";
import { useBandStore } from "@/features/band/store";
import { start, stop, pause, setBpm, scheduleNotes, onPosition } from "@/audio/transport";

export function TransportBar() {
  const { isPlaying, bpm, notes, chords, setPlaying, setBpm: storeSetBpm, setCurrentTime } = useComposerStore();
  const [currentBeat, setCurrentBeat] = useState(0);

  useEffect(() => {
    const unsub = onPosition((beat) => setCurrentBeat(beat));
    return unsub;
  }, []);

  const scheduleAllNotes = useCallback(() => {
    setBpm(bpm);
    const instruments = useBandStore.getState().activeIds;

    if (instruments.length === 0) {
      console.warn("没有添加乐器，请先拖拽乐器到乐队舞台");
      return;
    }

    // Schedule piano roll notes on each instrument
    for (const instId of instruments) {
      scheduleNotes(notes, instId, bpm);
    }

    // Also schedule chord notes on the first instrument
    if (chords.length > 0 && instruments.length > 0) {
      const chordNotes = chords.flatMap((chord) =>
        chord.notes.map((pitch, i) => ({
          id: `${chord.id}-${i}`,
          pitch,
          startTime: chord.startTime,
          duration: chord.duration,
          velocity: 0.6,
        })),
      );
      scheduleNotes(chordNotes, instruments[0], bpm);
    }
  }, [notes, chords, bpm]);

  const handlePlay = async () => {
    scheduleAllNotes();
    await start();
    setPlaying(true);
  };

  const handlePause = () => {
    pause();
    setPlaying(false);
  };

  const handleStop = () => {
    stop();
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
          onChange={(e) => { const val = Number(e.target.value); setBpm(val); storeSetBpm(val); }}
          className="w-14 px-1.5 py-0.5 bg-neutral-700 rounded text-neutral-200 text-center text-sm
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
      <div className="text-xs text-neutral-500 tabular-nums ml-2">
        节拍 {currentBeat.toFixed(1)}
      </div>
    </div>
  );
}
