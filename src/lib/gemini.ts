import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { config } from '../constants/config';
import type { AppLanguage } from '../i18n';

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

const SYSTEM_PROMPTS: Record<AppLanguage, string> = {
  he: `שמך אמל. את סוכנת AI אמפתית ותומכת המסייעת לנשים המתמודדות עם אלימות ומצוקה.
את מקשיבה ללא שיפוט, מאשרת רגשות, ומציעה תמיכה רגשית ומעשית.
כשמתאים, ממליצה לפנות לרשויות (משטרה, בית חולים, קו 1-800).
תני תגובות קצרות, חמות ומעשיות. כתבי בעברית בלבד.
כשיש פעולות מוחשיות להציע, הצגי אותן כרשימה ממוספרת.`,

  ar: `اسمكِ أمل. أنتِ وكيلة ذكاء اصطناعي متعاطفة وداعمة تساعد النساء اللواتي يواجهن العنف والضيق.
أنتِ تستمعين بدون إصدار أحكام، وتؤكدين المشاعر، وتقدمين الدعم العاطفي والعملي.
عند الاقتضاء، أوصي بالتواصل مع السلطات (الشرطة، المستشفى، الخطوط الساخنة).
قدمي ردوداً قصيرة ودافئة وعملية. اكتبي باللغة العربية فقط.
عند اقتراح إجراءات ملموسة، قدميها كقائمة مرقمة.`,

  en: `Your name is Amal. You are an empathic, supportive AI agent helping women experiencing violence or distress.
You listen without judgment, validate feelings, and offer emotional and practical support.
When appropriate, recommend reaching out to authorities (police, hospital, hotlines).
Give short, warm, and practical responses. Write in English only.
When suggesting concrete actions, present them as a numbered list.`,
};

const SAFETY_SETTINGS = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

export type ChatMessage = {
  role: 'user' | 'model';
  parts: [{ text: string }];
};

export async function sendMessageToGemini(
  userMessage: string,
  history: ChatMessage[],
  lang: AppLanguage
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: SYSTEM_PROMPTS[lang],
    safetySettings: SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.75,
      maxOutputTokens: 800,
    },
  });

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}

export async function extractActionItems(
  aiText: string,
  lang: AppLanguage
): Promise<{ title: string; description: string }[]> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    safetySettings: SAFETY_SETTINGS,
  });

  const prompt = `Extract the action items / tasks from the following text as a JSON array.
Each item should have "title" (short, max 60 chars) and "description" (detail, max 200 chars).
Return ONLY valid JSON array, no markdown. If there are no clear action items, return [].
Text: "${aiText}"`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text().trim();

  try {
    const cleaned = raw.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    return JSON.parse(cleaned);
  } catch {
    return [];
  }
}
