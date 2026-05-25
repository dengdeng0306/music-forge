import { useEffect, useRef } from "react";
import { saveProject } from "@/shared/utils/storage";
import type { Project } from "@/shared/types/common";

export function useAutoSave(
  project: Project | null,
  intervalMs = 5000,
): void {
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!project) return;
    timerRef.current = setInterval(() => {
      saveProject(project).catch(console.error);
    }, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [project, intervalMs]);
}
