import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TemplatePicker } from "@/features/templates/components/TemplatePicker";
import { Button } from "@/shared/components/Button";
import { listProjects, deleteProject } from "@/shared/utils/storage";
import { generateId } from "@/shared/utils/id";
import type { Project } from "@/shared/types/common";
import { Music, Plus, Trash2 } from "lucide-react";

export function HomePage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    listProjects().then(setProjects).catch(console.error);
  }, []);

  const handleNewProject = () => {
    const id = generateId("proj");
    navigate(`/studio/${id}`);
  };

  const handleDelete = async (id: string) => {
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <header className="w-full max-w-4xl py-8 text-center">
        <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
          <Music className="w-10 h-10 text-purple-400" />
          Music Forge
        </h1>
        <p className="mt-2 text-neutral-400">拖拽乐器，谱写你的音乐</p>
      </header>

      <main className="w-full max-w-4xl flex flex-col gap-8">
        {/* New project section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-200">开始创作</h2>
            <Button onClick={handleNewProject}>
              <Plus className="w-4 h-4" />
              新建空白项目
            </Button>
          </div>
          <TemplatePicker onSelect={() => {
            const id = generateId("proj");
            navigate(`/studio/${id}`);
          }} />
        </section>

        {/* Recent projects */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-neutral-200 mb-4">最近项目</h2>
            <div className="grid gap-2">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-neutral-800
                    hover:bg-neutral-700 transition-colors cursor-pointer"
                  onClick={() => navigate(`/studio/${proj.id}`)}
                >
                  <div>
                    <div className="text-sm font-medium text-neutral-200">
                      {proj.name || "未命名项目"}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {proj.key} · {proj.bpm} BPM · {proj.tracks.length} 轨
                      {" · "}
                      {new Date(proj.updatedAt).toLocaleDateString("zh-CN")}
                    </div>
                  </div>
                  <button
                    className="p-1.5 text-neutral-600 hover:text-red-400 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(proj.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
