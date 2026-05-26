import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DndContext, pointerWithin } from "@dnd-kit/core";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { InstrumentPalette } from "@/features/band/components/InstrumentPalette";
import { BandStage } from "@/features/band/components/BandStage";
import { BandControls } from "@/features/band/components/BandControls";
import { TransportBar } from "@/features/composer/components/TransportBar";
import { PianoRoll } from "@/features/composer/components/PianoRoll";
import { ChordPanel } from "@/features/composer/components/ChordPanel";
import { LyricsEditor } from "@/features/lyrics/components/LyricsEditor";
import { LyricsGenPanel } from "@/features/lyrics/components/LyricsGenPanel";
import { SyllableMatcher } from "@/features/lyrics/components/SyllableMatcher";
import { Button } from "@/shared/components/Button";
import { useBandStore } from "@/features/band/store";
import { useComposerStore } from "@/features/composer/store";
import { useLyricsStore } from "@/features/lyrics/store";
import { generateId } from "@/shared/utils/id";
import { loadProject, saveProject } from "@/shared/utils/storage";
import { useAutoSave } from "@/shared/hooks/useAutoSave";
import type { Project } from "@/shared/types/common";
import { ArrowLeft, Save, Download, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { renderToWav } from "@/audio/export";

type MobilePanel = "none" | "instruments" | "tools";

export function StudioPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const id = projectId ?? generateId("proj");
  const navigate = useNavigate();
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("none");

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
    <DndContext collisionDetection={pointerWithin} onDragEnd={handleDragEnd}>
      <div className="min-h-screen flex flex-col bg-neutral-900">
        {/* Header */}
        <header className="flex items-center justify-between px-3 py-2 bg-neutral-850 border-b border-neutral-700 gap-2">
          <div className="flex items-center gap-2">
            <button
              className="p-1.5 rounded-md hover:bg-neutral-700 transition-colors text-neutral-400"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-sm md:text-base font-semibold text-white truncate max-w-[120px] md:max-w-none">
              Music Forge
            </h1>
          </div>

          {/* Mobile panel toggles */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              className={`p-1.5 rounded-md transition-colors text-xs
                ${mobilePanel === "instruments" ? "bg-purple-600 text-white" : "text-neutral-400 hover:bg-neutral-700"}`}
              onClick={() => setMobilePanel(mobilePanel === "instruments" ? "none" : "instruments")}
            >
              乐器
            </button>
            <button
              className={`p-1.5 rounded-md transition-colors text-xs
                ${mobilePanel === "tools" ? "bg-purple-600 text-white" : "text-neutral-400 hover:bg-neutral-700"}`}
              onClick={() => setMobilePanel(mobilePanel === "tools" ? "none" : "tools")}
            >
              工具
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="hidden sm:block">
              <TransportBar />
            </div>
            <Button size="sm" variant="secondary" onClick={handleManualSave}>
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">保存</span>
            </Button>
            <Button size="sm" variant="primary" onClick={handleExport}>
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">导出</span>
            </Button>
          </div>
        </header>

        {/* Mobile transport bar */}
        <div className="sm:hidden px-3 py-1.5 bg-neutral-850 border-b border-neutral-700">
          <TransportBar />
        </div>

        {/* Main workspace */}
        <div className="flex-1 flex gap-0 relative">
          {/* Left sidebar — desktop always visible, mobile as overlay */}
          <aside
            className={`w-64 flex-shrink-0 border-r border-neutral-700 bg-neutral-850 overflow-y-auto
              hidden lg:block
              ${mobilePanel === "instruments"
                ? "!block absolute inset-y-0 left-0 z-30 shadow-2xl"
                : "hidden"}`}
          >
            <div className="flex items-center justify-between p-2 border-b border-neutral-700 lg:hidden">
              <span className="text-sm font-medium text-neutral-300">乐器库</span>
              <button
                className="p-1 rounded-md hover:bg-neutral-700 text-neutral-400"
                onClick={() => setMobilePanel("none")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3">
              <InstrumentPalette />
            </div>
          </aside>

          {/* Center area */}
          <main className="flex-1 flex flex-col p-2 md:p-4 gap-2 md:gap-4 overflow-y-auto min-w-0">
            <BandStage />
            <BandControls />
            <div className="flex-1 min-h-0 overflow-x-auto">
              <PianoRoll />
            </div>
          </main>

          {/* Right sidebar — desktop always visible, mobile as overlay */}
          <aside
            className={`w-72 flex-shrink-0 border-l border-neutral-700 bg-neutral-850 overflow-y-auto
              hidden lg:flex lg:flex-col lg:gap-4
              ${mobilePanel === "tools"
                ? "!flex !flex-col !gap-4 absolute inset-y-0 right-0 z-30 shadow-2xl"
                : "hidden"}`}
          >
            <div className="flex items-center justify-between p-2 border-b border-neutral-700 lg:hidden">
              <span className="text-sm font-medium text-neutral-300">工具面板</span>
              <button
                className="p-1 rounded-md hover:bg-neutral-700 text-neutral-400"
                onClick={() => setMobilePanel("none")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 flex flex-col gap-4">
              <ChordPanel />
              <LyricsGenPanel />
              <SyllableMatcher />
              <LyricsEditor />
            </div>
          </aside>
        </div>

        {/* Mobile panel backdrop */}
        {mobilePanel !== "none" && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setMobilePanel("none")}
          />
        )}
      </div>
    </DndContext>
  );
}
