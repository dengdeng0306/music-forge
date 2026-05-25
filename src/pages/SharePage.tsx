import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadProject } from "@/shared/utils/storage";
import type { Project } from "@/shared/types/common";
import { ArrowLeft, Music } from "lucide-react";

export function SharePage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId)
        .then(setProject)
        .catch(console.error);
    }
  }, [projectId]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-400">
        加载中...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <header className="w-full max-w-2xl py-4">
        <button
          className="flex items-center gap-2 text-neutral-400 hover:text-neutral-200 transition-colors"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </button>
      </header>

      <main className="w-full max-w-2xl flex flex-col items-center gap-6">
        <Music className="w-16 h-16 text-purple-400" />
        <h1 className="text-2xl font-bold text-white">{project.name}</h1>

        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="p-4 rounded-xl bg-neutral-800 text-center">
            <div className="text-2xl font-bold text-purple-400">{project.bpm}</div>
            <div className="text-xs text-neutral-500 mt-1">BPM</div>
          </div>
          <div className="p-4 rounded-xl bg-neutral-800 text-center">
            <div className="text-2xl font-bold text-purple-400">{project.key}</div>
            <div className="text-xs text-neutral-500 mt-1">调性</div>
          </div>
          <div className="p-4 rounded-xl bg-neutral-800 text-center">
            <div className="text-2xl font-bold text-purple-400">{project.tracks.length}</div>
            <div className="text-xs text-neutral-500 mt-1">乐器轨数</div>
          </div>
          <div className="p-4 rounded-xl bg-neutral-800 text-center">
            <div className="text-2xl font-bold text-purple-400">{project.lyrics.length}</div>
            <div className="text-xs text-neutral-500 mt-1">歌词行数</div>
          </div>
        </div>

        {project.lyrics.length > 0 && (
          <div className="w-full p-4 rounded-xl bg-neutral-800">
            <h3 className="text-sm font-semibold text-neutral-300 mb-2">歌词</h3>
            {project.lyrics.map((line) => (
              <p key={line.id} className="text-neutral-400 text-sm leading-relaxed">
                {line.text || "(空)"}
              </p>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
