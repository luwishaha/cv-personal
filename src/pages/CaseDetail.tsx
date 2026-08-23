import type React from "react";
import { useParams, useNavigate } from "react-router";
import { Reveal, SiteNav } from "@/components/common";
import { cases } from "@/data/cases";

/* ---------- 各 case 的系统图 ---------- */

function FlowNodes({ nodes, highlightLast = true, highlight = [] as number[] }: { nodes: string[]; highlightLast?: boolean; highlight?: number[] }) {
  return (
    <div className="paper-card p-8">
      <div className="flex items-center gap-3 flex-wrap">
        {nodes.map((n, i) => (
          <div key={n} className="flex items-center gap-3">
            <div
              className={`px-5 py-4 rounded-xl text-center min-w-[110px] ${
                highlightLast && i === nodes.length - 1
                  ? "bg-[#4A54E2] text-white shadow-[0_16px_32px_-10px_rgba(74,84,226,0.5)]"
                  : highlight.includes(i)
                    ? "bg-[#E3E0FF] border border-[#CFC9FF] text-[#101A30]"
                    : "bg-[#F5F4EF] border border-[#E2DEF0] text-[#101A30]"
              }`}
            >
              <div className="font-mono2 text-[10px] opacity-60">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="text-[13px] font-bold mt-0.5">{n}</div>
            </div>
            {i < nodes.length - 1 && (
              <span className="text-[#4A54E2] text-lg">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ZhipuSystem() {
  return (
    <>
      <FlowNodes
        nodes={["业务需求", "评测目标", "评测集", "自动评测", "结果对比", "产品决策"]}
        highlight={[3]}
      />
      <p className="text-center font-mono2 text-[11px] text-[#9AA3B8] mt-3">
        04 自动评测 · Direct / Gateway 双通道
      </p>
      <div className="mt-6 rounded-2xl bg-[#E3E0FF] px-8 py-5 text-center text-[14px] text-[#101A30]">
        对照实验：同一模型 × 同一样本 × 相邻时间窗口　｜　
        <strong className="text-[#4A54E2]">Gateway E2E − Direct E2E = 网关净开销</strong>
      </div>
    </>
  );
}

function OppoSystem() {
  return (
    <div className="paper-card p-8">
      <div className="grid grid-cols-12 gap-4 items-start">
        <div className="col-span-3 space-y-3">
          <div className="font-mono2 text-[10px] tracking-widest text-[#9AA3B8]">INPUT</div>
          {["界面截图", "UI 结构信息", "领域知识"].map((t) => (
            <div key={t} className="px-4 py-3 rounded-xl bg-[#F5F4EF] border border-[#E2DEF0] text-[13px] text-center">
              {t}
            </div>
          ))}
        </div>
        <div className="col-span-1 flex items-center justify-center pt-20 text-[#4A54E2] text-xl">→</div>
        <div className="col-span-4 space-y-3">
          <div className="rounded-xl bg-[#E3E0FF] border border-[#CFC9FF] p-4">
            <div className="font-mono2 text-[10px] tracking-widest text-[#4A54E2]">HOST AGENT · 控制面</div>
            <div className="text-[13px] mt-2 leading-relaxed">任务拆解 · 应用生命周期管理<br />调度与重试 · 状态汇总与上报</div>
          </div>
          <div className="rounded-xl bg-white border-2 border-[#4A54E2] p-4 shadow-[0_14px_28px_-10px_rgba(74,84,226,0.25)]">
            <div className="font-mono2 text-[10px] tracking-widest text-[#4A54E2]">APP AGENT · 执行面</div>
            <div className="text-[13px] mt-2">观察界面 → 规划步骤 → 执行动作 → 校验结果</div>
            <div className="font-mono2 text-[10px] text-[#9AA3B8] text-center mt-1.5">- - 未通过则重新规划，直到通过 - -</div>
            <div className="flex gap-2 mt-2.5">
              <span className="px-3 py-1 rounded-full bg-[#4A54E2] text-white text-[11px]">Skill 路径</span>
              <span className="px-3 py-1 rounded-full bg-[#E3E0FF] border border-[#CFC9FF] text-[#4A54E2] text-[11px]">VLM 路径</span>
            </div>
          </div>
        </div>
        <div className="col-span-1 flex items-center justify-center pt-20 text-[#4A54E2] text-xl">→</div>
        <div className="col-span-3 space-y-3">
          <div className="font-mono2 text-[10px] tracking-widest text-[#9AA3B8]">OUTPUT</div>
          {["目标应用 · 任务达成", "状态校验记录", "日志与测试报告"].map((t) => (
            <div key={t} className="px-4 py-3 rounded-xl bg-[#F5F4EF] border border-[#E2DEF0] text-[13px] text-center">
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TclSystem() {
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div className="indigo-card p-6">
          <div className="font-mono2 text-[10px] tracking-widest text-[#C7CBFF]">POLICY · 政策感知</div>
          <div className="text-[13px] mt-3 leading-relaxed">白名单来源当日抓取，<br />政策条文自动解析、结构化。</div>
        </div>
        <div className="paper-card p-6">
          <div className="font-mono2 text-[10px] tracking-widest text-[#9AA3B8]">IMPACT · 影响计算</div>
          <div className="text-[13px] mt-3 leading-relaxed text-[#55607A]">政策变更 × SKU × 国家 × 出货量，<br />算出单位到岸成本变化。</div>
        </div>
        <div className="paper-card p-6 !border-[#4A54E2] border-2">
          <div className="font-mono2 text-[10px] tracking-widest text-[#4A54E2]">ACTION · 业务动作</div>
          <div className="text-[13px] mt-3 leading-relaxed">输出证据与预警，<br />直接给出业务调整建议。</div>
        </div>
      </div>
      <div className="mt-6">
        <FlowNodes nodes={["可信来源", "当日抓取", "政策解析", "影响计算", "证据与预警", "业务动作"]} />
      </div>
      <div className="mt-6 rounded-2xl bg-[#E3E0FF] px-8 py-4 text-center font-mono2 text-[13px] text-[#101A30]">
        政策变更 × SKU × 国家 × 出货量 → 单位到岸成本变化 → 影响价值
      </div>
    </>
  );
}

function HospitalSystem() {
  return (
    <>
      <FlowNodes
        nodes={["病案输入", "证据增强", "专家讨论", "Moderator", "Decision Maker", "辅助编码结果"]}
        highlight={[1, 2]}
      />
      <div className="relative mt-2 mx-16 border-b-2 border-l-2 border-r-2 border-dashed border-[#D97706] rounded-b-2xl h-14">
        <div className="absolute -top-2 left-0 w-0 h-0 border-l-[7px] border-r-[7px] border-b-[10px] border-l-transparent border-r-transparent border-b-[#D97706]" />
        <div className="absolute inset-0 flex items-center justify-center text-[12px] text-[#D97706]">
          ⚠ 共识度低 / 存在可疑点 → 定向讨论，更新判断
        </div>
      </div>
    </>
  );
}

/* ---------- 各 case 的第三段（机制/难点/迭代） ---------- */

function ZhipuMech() {
  const rows = [
    ["PPT 生成", "内容完整 / 版式合理 / 主题一致"],
    ["视觉理解", "元素识别 / 关系判断 / 信息提取"],
    ["Excel 能力", "公式正确 / 数据处理 / 图表生成"],
  ];
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="paper-card p-7">
        <div className="font-mono2 text-[10px] tracking-widest text-[#9AA3B8]">EVALUATION TARGET BUILDER</div>
        <div className="space-y-3 mt-4">
          {rows.map(([a, b]) => (
            <div key={a} className="px-4 py-3 rounded-xl bg-[#F5F4EF] text-[13px]">
              <strong>{a}</strong>
              <span className="text-[#55607A]">　·　{b}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="paper-card p-7">
        <div className="font-mono2 text-[10px] tracking-widest text-[#4A54E2]">DECISION OUTPUT</div>
        <div className="space-y-3 mt-4 text-[14px]">
          <p>▸ 模型选型：8 模型横向对比报告</p>
          <p>▸ 版本回归：新版本上线前自动复测</p>
          <p>▸ 上线验收：按业务场景达标判定</p>
        </div>
        <div className="font-mono2 text-[11px] text-[#4A54E2] mt-5">业务问题 → 可执行评测 → 产品决策</div>
      </div>
    </div>
  );
}

function OppoMech() {
  return (
    <div className="grid grid-cols-[1fr_auto_1.2fr_auto_1fr] gap-3 items-stretch">
      <div className="paper-card p-6 !border-[#F0D9B5]">
        <div className="font-mono2 text-[10px] tracking-widest text-[#D97706]">BEFORE</div>
        <p className="text-[13px] text-[#55607A] mt-3 leading-relaxed">
          通用 VLM 在专业软件上识别不准、操作漂移，通过率只有 35%。
        </p>
      </div>
      <div className="self-center text-[#4A54E2] text-xl">→</div>
      <div className="rounded-2xl bg-[#E3E0FF] border border-[#CFC9FF] p-6">
        <div className="font-mono2 text-[10px] tracking-widest text-[#4A54E2]">DOMAIN OPTIMIZATION</div>
        <div className="text-[13px] mt-3 space-y-1.5">
          <p>▸ 沉淀领域 Skill 库，稳定操作脚本化</p>
          <p>▸ 注入领域知识，约束规划空间</p>
          <p>▸ 状态校验兜底，失败自动重规划</p>
        </div>
      </div>
      <div className="self-center text-[#4A54E2] text-xl">→</div>
      <div className="paper-card p-6">
        <div className="font-mono2 text-[10px] tracking-widest text-[#9AA3B8]">AFTER</div>
        <div className="mt-3 space-y-2">
          <p><span className="font-mono2 text-2xl font-bold text-[#4A54E2]">87%</span><span className="text-[13px] text-[#55607A]">　任务通过率</span></p>
          <p><span className="font-mono2 text-2xl font-bold text-[#4A54E2]">6s</span><span className="text-[13px] text-[#55607A]">　单步耗时，下降 50%</span></p>
        </div>
      </div>
    </div>
  );
}

function TclMech() {
  return (
    <div className="grid grid-cols-[1fr_auto_1.5fr] gap-4 items-stretch">
      <div className="paper-card p-6 !border-[#F0D9B5]">
        <div className="font-mono2 text-[10px] tracking-widest text-[#D97706]">V1 · 全网抓取</div>
        <p className="text-[13px] text-[#55607A] mt-3 leading-relaxed">
          信息量大但噪声高：来源可信度参差，误判风险直接进入业务决策。
        </p>
      </div>
      <div className="self-center text-[#4A54E2] text-xl">→</div>
      <div className="rounded-2xl bg-[#E3E0FF] border border-[#CFC9FF] p-6">
        <div className="font-mono2 text-[10px] tracking-widest text-[#4A54E2]">V2 · 白名单优先</div>
        <div className="text-[13px] mt-3 space-y-1.5">
          <p>▸ 海关与政府官网　▸ 税务与贸易机构　▸ 权威贸易媒体</p>
          <p>来源分级 + 交叉验证，可信度优先于覆盖率。</p>
        </div>
      </div>
    </div>
  );
}

function HospitalMech() {
  const mechs = [
    ["机制 1 · 角色专业化", "4 位专家各司其职，从各自视角提出证据与质疑，避免单一视角盲区。"],
    ["机制 2 · 证据路径注入", "讨论基于病历原文证据进行，结论可回溯到具体检查与记录。"],
    ["机制 3 · 规则可执行化", "编码规则与高频异常库变成可执行校验，机器先查一遍。"],
  ];
  return (
    <div className="grid grid-cols-3 gap-4">
      {mechs.map(([t, d]) => (
        <div key={t} className="paper-card p-6">
          <div className="font-mono2 text-[10px] tracking-widest text-[#4A54E2]">{t}</div>
          <p className="text-[13px] text-[#55607A] mt-3 leading-relaxed">{d}</p>
        </div>
      ))}
    </div>
  );
}

const SYSTEMS: Record<string, React.ComponentType> = {
  zhipu: ZhipuSystem,
  oppo: OppoSystem,
  tcl: TclSystem,
  hospital: HospitalSystem,
};
const MECHS: Record<string, React.ComponentType> = {
  zhipu: ZhipuMech,
  oppo: OppoMech,
  tcl: TclMech,
  hospital: HospitalMech,
};
const MECH_META: Record<string, [string, string]> = {
  zhipu: ["03 / 自定义评测目标", "按业务场景，拼装评测目标"],
  oppo: ["03 / 难点与领域优化", "通用 Agent 不好用，就把它改造成领域专家"],
  tcl: ["03 / 关键迭代 · 数据可信度治理", "从「全网抓取」到「白名单优先」"],
  hospital: ["03 / 关键机制", "让讨论真正产生质量，而不是形式"],
};

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const c = cases.find((x) => x.id === id);
  if (!c)
    return (
      <div className="min-h-screen bg-[#F5F4EF]">
        <SiteNav active="cases" />
        <div className="pt-40 text-center text-[#55607A]">CASE 不存在</div>
      </div>
    );
  const System = SYSTEMS[c.id];
  const Mech = MECHS[c.id];
  const idx = cases.findIndex((x) => x.id === c.id);
  const next = cases[(idx + 1) % cases.length];

  return (
    <div className="min-h-screen bg-[#F5F4EF]">
      <SiteNav active="cases" />

      {/* 头部 + 悬浮运行卡 */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="glow glow-violet w-[700px] h-[420px] -top-40 right-[-100px]" />
        <div className="max-w-[1440px] mx-auto px-10 grid grid-cols-12 gap-8">
          <div className="col-span-7">
            <Reveal>
              <div className="kicker">CASE {c.no} · {c.company} · {c.period}</div>
              <h1 className="font-display text-[52px] leading-[1.3] mt-5 text-[#101A30]">
                {c.title[0]}
                <br />
                {c.title[1]}
              </h1>
              <p className="text-[15px] text-[#55607A] leading-[1.8] mt-5 max-w-[560px]">
                {c.subtitle}
              </p>
              <div className="font-mono2 text-[13px] text-[#4A54E2] mt-4">{c.caps}</div>
            </Reveal>
          </div>
          <div className="col-span-5 relative">
            <Reveal delay={150}>
              <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-2xl bg-[#E3E0FF]" />
              <div className="relative paper-card p-7 !shadow-[0_40px_80px_-24px_rgba(74,84,226,0.22)]">
                <div className="flex items-center justify-between">
                  <span className="font-mono2 text-[11px] tracking-widest text-[#9AA3B8]">
                    {c.runCard.label}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#E3E0FF] text-[#4A54E2] text-[11px]">
                    {c.runCard.status}
                  </span>
                </div>
                <div className="mt-4 pl-4 border-l-4 border-[#4A54E2]">
                  <p className="text-[15px] font-bold text-[#101A30]">● {c.runCard.main}</p>
                  <p className="text-[12px] text-[#55607A] mt-1">{c.runCard.mainSub}</p>
                </div>
                <div className="mt-5 space-y-2.5">
                  {c.runCard.rows.map(([k, v]) => (
                    <div key={k} className="flex justify-between text-[12px]">
                      <span className="text-[#9AA3B8]">{k}</span>
                      <span className="font-mono2 text-[#101A30]">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="text-right text-[13px] text-[#4A54E2] mt-4">{c.runCard.cta}</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 指标条 */}
      <section className="border-t border-b border-[#E2DEF0] py-8">
        <div className="max-w-[1440px] mx-auto px-10 grid grid-cols-3">
          {c.metrics.map(([v, l]) => (
            <Reveal key={l}>
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono2 text-[32px] font-bold text-[#4A54E2]">{v}</span>
                <span className="text-[14px] text-[#55607A]">{l}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 01 背景 */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-10">
          <Reveal>
            <div className="kicker">01 / 背景</div>
            <h2 className="font-display text-4xl mt-4 text-[#101A30]">{c.painTitle}</h2>
          </Reveal>
          <div className="grid grid-cols-3 gap-5 mt-10">
            {c.pains.map(([a, b], i) => (
              <Reveal key={a} delay={i * 120}>
                <div className="paper-card p-7">
                  <div className="font-mono2 text-[11px] text-[#9AA3B8]">PAIN {i + 1}</div>
                  <p className="text-[16px] font-bold text-[#101A30] mt-3 leading-relaxed">
                    {a}
                    <br />
                    {b}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div className="paper-card mt-8 py-5 text-center text-[16px] text-[#4A54E2]">
              {c.goal}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 02 系统 */}
      <section className="py-20 border-t border-[#E2DEF0]">
        <div className="max-w-[1440px] mx-auto px-10">
          <Reveal>
            <div className="kicker">{c.systemLabel}</div>
            <h2 className="font-display text-4xl mt-4 text-[#101A30]">{c.systemTitle}</h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="mt-10">
              <System />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 03 机制 */}
      <section className="py-20 border-t border-[#E2DEF0]">
        <div className="max-w-[1440px] mx-auto px-10">
          <Reveal>
            <div className="kicker">{MECH_META[c.id][0]}</div>
            <h2 className="font-display text-4xl mt-4 text-[#101A30]">{MECH_META[c.id][1]}</h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="mt-10">
              <Mech />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 04 结果 */}
      <section className="py-16 border-t border-[#E2DEF0]">
        <div className="max-w-[1440px] mx-auto px-10">
          <Reveal>
            <div className="paper-card py-6 px-10 text-center text-[15px] text-[#101A30]">
              {c.resultText}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 下一 case */}
      <section className="py-20 text-center border-t border-[#E2DEF0]">
        <div className="font-mono2 text-[12px] tracking-widest text-[#9AA3B8]">NEXT CASE</div>
        <button
          onClick={() => navigate(`/cases/${next.id}`)}
          className="font-display text-4xl text-[#101A30] mt-4 hover:text-[#4A54E2] transition-colors"
        >
          CASE {next.no} · {next.company} →
        </button>
      </section>
    </div>
  );
}
