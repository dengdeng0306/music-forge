const API_ENDPOINT = import.meta.env.VITE_LLM_API_URL ?? "https://api.openai.com/v1/chat/completions";
const API_KEY = import.meta.env.VITE_LLM_API_KEY ?? "";
const MODEL = import.meta.env.VITE_LLM_MODEL ?? "gpt-4o-mini";

export interface LyricsGenParams {
  topic: string;
  mood: string;
  style: string;
  lineCount: number;
  language: "zh" | "en";
}

export async function generateLyrics(
  params: LyricsGenParams,
  onChunk?: (text: string) => void,
): Promise<string[]> {
  if (!API_KEY) {
    throw new Error("请在 .env 文件中配置 VITE_LLM_API_KEY");
  }

  const langPrompt =
    params.language === "zh"
      ? "用中文写歌词。注意押韵和节奏感。"
      : "Write lyrics in English. Focus on rhyme and rhythm.";

  const systemPrompt = `你是一位专业的作词人。${langPrompt}
根据用户提供的主题、情绪和风格创作歌词。
每行一句，不要标注"主歌""副歌"等段落标签。
只返回歌词文本，不要额外解释。`;

  const userPrompt = `主题：${params.topic}
情绪：${params.mood}
风格：${params.style}
行数：约${params.lineCount}行`;

  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.9,
      max_tokens: 800,
      stream: false,
    }),
  });

  if (!response.ok) {
    const err = await response.text().catch(() => "");
    throw new Error(`AI API 错误 (${response.status}): ${err.slice(0, 200)}`);
  }

  const data = await response.json();
  const text: string = data.choices?.[0]?.message?.content ?? "";
  onChunk?.(text);

  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("（") && !line.startsWith("("));
}
