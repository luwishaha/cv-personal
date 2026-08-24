import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { assertAdminToken } from "./admin-auth";
import {
  addMessage,
  askmeStats,
  createConversation,
  createEvidence,
  createKnowledge,
  deleteEvidence,
  deleteKnowledge,
  findConversationBySession,
  getLlmSettings,
  listConversations,
  listEvidence,
  listKnowledge,
  listMessagesByConversation,
  listRecentMessages,
  touchConversation,
  updateKnowledge,
  upsertLlmSettings,
} from "./queries/askme";

// ---------- 答案生成 ----------

const BASE_FACTS = `你是李泽延个人网站上的 AI 助手「LZY Assistant」。只允许基于给定资料回答关于李泽延的问题。
李泽延：新加坡南洋理工大学 计算机科学与技术（人工智能方向）硕士（2026.07—2027.06），广东工业大学 电子商务（大数据挖掘与分析方向）学士（2021.09—2025.07）。2027 届秋招，目标岗位 AI 产品经理。
实习经历：智谱华章 MaaS 平台 AI 应用实习生（2026.05—08，统一模型评测平台，8 模型横评、150+ 样本、覆盖 PPT/视觉理解/Excel 场景）；OPPO 硬件工程 AI 算法实习生（2025.11—2026.04，GUI 自动化测试 Agent，Host/App 双 Agent 架构，通过率 35%→87%，单步 12s→6s）；深圳市南山区人民医院 Agent 开发实习生（2025.08—10，4 专家 Agent 病案编码，准确率 +13%、召回率 +7%）；TCL 供应链战略部 AI 算法实习生（2025.04—08，关税政策情报 Agent，白名单数据源迭代）；唯品会 总经办项目管理部 供应链管理实习生（2024.12—2025.05，残损与赔付数据挖掘，预计挽损超 256 万元）。
学生工作：院团委学生副书记（2021.09—2023.09，53 次志愿活动、服务 12000+ 人次）；院辩论社培训部副部长（2021.12—2023.06，2 场 200 人校级辩论赛、9 期训练课程）。
技能：Python / SQL / LangGraph / FastAPI / VLM 微调 / RAG / LightGBM，IELTS 6.5。`;

type KnowledgeRow = Awaited<ReturnType<typeof listKnowledge>>[number];

function scoreItem(question: string, item: KnowledgeRow): number {
  const q = question.toLowerCase();
  let score = 0;
  const kws = item.keywords
    .split(/[,，、\s]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  for (const kw of kws) if (kw && q.includes(kw)) score += 3;
  for (const ch of item.title.toLowerCase().split("")) {
    if (q.includes(ch) && /[一-龥a-z0-9]/.test(ch)) score += 0.2;
  }
  return score;
}

async function callLlm(
  question: string,
  context: string,
  onError?: (msg: string) => void,
): Promise<string | null> {
  const s = await getLlmSettings();
  if (!s || s.enabled !== "yes" || !s.apiBase || !s.apiKey || !s.model)
    return null;
  try {
    const base = s.apiBase.replace(/\/$/, "");
    const resp = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${s.apiKey}`,
      },
      body: JSON.stringify({
        model: s.model,
        // k3 等推理模型仅允许 temperature=1，固定传 1 以兼容所有模型
        temperature: 1,
        messages: [
          { role: "system", content: `${BASE_FACTS}\n\n【知识库资料】\n${context || "（暂无匹配资料）"}\n\n回答要求：中文，简洁，分点，100 字左右；资料不足时明确说明，不要编造。` },
          { role: "user", content: question },
        ],
      }),
      signal: AbortSignal.timeout(45000),
    });
    if (!resp.ok) {
      onError?.(`HTTP ${resp.status}: ${(await resp.text()).slice(0, 200)}`);
      return null;
    }
    const data = (await resp.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const answer = data.choices?.[0]?.message?.content?.trim() || null;
    if (!answer) onError?.("模型返回了空内容");
    return answer;
  } catch (e) {
    onError?.(e instanceof Error ? e.message : String(e));
    return null;
  }
}

function composeLocalAnswer(
  _question: string,
  hits: KnowledgeRow[],
): { answer: string; matched: boolean } {
  if (hits.length === 0) {
    return {
      matched: false,
      answer:
        "这个问题暂时超出我现有的资料库范围了。我已经把它记录下来，泽延会在后台补充对应的知识，之后再问我一次就能得到更准确的回答。你也可以换个角度问，比如他的实习 CASE、技术栈或学生工作。",
    };
  }
  const parts = hits
    .slice(0, 2)
    .map((h) => `【${h.title}】${h.content.slice(0, 220)}`);
  return {
    matched: true,
    answer: `根据资料库里的记录：\n\n${parts.join("\n\n")}\n\n以上回答可溯源到左侧标注的来源。`,
  };
}

// ---------- 路由 ----------

export const askmeRouter = createRouter({
  // 访客提问（公开）
  ask: publicQuery
    .input(
      z.object({
        question: z.string().min(1).max(500),
        sessionId: z.string().min(6).max(64),
      }),
    )
    .mutation(async ({ input }) => {
      let conv = await findConversationBySession(input.sessionId);
      if (!conv) {
        const id = await createConversation(input.sessionId);
        conv = { id } as unknown as NonNullable<typeof conv>;
      } else {
        await touchConversation(conv.id);
      }
      const conversationId = conv!.id;
      await addMessage({
        conversationId,
        role: "user",
        content: input.question,
      });

      const items = await listKnowledge(true);
      const scored = items
        .map((it) => ({ it, s: scoreItem(input.question, it) }))
        .filter((x) => x.s >= 2)
        .sort((a, b) => b.s - a.s);
      const hits = scored.map((x) => x.it);
      const sources = hits.slice(0, 2).map((h) => h.title);
      const context = hits
        .slice(0, 3)
        .map((h) => `【${h.title}】${h.content}`)
        .join("\n");

      let answer = await callLlm(input.question, context);
      let matched = hits.length > 0;
      if (!answer) {
        const local = composeLocalAnswer(input.question, hits);
        answer = local.answer;
        matched = local.matched;
      }
      await addMessage({
        conversationId,
        role: "assistant",
        content: answer,
        sources,
        matched: matched ? "yes" : "no",
      });
      return { answer, sources, matched };
    }),

  // 拉取本会话历史（公开，按 sessionId 隔离）
  history: publicQuery
    .input(z.object({ sessionId: z.string().min(6).max(64) }))
    .query(async ({ input }) => {
      const conv = await findConversationBySession(input.sessionId);
      if (!conv) return [];
      const rows = await listMessagesByConversation(conv.id);
      return rows.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        sources: m.sources ? (JSON.parse(m.sources) as string[]) : [],
        createdAt: m.createdAt,
      }));
    }),
});

// 管理端接口：独立密钥 token 鉴权（不走 Kimi 登录）。
// 每个 procedure 的 input 必须带 token，开头统一 assertAdminToken。
const authed = z.object({ token: z.string().min(1) });

export const adminRouter = createRouter({
  stats: publicQuery.input(authed).query(async ({ input }) => {
    await assertAdminToken(input.token);
    return askmeStats();
  }),

  conversations: publicQuery.input(authed).query(async ({ input }) => {
    await assertAdminToken(input.token);
    return listConversations();
  }),

  recentMessages: publicQuery.input(authed).query(async ({ input }) => {
    await assertAdminToken(input.token);
    const rows = await listRecentMessages(60);
    return rows.map((m) => ({
      ...m,
      sources: m.sources ? (JSON.parse(m.sources) as string[]) : [],
    }));
  }),

  conversationMessages: publicQuery
    .input(authed.extend({ conversationId: z.number() }))
    .query(async ({ input }) => {
      await assertAdminToken(input.token);
      const rows = await listMessagesByConversation(input.conversationId);
      return rows.map((m) => ({
        ...m,
        sources: m.sources ? (JSON.parse(m.sources) as string[]) : [],
      }));
    }),

  knowledgeList: publicQuery.input(authed).query(async ({ input }) => {
    await assertAdminToken(input.token);
    return listKnowledge(false);
  }),

  knowledgeCreate: publicQuery
    .input(
      authed.extend({
        title: z.string().min(1).max(255),
        category: z.string().max(64).default("通用"),
        content: z.string().min(1),
        keywords: z.string().max(512).default(""),
      }),
    )
    .mutation(async ({ input }) => {
      await assertAdminToken(input.token);
      const { token: _t, ...data } = input;
      return createKnowledge(data);
    }),

  knowledgeUpdate: publicQuery
    .input(
      authed.extend({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        category: z.string().max(64).optional(),
        content: z.string().min(1).optional(),
        keywords: z.string().max(512).optional(),
        enabled: z.enum(["yes", "no"]).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      await assertAdminToken(input.token);
      const { id, token: _t, ...data } = input;
      await updateKnowledge(id, data);
    }),

  knowledgeDelete: publicQuery
    .input(authed.extend({ id: z.number() }))
    .mutation(async ({ input }) => {
      await assertAdminToken(input.token);
      await deleteKnowledge(input.id);
    }),

  evidenceList: publicQuery.input(authed).query(async ({ input }) => {
    await assertAdminToken(input.token);
    return listEvidence();
  }),

  evidenceCreate: publicQuery
    .input(
      authed.extend({
        name: z.string().min(1).max(255),
        fileType: z.string().max(32).default("md"),
        content: z.string().max(200000).optional(),
        note: z.string().max(255).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      await assertAdminToken(input.token);
      const { token: _t, ...data } = input;
      return createEvidence(data);
    }),

  evidenceDelete: publicQuery
    .input(authed.extend({ id: z.number() }))
    .mutation(async ({ input }) => {
      await assertAdminToken(input.token);
      await deleteEvidence(input.id);
    }),

  llmGet: publicQuery.input(authed).query(async ({ input }) => {
    await assertAdminToken(input.token);
    const s = await getLlmSettings();
    if (!s)
      return {
        provider: "openai-compatible",
        apiBase: "",
        apiKey: "",
        model: "",
        temperature: "0.3",
        enabled: "no" as const,
      };
    // 脱敏回显 apiKey
    return { ...s, apiKey: s.apiKey ? "••••••" + s.apiKey.slice(-4) : "" };
  }),

  llmSet: publicQuery
    .input(
      authed.extend({
        provider: z.string().max(64).optional(),
        apiBase: z.string().max(512).optional(),
        apiKey: z.string().max(512).optional(),
        model: z.string().max(128).optional(),
        temperature: z.string().max(16).optional(),
        enabled: z.enum(["yes", "no"]).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      await assertAdminToken(input.token);
      const { token: _t, ...data } = input;
      // 传占位符则不更新 key
      if (data.apiKey && data.apiKey.startsWith("••••")) delete data.apiKey;
      await upsertLlmSettings(data);
    }),

  llmTest: publicQuery.input(authed).mutation(async ({ input }) => {
    await assertAdminToken(input.token);
    let error: string | undefined;
    const answer = await callLlm("用一句话介绍李泽延", "", (m) => (error = m));
    return { ok: answer !== null, answer, error };
  }),
});
