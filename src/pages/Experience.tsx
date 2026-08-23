import { useEffect, useRef, useState } from "react";
import { Reveal, SiteNav } from "@/components/common";

const TIMELINE = [
  {
    time: "2026.05 — 08",
    org: "智谱华章 · MaaS 平台",
    role: "AI 应用实习生",
    desc: "独立设计统一模型评测平台，支撑 AI-PPT 选型、回归与上线验收",
    hot: true,
  },
  {
    time: "2025.11 — 2026.04",
    org: "OPPO · 硬件工程",
    role: "AI 算法实习生",
    desc: "主导 VLM+Skill 方案选型，GUI 回归测试通过率 35% → 87%",
  },
  {
    time: "2025.08 — 10",
    org: "深圳市南山区人民医院",
    role: "Agent 开发实习生",
    desc: "设计 4-Agent 辩论架构，做可解释、可复核的临床编码建议",
  },
  {
    time: "2025.04 — 08",
    org: "TCL · 供应链战略部",
    role: "AI 算法实习生",
    desc: "时序预测工具 + 贸易政策 Agent，告警精准率 ≥90%",
  },
  {
    time: "2024.12 — 2025.05",
    org: "唯品会 · 总经办项目管理部",
    role: "供应链管理实习生",
    desc: "残损与赔付数据挖掘，累计预计挽损超 256 万元",
  },
];

export default function Experience() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [fill, setFill] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(Math.max((vh * 0.7 - r.top) / r.height, 0), 1);
      setFill(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F4EF]">
      <SiteNav active="experience" />
      <div className="glow glow-violet w-[600px] h-[400px] top-[-100px] right-[-100px] fixed" />

      <div className="max-w-[1440px] mx-auto px-10 pt-36 pb-24 grid grid-cols-12 gap-10">
        {/* 左：时间线 */}
        <div className="col-span-7">
          <Reveal>
            <div className="kicker">EXPERIENCE · 滚动时间线</div>
            <h1 className="font-display text-5xl mt-4 text-[#101A30]">在真实业务里做 AI</h1>
            <p className="font-mono2 text-[11px] tracking-widest text-[#9AA3B8] mt-3">
              交互 · 垂直滚动，进度线随滚动逐节点点亮
            </p>
          </Reveal>

          <div ref={trackRef} className="relative mt-14 pl-10">
            {/* 轨道与进度线 */}
            <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-[#E2DEF0]" />
            <div
              className="absolute left-[7px] top-2 w-[2px] bg-[#4A54E2] transition-[height] duration-150"
              style={{ height: `calc(${(fill * 100).toFixed(1)}% - 4px)` }}
            />
            <div className="space-y-14">
              {TIMELINE.map((t, i) => {
                const nodeOn = fill * TIMELINE.length > i + 0.15;
                return (
                  <Reveal key={t.org} delay={i * 80}>
                    <div className="relative">
                      <span
                        className={`absolute -left-10 top-1.5 w-4 h-4 rounded-full border-2 transition-all duration-500 ${
                          nodeOn
                            ? "bg-[#4A54E2] border-[#4A54E2] shadow-[0_0_16px_rgba(74,84,226,0.55)]"
                            : "bg-white border-[#CFC8E8]"
                        }`}
                      />
                      <div className="font-mono2 text-[12px] text-[#9AA3B8]">{t.time}</div>
                      <div className="text-[17px] font-bold text-[#101A30] mt-1.5">
                        {t.org}｜{t.role}
                      </div>
                      <p className="text-[14px] text-[#55607A] mt-1.5">{t.desc}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>

        {/* 右：教育与学生工作 */}
        <div className="col-span-5 space-y-10 pt-24">
          <Reveal>
            <div>
              <div className="font-mono2 text-[11px] tracking-[0.3em] text-[#4A54E2]">EDUCATION</div>
              <div className="mt-4 space-y-4">
                <div className="paper-card p-5">
                  <div className="text-[15px] font-bold text-[#101A30]">新加坡南洋理工大学 · 硕士</div>
                  <div className="text-[13px] text-[#55607A] mt-1">
                    计算机科学与技术（人工智能方向）
                    <span className="font-mono2 text-[11px] text-[#9AA3B8] ml-2">2026.07—2027.06</span>
                  </div>
                </div>
                <div className="paper-card p-5">
                  <div className="text-[15px] font-bold text-[#101A30]">广东工业大学 · 学士</div>
                  <div className="text-[13px] text-[#55607A] mt-1">
                    电子商务（大数据挖掘与分析方向）
                    <span className="font-mono2 text-[11px] text-[#9AA3B8] ml-2">2021.09—2025.07</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div>
              <div className="font-mono2 text-[11px] tracking-[0.3em] text-[#4A54E2]">
                STUDENT LEADERSHIP
              </div>
              <div className="mt-4 space-y-4">
                <div className="paper-card p-5">
                  <div className="text-[15px] font-bold text-[#101A30]">院团委 · 学生副书记</div>
                  <div className="font-mono2 text-[11px] text-[#9AA3B8] mt-0.5">
                    2021.09 — 2023.09 · 广东工业大学
                  </div>
                  <p className="text-[13px] text-[#55607A] mt-2">
                    50+ 志愿活动策划，累计服务 12000+ 人次
                  </p>
                </div>
                <div className="paper-card p-5">
                  <div className="text-[15px] font-bold text-[#101A30]">院辩论社 · 培训部副部长</div>
                  <div className="font-mono2 text-[11px] text-[#9AA3B8] mt-0.5">
                    2021.12 — 2023.06 · 广东工业大学
                  </div>
                  <p className="text-[13px] text-[#55607A] mt-2">
                    9 期培训 + 2 场 200 人校级赛事
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div>
              <div className="font-mono2 text-[11px] tracking-[0.3em] text-[#4A54E2]">HONORS · STACK</div>
              <div className="mt-4 text-[13px] text-[#55607A] space-y-1.5">
                <p>华为杯研究生数学建模 · 国家二等奖</p>
                <p>三创赛 · 国家一等奖 / 省特等奖</p>
                <p>国家级大创 · 一等奖学金（2%）</p>
              </div>
              <div className="font-mono2 text-[12px] text-[#9AA3B8] mt-5">
                Python · SQL · LangGraph · FastAPI
                <br />
                VLM 微调 · RAG · LightGBM · IELTS 6.5
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <footer className="border-t border-[#E2DEF0] py-8">
        <div className="max-w-[1440px] mx-auto px-10 flex justify-between font-mono2 text-[12px] text-[#9AA3B8]">
          <span>© 2026 LI ZEYAN</span>
          <span>SCROLL-LINKED TIMELINE</span>
        </div>
      </footer>
    </div>
  );
}
