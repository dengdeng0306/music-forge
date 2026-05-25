let counter = 0;

export function generateId(prefix = ""): string {
  counter += 1;
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}${rand}_${counter}`;
}
