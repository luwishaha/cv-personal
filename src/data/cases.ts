/* Case 内容严格取自李泽延提供的四张页面截图，本站仅负责 UI 与交互呈现 */

export interface RunCard {
  label: string;
  status: string;
  main?: string;
  mainSub?: string;
  roles?: string[];
  rows: [string, string][];
  foot?: string;
  cta: string;
}

export interface CaseData {
  id: string;
  no: string;
  company: string;
  headerTag: string; // 头部 CASE 行（取自截图）
  title: string[]; // 主标题按截图分行
  subtitle: string;
  caps?: string;
  runCard?: RunCard;
  metrics: [string, string, string?][]; // 值 / 标签 / 副标签
  s1Label: string;
  s1Title: string;
  pains: [string, string][] | string[]; // 两行文 或 单行文
  goal: string;
}

export const cases: CaseData[] = [
  {
    id: "zhipu",
    no: "01",
    company: "智谱 AI",
    headerTag: "CASE 01 · ZHIPU AI · 2026",
    title: ["让模型评测，", "从一次任务变成持续能力。"],
    subtitle: "统一模型接入、自动评测与回归分析，支撑模型选型与上线验收。",
    caps: "AI 产品设计 · 评测策略 · 端到端落地",
    runCard: {
      label: "LLM EVALUATION RUN",
      status: "已完成",
      main: "8 个模型完成横向评测",
      mainSub: "结果已汇总，可用于选型、回归与验收。",
      rows: [
        ["评测数据", "150+ 样本"],
        ["场景覆盖", "PPT · 视觉理解 · Excel"],
        ["输出结果", "模型对比与决策建议"],
      ],
      cta: "查看结果 →",
    },
    metrics: [
      ["8", "个模型"],
      ["150+", "评测样本"],
      ["3", "类业务场景"],
    ],
    s1Label: "01 / 背景",
    s1Title: "每次模型更新，评测都要从零开始",
    pains: [
      ["接口各异，", "重复适配"],
      ["脚本分散，", "难以复现"],
      ["结果割裂，", "难以决策"],
    ],
    goal: "目标：把一次性评测任务，沉淀为可复用的产品能力。",
  },
  {
    id: "oppo",
    no: "02",
    company: "OPPO",
    headerTag: "CASE 02 · OPPO · 2025-2026",
    title: ["让双周版本下的", "2000+ 回归用例，", "不再只靠人工。"],
    subtitle: "基于 Host Agent × App Agent 的专业看图软件自动化测试系统。",
    caps: "需求对接 · Agent 架构 · 领域模型优化 · 端到端落地",
    runCard: {
      label: "AUTOMATION RUN",
      status: "已完成",
      main: "回归任务执行完成",
      mainSub: "执行轨迹与校验结果已生成。",
      rows: [
        ["执行对象", "专业看图软件"],
        ["执行路径", "Skill + VLM"],
        ["结果状态", "校验通过"],
      ],
      cta: "查看执行轨迹 →",
    },
    metrics: [
      ["120+", "自动化用例"],
      ["87%", "端到端完成率"],
      ["12s → 6s", "单用例耗时"],
    ],
    s1Label: "01 / 为什么要做",
    s1Title: "版本两周一更，测试压力持续堆积",
    pains: [
      ["2000+ 用例", "需要重复回归"],
      ["专业功能多，", "操作链路长"],
      ["控件密集，", "视觉定位不稳定"],
    ],
    goal: "目标不是替代测试人员，而是接管高频、稳定、可重复的操作。",
  },
  {
    id: "tcl",
    no: "03",
    company: "TCL",
    headerTag: "CASE 03 / TCL TRADE POLICY AGENT / 2025",
    title: ["让关税变化，及时转化为库存动作"],
    subtitle: "自动监控贸易政策、量化 SKU × 国家影响，并输出可追溯证据与预警。",
    metrics: [
      ["3", "个目标市场"],
      ["≥90%", "告警精准率"],
      ["SKU × 国家", "影响粒度"],
    ],
    s1Label: "01 / 为什么要做",
    s1Title: "政策变化很快，但库存决策不能慢",
    pains: [
      ["政策分散，", "人工监控滞后"],
      ["海外出货量大，", "响应窗口短"],
      ["政策文本难以", "直接量化影响"],
    ],
    goal: "把政策新闻，转化为可执行的成本与库存信号",
  },
  {
    id: "hospital",
    no: "04",
    company: "三甲医院",
    headerTag: "CASE 04 · HOSPITAL MULTI-AGENT · 2025",
    title: ["让不同医学角色先讨论，", "再给出可追溯的编码建议。"],
    subtitle:
      "面向甲乳病案主诊断辅助编码，将临床、病理、编码规则与历史知识组织成可解释的多轮协作流程。",
    caps: "Agent 架构 · 业务规则转译 · 评测设计 · 逻辑链优化",
    runCard: {
      label: "CASE REVIEW / 病例协作评审",
      status: "共识形成中",
      roles: ["临床专家", "病理专家", "专科编码员", "规则分析师"],
      rows: [
        ["临床证据", "已提取"],
        ["病理证据", "已核对"],
        ["编码规则", "已匹配"],
        ["高频异常", "已检查"],
      ],
      foot: "辅助编码建议｜证据链已生成 · ● 可疑点已标记",
      cta: "查看推理依据 →",
    },
    metrics: [
      ["4", "个专家 Agent"],
      ["+13%", "准确率", "相较多基线模型平均表现"],
      ["+7%", "召回率", "相较多基线模型平均表现"],
    ],
    s1Label: "01 / 为什么单模型不够",
    s1Title: "病案编码，不只是一次分类预测",
    pains: [
      ["信息分散在", "多类病历记录"],
      ["临床语言与编码口径", "存在语义差"],
      ["冲突病例依赖", "编码员反复核实"],
    ],
    goal: "把隐性的专家判断过程，转化为可执行、可复盘的协作流程。",
  },
];
