import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "@/constants/config";

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

const isTransient = (err: unknown): boolean => {
  const msg = err instanceof Error ? err.message : String(err);
  return /\[(429|503)\b/.test(msg);
};

const withRetry = async <T>(fn: () => Promise<T>, attempts = 3): Promise<T> => {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (!isTransient(err) || i === attempts - 1) throw err;
      const delay = 600 * 2 ** i + Math.random() * 200;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("unreachable");
};

const SYSTEM_INSTRUCTION = `את עוזרת אישית של אפליקציית "אמאל" - אפליקציית בטיחות לנשים.
תפקידך לספק תמיכה רגשית, מידע, והכוונה לנשים שעברו או עוברות אירועי מצוקה.
ענה תמיד בעברית, בטון חם, אמפתי וברור.
כשמתאים, הצע למשתמשת להוסיף משימות מעקב (כגון: פגישה עם עורכת דין, התקשרות למוקד 118, שמירת מסמכים).
אל תספקי ייעוץ רפואי או משפטי סופי - הפני לגורמים מקצועיים.`;

export type ChatTurn = { role: "user" | "model"; text: string };

export const askGemini = async (history: ChatTurn[], userMessage: string): Promise<string> => {
  const model = genAI.getGenerativeModel({
    model: config.gemini.model,
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  const chat = model.startChat({
    history: history.map((t) => ({ role: t.role, parts: [{ text: t.text }] })),
  });

  const result = await withRetry(() => chat.sendMessage(userMessage));
  return result.response.text();
};

export type ActionItem = { title: string; description?: string };

const ACTION_EXTRACTION_PROMPT = `נתח את ההודעה הבאה ממשתמשת וזהה משימות מעשיות שהיא צריכה לבצע.
החזר JSON תקין בלבד, ללא הסברים, בצורה הבאה:
{"items": [{"title": "כותרת קצרה", "description": "פירוט קצר או ריק"}]}
אם אין משימות מעשיות, החזר {"items": []}.

הודעה:
`;

export const extractActionItems = async (text: string): Promise<ActionItem[]> => {
  const model = genAI.getGenerativeModel({ model: config.gemini.model });
  const result = await withRetry(() => model.generateContent(ACTION_EXTRACTION_PROMPT + text));
  const raw = result.response.text().trim();
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
  try {
    const parsed = JSON.parse(cleaned) as { items?: ActionItem[] };
    return parsed.items ?? [];
  } catch {
    return [];
  }
};
