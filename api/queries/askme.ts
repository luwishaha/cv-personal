import { and, desc, eq, sql } from "drizzle-orm";
import {
  conversations,
  evidenceFiles,
  knowledgeItems,
  llmSettings,
  messages,
} from "@db/schema";
import { getDb } from "./connection";

// ---------- conversations / messages ----------

export async function findConversationBySession(sessionId: string) {
  const rows = await getDb()
    .select()
    .from(conversations)
    .where(eq(conversations.sessionId, sessionId))
    .orderBy(desc(conversations.id))
    .limit(1);
  return rows.at(0);
}

export async function createConversation(sessionId: string) {
  const res = await getDb()
    .insert(conversations)
    .values({ sessionId });
  return Number(res[0].insertId);
}

export async function touchConversation(id: number) {
  await getDb()
    .update(conversations)
    .set({ updatedAt: new Date() })
    .where(eq(conversations.id, id));
}

export async function addMessage(data: {
  conversationId: number;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  matched?: "yes" | "no";
}) {
  const res = await getDb()
    .insert(messages)
    .values({
      conversationId: data.conversationId,
      role: data.role,
      content: data.content,
      sources: data.sources ? JSON.stringify(data.sources) : null,
      matched: data.matched ?? "no",
    });
  return Number(res[0].insertId);
}

export async function listConversations() {
  return getDb()
    .select()
    .from(conversations)
    .orderBy(desc(conversations.updatedAt))
    .limit(100);
}

export async function listMessagesByConversation(conversationId: number) {
  return getDb()
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.id);
}

export async function listRecentMessages(limit = 50) {
  return getDb()
    .select()
    .from(messages)
    .orderBy(desc(messages.id))
    .limit(limit);
}

// ---------- knowledge ----------

export async function listKnowledge(onlyEnabled = false) {
  const q = getDb().select().from(knowledgeItems);
  const rows = onlyEnabled
    ? await q.where(eq(knowledgeItems.enabled, "yes"))
    : await q;
  return rows.sort((a, b) => b.id - a.id);
}

export async function createKnowledge(data: {
  title: string;
  category: string;
  content: string;
  keywords: string;
}) {
  const res = await getDb().insert(knowledgeItems).values(data);
  return Number(res[0].insertId);
}

export async function updateKnowledge(
  id: number,
  data: Partial<{
    title: string;
    category: string;
    content: string;
    keywords: string;
    enabled: "yes" | "no";
  }>,
) {
  await getDb()
    .update(knowledgeItems)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(knowledgeItems.id, id));
}

export async function deleteKnowledge(id: number) {
  await getDb().delete(knowledgeItems).where(eq(knowledgeItems.id, id));
}

// ---------- evidence ----------

export async function listEvidence() {
  const rows = await getDb().select().from(evidenceFiles);
  return rows.sort((a, b) => b.id - a.id);
}

export async function createEvidence(data: {
  name: string;
  fileType: string;
  content?: string;
  note?: string;
}) {
  const res = await getDb().insert(evidenceFiles).values(data);
  return Number(res[0].insertId);
}

export async function deleteEvidence(id: number) {
  await getDb().delete(evidenceFiles).where(eq(evidenceFiles.id, id));
}

// ---------- llm settings ----------

export async function getLlmSettings() {
  const rows = await getDb().select().from(llmSettings).limit(1);
  return rows.at(0);
}

export async function upsertLlmSettings(data: {
  provider?: string;
  apiBase?: string;
  apiKey?: string;
  model?: string;
  temperature?: string;
  enabled?: "yes" | "no";
}) {
  const existing = await getLlmSettings();
  if (!existing) {
    await getDb().insert(llmSettings).values({
      provider: data.provider ?? "openai-compatible",
      apiBase: data.apiBase ?? "",
      apiKey: data.apiKey ?? "",
      model: data.model ?? "",
      temperature: data.temperature ?? "0.3",
      enabled: data.enabled ?? "no",
    });
    return;
  }
  await getDb()
    .update(llmSettings)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(llmSettings.id, existing.id));
}

// ---------- stats ----------

export async function askmeStats() {
  const db = getDb();
  const [q] = await db
    .select({ n: sql<number>`count(*)` })
    .from(messages)
    .where(eq(messages.role, "user"));
  const [k] = await db.select({ n: sql<number>`count(*)` }).from(knowledgeItems);
  const [e] = await db.select({ n: sql<number>`count(*)` }).from(evidenceFiles);
  const [hit] = await db
    .select({ n: sql<number>`count(*)` })
    .from(messages)
    .where(and(eq(messages.role, "assistant"), eq(messages.matched, "yes")));
  const [totalA] = await db
    .select({ n: sql<number>`count(*)` })
    .from(messages)
    .where(eq(messages.role, "assistant"));
  return {
    questions: Number(q?.n ?? 0),
    knowledge: Number(k?.n ?? 0),
    evidence: Number(e?.n ?? 0),
    hitRate:
      Number(totalA?.n ?? 0) > 0
        ? Math.round((Number(hit?.n ?? 0) / Number(totalA?.n ?? 1)) * 100)
        : 0,
  };
}
