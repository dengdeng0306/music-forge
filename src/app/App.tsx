import { useEffect } from "react";
import { resumeAudioContext } from "@/audio/engine";

export function App({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handler = () => {
      resumeAudioContext().catch(console.error);
    };
    document.addEventListener("click", handler, { once: true });
    return () => document.removeEventListener("click", handler);
  }, []);

  return <>{children}</>;
}
