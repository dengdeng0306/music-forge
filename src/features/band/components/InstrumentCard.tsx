import { useDraggable } from "@dnd-kit/core";
import type { Instrument } from "@/shared/types/common";
import { Guitar, Drum, Piano, Music, Mic, Waves, Radio, DiscAlbum } from "lucide-react";

const iconMap: Record<string, typeof Guitar> = {
  drum: Drum,
  bass: DiscAlbum,
  guitar: Guitar,
  piano: Piano,
  synth: Waves,
  violin: Music,
  cello: Music,
  trumpet: Radio,
  sax: Radio,
  mic: Mic,
  waveform: Waves,
};

interface InstrumentCardProps {
  instrument: Instrument;
  isActive: boolean;
  onClick: () => void;
}

export function InstrumentCard({ instrument, isActive, onClick }: InstrumentCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: instrument.id,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)`, opacity: isDragging ? 0.7 : 1 }
    : undefined;

  const Icon = iconMap[instrument.icon] ?? Music;

  return (
    <div
      ref={setNodeRef}
      className={`relative flex flex-col items-center p-3 rounded-xl border-2 cursor-grab
        transition-all select-none
        ${isActive
          ? "border-purple-500 bg-purple-500/10"
          : "border-neutral-700 bg-neutral-800 hover:border-neutral-500"}
        ${isDragging ? "shadow-lg z-50" : ""}`}
      style={style}
      onClick={onClick}
      {...listeners}
      {...attributes}
    >
      <Icon className={`w-8 h-8 mb-1 ${isActive ? "text-purple-400" : "text-neutral-400"}`} />
      <span className="text-xs font-medium text-neutral-200">{instrument.name}</span>
      <span className="text-[10px] text-neutral-500">{instrument.category}</span>
      {isActive && (
        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-400" />
      )}
    </div>
  );
}
