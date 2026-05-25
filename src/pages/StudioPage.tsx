import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { InstrumentPalette } from "@/features/band/components/InstrumentPalette";
import { BandStage } from "@/features/band/components/BandStage";
import { BandControls } from "@/features/band/components/BandControls";
import { TransportBar } from "@/features/composer/components/TransportBar";
import { PianoRoll } from "@/features/composer/components/PianoRoll";
import { ChordPanel } from "@/features/composer/components/ChordPanel";
import { LyricsEditor } from "@/features/lyrics/components/LyricsEditor";
import { Button } from "@/shared/components/Button";
import { useBandStore } from "@/features/band/store";
import { useComposerStore } from "@/features/composer/store";
import { useLyricsStore } from "@/features/lyrics/store";
import { generateId } from "@/shared/utils/id";
import { loadProject, saveProject } from "@/shared/utils/storage";
import { useAutoSave } from "@/shared/hooks/useAutoSave";
import type { Project } from "@/shared/types/common";
import { ArrowLeft, Save, Download } from "lucide-react";
import { renderToWav } from "@/audio/export";
import { useNavigate } from "react-router-dom";

export function StudioPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const id = projectId ?? generateId("proj");
  const navigate = useNavigate();

  const { activeIds, activeInstruments, addInstrument } = useBandStore();
  const { notes, chords, bpm, key } = useComposerStore();
  const { lines } = useLyricsStore();

  const project: Project = useMemo(
    () => ({
      id,
      name: "未命名项目",
      bpm,
      key,
      timeSignature: [4, 4],
      tracks: activeInstruments.map((inst) => ({
        id: inst.id,
        instrumentId: inst.id,
        notes: notes.filter((n) => n.pitch >= inst.range[0] && n.pitch <= inst.range[1]),
        volume: 0.8,
        pan: 0,
        muted: false,
        solo: false,
      })),
      chords,
      lyrics: lines,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    [id, bpm, key, activeInstruments, notes, chords, lines],
  );

  useAutoSave(project, 5000);

  useEffect(() => {
    loadProject(id)
      .then((data) => {
        if (data) {
          useComposerStore.getState().setBpm(data.bpm);
          useComposerStore.getState().setKey(data.key);
          useLyricsStore.getState().setLines(data.lyrics);
          for (const track of data.tracks) {
            addInstrument(track.instrumentId);
          }
          for (const note of data.notes ?? []) {
            useComposerStore.getState().addNote(note);
          }
          for (const chord of data.chords ?? []) {
            useComposerStore.getState().addChord(chord);
          }
        }
      })
      .catch(console.error);
  }, [id, addInstrument]);

  const handleDragStart = (_event: DragStartEvent) => {
    // Drag started
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && over.id === "band-stage") {
      addInstrument(active.id as string);
    }
  };

  const handleExport = async () => {
    const wav = await renderToWav(60);
    const url = URL.createObjectURL(wav);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${project.name || "untitled"}.wav`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleManualSave = () => {
    saveProject(project).catch(console.error);
  };

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-2 bg-neutral-850 border-b border-neutral-700">
          <div className="flex items-center gap-3">
            <button
              className="p-1.5 rounded-md hover:bg-neutral-700 transition-colors text-neutral-400"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-base font-semibold text-white">Music Forge Studio</h1>
          </div>
          <div className="flex items-center gap-2">
            <TransportBar />
            <Button size="sm" variant="secondary" onClick={handleManualSave}>
              <Save className="w-3.5 h-3.5" />
              保存
            </Button>
            <Button size="sm" variant="primary" onClick={handleExport}>
              <Download className="w-3.5 h-3.5" />
              导出 WAV
            </Button>
          </div>
        </header>

        {/* Main workspace */}
        <div className="flex-1 flex gap-0">
          {/* Left sidebar */}
          <aside className="w-64 flex-shrink-0 border-r border-neutral-700 bg-neutral-850 p-3 overflow-y-auto">
            <InstrumentPalette />
          </aside>

          {/* Center area */}
          <main className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
            <BandStage />
            <BandControls />
            <PianoRoll />
          </main>

          {/* Right sidebar */}
          <aside className="w-72 flex-shrink-0 border-l border-neutral-700 bg-neutral-850 p-3 overflow-y-auto flex flex-col gap-4">
            <ChordPanel />
            <LyricsEditor />
          </aside>
        </div>
      </div>
    </DndContext>
  );
}
