export interface CaseData {
  id: string;
  no: string;
  company: string;
  period: string;
  title: [string, string];
  subtitle: string;
  caps: string;
  runCard: {
    label: string;
    status: string;
    main: string;
    mainSub: string;
    rows: [string, string][];
    cta: string;
  };
  metrics: [string, string][];
  painTitle: string;
  pains: [string, string][];
  goal: string;
  systemLabel: string;
  systemTitle: string;
  resultText: string;
}

export const cases: CaseData[] = [
  {
    id: "zhipu",
    no: "01",
    company: "智谱 AI · MaaS 平台",
    period: "2026",
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
    painTitle: "每次模型更新，评测都要从零开始",
    pains: [
      ["接口各异，", "重复适配"],
      ["脚本分散，", "难以复现"],
      ["结果割裂，", "难以决策"],
    ],
    goal: "目标：把一次性评测任务，沉淀为可复用的产品能力。",
    systemLabel: "02 / 评测系统",
    systemTitle: "从业务问题，到产品决策的自动化闭环",
    resultText:
      "让评测结果真正进入产品决策：模型选型 8 模型横向对比报告 · 版本回归上线前自动复测 · 上线验收按业务场景达标判定",
  },
  {
    id: "oppo",
    no: "02",
    company: "OPPO · 硬件工程",
    period: "2025—2026",
    title: ["让 AI 像人一样", "操作手机应用。"],
    subtitle: "GUI 自动化测试 Agent：看懂界面、规划步骤、执行并自我校验。",
    caps: "Agent 架构 · 双路径执行 · 领域优化",
    runCard: {
      label: "AUTOMATION RUN",
      status: "运行中",
      main: "专业看图软件 · 自动化执行中",
      mainSub: "Host 拆解任务，App 逐步执行并校验。",
      rows: [
        ["执行对象", "专业看图软件"],
        ["执行路径", "Skill + VLM"],
        ["状态校验", "逐步校验 · 失败重规划"],
      ],
      cta: "查看执行轨迹 →",
    },
    metrics: [
      ["120+", "自动化用例"],
      ["35%→87%", "任务通过率"],
      ["12s→6s", "单步耗时"],
    ],
    painTitle: "人工测试的成本，已经撑不起迭代速度",
    pains: [
      ["2000+ 条用例，", "回归全靠人力"],
      ["操作链路长，", "一步错步步错"],
      ["控件密集，", "定位不稳定"],
    ],
    goal: "目标不是替代测试人员，而是把人从重复执行中解放出来。",
    systemLabel: "02 / 系统架构",
    systemTitle: "Host 控制面 + App 执行面，双 Agent 协同",
    resultText:
      "04 / 结果：120+ 用例接入自动化，回归人力显著释放 · 35% → 87% · 12s → 6s",
  },
  {
    id: "tcl",
    no: "03",
    company: "TCL · 供应链战略部",
    period: "2025",
    title: ["把关税政策的变化，", "变成可计算的商业决策。"],
    subtitle: "关税政策情报 Agent：当日抓取、量化影响、直接给出业务动作建议。",
    caps: "情报系统 · 影响量化 · 数据可信度治理",
    runCard: {
      label: "POLICY RADAR",
      status: "监控中",
      main: "白名单来源 · 当日政策监控中",
      mainSub: "政策解析与影响计算自动完成。",
      rows: [
        ["监控来源", "海关 · 政府 · 税务"],
        ["影响维度", "政策 × SKU × 国家"],
        ["业务输出", "影响评估与预警建议"],
      ],
      cta: "查看预警 →",
    },
    metrics: [
      ["当日", "政策情报时效"],
      ["SKU 级", "影响量化粒度"],
      ["V1→V2", "数据源策略迭代"],
    ],
    painTitle: "关税政策天天变，业务却总在事后才知道",
    pains: [
      ["政策来源分散，", "靠人肉盯梢"],
      ["响应窗口短，", "错过调整时机"],
      ["影响难量化，", "决策靠拍脑袋"],
    ],
    goal: "目标：政策当天看到、影响当天算清、动作当天给出。",
    systemLabel: "02 / 系统工作流",
    systemTitle: "POLICY → IMPACT → ACTION，三段式情报闭环",
    resultText:
      "04 / 输出：政策类型 · 影响范围 · 证据内容 · 业务输出 → 政策变化 → 影响价值 → 库存与出货调整",
  },
  {
    id: "hospital",
    no: "04",
    company: "三甲医院 · 南山区人民医院",
    period: "2025",
    title: ["让多个 AI 专家", "坐下来讨论一份病案。"],
    subtitle: "多 Agent 病案编码系统：专家讨论、证据注入、规则校验，输出可溯源的辅助编码。",
    caps: "多 Agent 协同 · 证据链 · 医疗合规",
    runCard: {
      label: "CASE REVIEW",
      status: "已完成",
      main: "4 位专家 Agent 完成讨论",
      mainSub: "主治 / 检验 / 影像 / 药学 · 共识达成",
      rows: [
        ["证据核对", "临床 · 病理 · 规则 · 异常"],
        ["输出", "辅助编码建议"],
        ["溯源", "证据链已生成 · 可疑点已标记"],
      ],
      cta: "查看推理依据 →",
    },
    metrics: [
      ["4", "个专家 Agent"],
      ["+13%", "编码准确率"],
      ["+7%", "编码召回率"],
    ],
    painTitle: "病案编码，是医院里最磨人的「证据拼图」",
    pains: [
      ["病历信息分散，", "跨科室难整合"],
      ["临床描述与编码", "存在语义差"],
      ["冲突病例，", "反复人工核实"],
    ],
    goal: "目标：每个编码建议，都能追溯到具体的病历证据。",
    systemLabel: "02 / 多 Agent 讨论流水线",
    systemTitle: "共识不够就回去再讨论，直到判断可信",
    resultText:
      "04 / 结果：准确率 +13%、召回率 +7%（较最佳单模型 +6%/+3%）· 真实场景 → 失败模板 → 针对性评测 → 机制迭代",
  },
];
