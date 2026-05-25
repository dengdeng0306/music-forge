import { get as idbGet, set as idbSet, del as idbDel, keys as idbKeys } from "idb-keyval";
import type { Project } from "@/shared/types/common";

const PROJECT_PREFIX = "project:";

export async function saveProject(project: Project): Promise<void> {
  const key = `${PROJECT_PREFIX}${project.id}`;
  const data = { ...project, updatedAt: new Date().toISOString() };
  await idbSet(key, data);
}

export async function loadProject(id: string): Promise<Project | null> {
  const key = `${PROJECT_PREFIX}${id}`;
  const data = await idbGet<Project>(key);
  return data ?? null;
}

export async function deleteProject(id: string): Promise<void> {
  const key = `${PROJECT_PREFIX}${id}`;
  await idbDel(key);
}

export async function listProjects(): Promise<Project[]> {
  const allKeys = await idbKeys<string>();
  const projectKeys = allKeys.filter((k) => k.startsWith(PROJECT_PREFIX));
  const projects = await Promise.all(
    projectKeys.map((k) => idbGet<Project>(k)),
  );
  return projects
    .filter((p): p is Project => p !== null && p !== undefined)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}
