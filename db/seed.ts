import { knowledgeItems } from "@db/schema";
import { getDb } from "../api/queries/connection";

const items = [
  {
    title: "CASE 01 · 智谱评测平台",
    category: "CASE",
    keywords: "智谱,评测,模型评测,MaaS,选型,回归,验收,eval",
    content:
      "在智谱 MaaS 平台独立设计统一模型评测平台：统一模型接入、自动评测与回归分析，8 个模型横向评测、150+ 评测样本，覆盖 PPT 生成、视觉理解、Excel 三类业务场景。通过对照实验（同一模型×同一样本×相邻时间窗口，Gateway E2E − Direct E2E = 网关净开销）量化网关开销，输出模型对比与决策建议，把一次性评测任务沉淀为可持续复用的产品能力，支撑模型选型、版本回归与上线验收。",
  },
  {
    title: "CASE 02 · OPPO GUI 自动化",
    category: "CASE",
    keywords: "OPPO,GUI,自动化,测试,Agent,Skill,VLM,看图软件",
    content:
      "在 OPPO 主导 GUI 自动化测试 Agent 的 VLM+Skill 方案选型：Host Agent 控制面（任务拆解、应用生命周期、调度重试、状态汇总）+ App Agent 执行面（观察界面→规划步骤→执行动作→校验结果，未通过则重新规划）。设计原则：稳定步骤优先走 Skill，无 Skill 时回退 VLM 视觉定位。通过沉淀领域 Skill 库、注入领域知识、状态校验兜底，把通用 Agent 改造成领域专家：120+ 用例接入自动化，任务通过率 35%→87%，单步耗时 12s→6s。目标不是替代测试人员，而是把人从重复执行中解放出来。",
  },
  {
    title: "CASE 03 · TCL 关税政策 Agent",
    category: "CASE",
    keywords: "TCL,关税,政策,情报,供应链,白名单,数据源",
    content:
      "在 TCL 供应链战略部做关税政策情报 Agent：POLICY→IMPACT→ACTION 三段式闭环——白名单来源当日抓取、政策条文自动解析结构化，按 政策变更×SKU×国家×出货量 算出单位到岸成本变化，输出证据与预警并给出库存与出货调整建议。关键迭代是数据可信度治理：从 V1 全网抓取（噪声高）升级到 V2 白名单优先（海关与政府官网、税务与贸易机构、权威贸易媒体），来源分级+交叉验证，可信度优先于覆盖率。",
  },
  {
    title: "CASE 04 · 医院多 Agent 病案编码",
    category: "CASE",
    keywords: "医院,病案,编码,多Agent,辩论,Moderator,证据链",
    content:
      "在南山区人民医院设计 4 专家 Agent 病案编码系统：病案输入→证据增强→专家讨论（主治/检验/影像/药学）→Moderator 汇总→Decision Maker 输出辅助编码；共识度低或存在可疑点时触发定向讨论回流环，更新判断。三大机制：角色专业化、证据路径注入（结论可回溯病历原文）、规则可执行化（编码规则与高频异常库变成机器校验）。结果：编码准确率 +13%、召回率 +7%，较最佳单模型 +6%/+3%。迭代方法：真实场景→失败模板→针对性评测→机制迭代。",
  },
  {
    title: "经历 · 教育背景",
    category: "经历",
    keywords: "教育,学历,南洋理工,NTU,广东工业大学,硕士,学士",
    content:
      "新加坡南洋理工大学 计算机科学与技术（人工智能方向）硕士，2026.07—2027.06；广东工业大学 电子商务（大数据挖掘与分析方向）学士，2021.09—2025.07。",
  },
  {
    title: "经历 · 学生工作",
    category: "经历",
    keywords: "学生工作,团委,辩论社,副书记,志愿,领导力",
    content:
      "院团委学生副书记（2021.09—2023.09）：53 次志愿活动策划、11 次科普讲座、5 次献血活动，累计服务 12000+ 人次，7 篇千阅推文，带领 15+ 人团队。院辩论社培训部副部长（2021.12—2023.06）：组织 2 场 200 人校级辩论赛、9 次训练课程、10 场模拟辩论。",
  },
  {
    title: "技能与奖项",
    category: "技能",
    keywords: "技能,Python,SQL,LangGraph,RAG,奖项,华为杯,IELTS",
    content:
      "技术栈：Python、SQL、LangGraph、FastAPI、VLM 微调、RAG、LightGBM；英语 IELTS 6.5。奖项：华为杯研究生数学建模国家二等奖、三创赛国家一等奖/省特等奖、国家级大创、一等奖学金（2%）。",
  },
  {
    title: "求职意向",
    category: "通用",
    keywords: "求职,秋招,岗位,意向,AI产品经理,产品经理",
    content:
      "2027 届秋招，目标岗位 AI 产品经理。优势：技术背景（NTU 计算机硕士）+ 5 段一线 AI 实习 + 从 0 到 1 的产品落地经验，擅长把 Agent 能力做成可验证、可迭代的产品系统。",
  },
];

export async function seed() {
  const db = getDb();
  const existing = await db.select().from(knowledgeItems).limit(1);
  if (existing.length > 0) {
    console.log("knowledge base already seeded, skip");
    return;
  }
  for (const it of items) {
    await db.insert(knowledgeItems).values(it);
  }
  console.log(`seeded ${items.length} knowledge items`);
}

seed().then(() => process.exit(0));
