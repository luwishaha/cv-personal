import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { PerspectiveFloor, Reveal, SiteNav } from "@/components/common";

type Frame = "left" | "center" | "right";
const FRAME_SRC: Record<Frame, string> = {
  left: "/frames/point-left.png",
  center: "/frames/point-center.png",
  right: "/frames/point-right.png",
};

const SPOT_FACTS = [
  { text: "5 段一线实习", x: 6, y: 12 },
  { text: "4 个上线级 CASE", x: 30, y: 30 },
  { text: "2 项国家级奖项", x: 52, y: 10 },
  { text: "LangGraph", x: 70, y: 26 },
  { text: "RAG · VLM 微调", x: 14, y: 44 },
  { text: "IELTS 6.5", x: 44, y: 52 },
  { text: "通过率 35%→87%", x: 62, y: 46 },
  { text: "+13% 编码准确率", x: 84, y: 56 },
  { text: "150+ 评测样本", x: 8, y: 68 },
  { text: "FastAPI · Python", x: 36, y: 74 },
  { text: "政策 × SKU × 国家", x: 66, y: 70 },
  { text: "2027 届秋招", x: 86, y: 16 },
  { text: "证据驱动", x: 24, y: 88 },
  { text: "12000+ 人次志愿服务", x: 56, y: 86 },
];

export default function Home() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState<Frame>("center");
  const [spotOn, setSpotOn] = useState(false);

  // 预加载帧
  useEffect(() => {
    Object.values(FRAME_SRC).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const onMove = (e: React.MouseEvent) => {
    const el = heroRef.current;
    const spot = spotRef.current;
    if (!el || !spot) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    spot.style.maskImage = `radial-gradient(260px circle at ${x}px ${y}px, black 0%, transparent 100%)`;
    spot.style.webkitMaskImage = `radial-gradient(260px circle at ${x}px ${y}px, black 0%, transparent 100%)`;
    if (!spotOn) setSpotOn(true);
  };

  const deskCard = (
    key: Frame,
    labelEn: string,
    labelZh: string,
    to: string,
    primary = false,
  ) => (
    <button
      key={key}
      onMouseEnter={() => setFrame(key)}
      onMouseLeave={() => setFrame("center")}
      onClick={() => navigate(to)}
      className={`group relative w-[168px] h-[120px] rounded-2xl text-left p-4 transition-all duration-500 ease-out hover:-translate-y-2 ${
        primary
          ? "indigo-card"
          : "paper-card hover:border-[#4A54E2]/60"
      }`}
    >
      <div
        className={`font-mono2 text-sm tracking-widest ${
          primary ? "text-white/90" : "text-[#4A54E2]"
        }`}
      >
        {labelEn}
      </div>
      <div
        className={`mt-1 text-lg font-bold ${
          primary ? "text-white" : "text-[#101A30]"
        }`}
      >
        {labelZh}
      </div>
      <div
        className={`absolute bottom-3 right-4 text-xl transition-transform duration-300 group-hover:translate-x-1 ${
          primary ? "text-white" : "text-[#4A54E2]"
        }`}
      >
        →
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F5F4EF] overflow-hidden">
      <SiteNav active="home" />

      {/* ============ HERO ============ */}
      <section
        ref={heroRef}
        onMouseMove={onMove}
        onMouseLeave={() => setSpotOn(false)}
        className="relative min-h-screen pt-16"
      >
        <PerspectiveFloor />
        <div className="glow glow-violet w-[700px] h-[420px] -top-40 right-[-120px]" />
        <div className="glow glow-indigo w-[520px] h-[380px] top-[280px] left-[38%]" />

        <div className="relative max-w-[1440px] mx-auto px-10 grid grid-cols-12 gap-6">
          {/* 左侧身份主张 */}
          <div className="col-span-6 pt-[15vh]">
            <Reveal>
              <div className="kicker">AI PRODUCT MANAGER · 2027 届秋招</div>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="font-display text-[104px] leading-[1.1] mt-6 text-[#101A30]">
                李泽延
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <div className="font-mono2 text-sm tracking-[0.4em] text-[#9AA3B8] mt-5">
                LI ZEYAN · NTU CS (AI TRACK) · SINGAPORE
              </div>
            </Reveal>
            <Reveal delay={300}>
              <p className="text-[17px] text-[#55607A] leading-[1.9] mt-8 max-w-[520px]">
                我设计会自我验证的 AI 系统——从模型评测、GUI
                自动化，到多 Agent 的高风险决策。
              </p>
            </Reveal>
            <Reveal delay={400}>
              <div className="flex items-center gap-4 mt-10">
                <button
                  onClick={() => navigate("/cases")}
                  className="px-7 h-[52px] rounded-full bg-[#4A54E2] text-white font-bold text-[15px] shadow-[0_20px_40px_-12px_rgba(74,84,226,0.5)] hover:shadow-[0_24px_48px_-10px_rgba(74,84,226,0.6)] hover:-translate-y-0.5 transition-all"
                >
                  进入 CASE →
                </button>
                <button
                  onClick={() => navigate("/askme")}
                  className="px-7 h-[52px] rounded-full bg-white border border-[#E2DEF0] text-[15px] text-[#101A30] hover:border-[#4A54E2] hover:text-[#4A54E2] transition-colors"
                >
                  ASK ME ✦
                </button>
              </div>
            </Reveal>
            <Reveal delay={500}>
              <div className="font-mono2 text-[13px] text-[#9AA3B8] mt-10 flex gap-8">
                <span><span className="text-[#4A54E2] font-bold">5</span> 段一线实习</span>
                <span><span className="text-[#4A54E2] font-bold">4</span> 个上线级 CASE</span>
                <span><span className="text-[#4A54E2] font-bold">2</span> 项国家级奖项</span>
              </div>
            </Reveal>
            <Reveal delay={600}>
              <div className="mt-14">
                <div className="font-mono2 text-[11px] tracking-[0.3em] text-[#4A54E2]">
                  EDUCATION
                </div>
                <div className="mt-3 space-y-2.5 text-[14px]">
                  <p className="text-[#101A30]">
                    <strong>新加坡南洋理工大学</strong>　计算机科学与技术（人工智能方向）硕士
                    <span className="font-mono2 text-xs text-[#9AA3B8] ml-3">
                      2026.07 — 2027.06
                    </span>
                  </p>
                  <p className="text-[#101A30]">
                    <strong>广东工业大学</strong>　电子商务（大数据挖掘与分析方向）学士
                    <span className="font-mono2 text-xs text-[#9AA3B8] ml-3">
                      2021.09 — 2025.07
                    </span>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* 右侧人物 + 操作台 */}
          <div className="col-span-6 relative pt-[10vh]">
            {/* 层板 */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[30vh] w-[400px] h-[400px] rounded-3xl bg-[#E3E0FF] rotate-6" />
            <div className="absolute left-1/2 -translate-x-1/2 top-[29vh] w-[400px] h-[400px] rounded-3xl bg-white border border-[#E2DEF0] -rotate-3 shadow-[0_40px_80px_-24px_rgba(74,84,226,0.18)]" />

            {/* 人物三帧叠加 */}
            <div className="relative w-[440px] h-[440px] mx-auto mt-[2vh]">
              {(["left", "center", "right"] as Frame[]).map((f) => (
                <div
                  key={f}
                  className="avatar-frame"
                  style={{ opacity: frame === f ? 1 : 0 }}
                >
                  <img src={FRAME_SRC[f]} alt="" draggable={false} />
                </div>
              ))}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[320px] h-10 rounded-[100%] bg-[#4A54E2]/15 blur-xl" />
            </div>

            {/* 操作台三卡 */}
            <div className="relative z-10 -mt-16 flex items-end justify-center gap-4">
              {deskCard("left", "WORK", "项目", "/cases", true)}
              {deskCard("center", "EXPERIENCE", "经历", "/experience")}
              {deskCard("right", "ASK", "问我", "/askme")}
            </div>

            <div className="font-mono2 text-[11px] tracking-[0.2em] text-[#9AA3B8] text-center mt-8">
              HOVER · 他会指向你悬停的入口
            </div>
          </div>
        </div>

        {/* spotlight 揭示层：鼠标滑到哪里，哪里就显示 */}
        <div
          ref={spotRef}
          className="spotlight-layer z-20"
          style={{
            opacity: spotOn ? 1 : 0,
            maskImage:
              "radial-gradient(260px circle at 50% 50%, black 0%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(260px circle at 50% 50%, black 0%, transparent 100%)",
          }}
        >
          {SPOT_FACTS.map((f) => (
            <span
              key={f.text}
              className="absolute font-mono2 text-[13px] text-[#4A54E2] whitespace-nowrap"
              style={{ left: `${f.x}%`, top: `${f.y}%` }}
            >
              {f.text}
            </span>
          ))}
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono2 text-[11px] tracking-[0.3em] text-[#9AA3B8]">
          SCROLL ↓
        </div>
      </section>

      {/* ============ 首页底部 CASE 预告 ============ */}
      <section className="relative py-28 border-t border-[#E2DEF0]">
        <div className="max-w-[1440px] mx-auto px-10">
          <Reveal>
            <div className="kicker">SELECTED CASES · 2024—2026</div>
            <h2 className="font-display text-5xl mt-4 text-[#101A30]">
              四个从 0 到 1 的 AI 产品决策
            </h2>
          </Reveal>
          <div className="grid grid-cols-4 gap-5 mt-12">
            {[
              ["01", "智谱 AI", "自动化模型评测平台", "8 模型 · 150+ 样本"],
              ["02", "OPPO", "Agent GUI 回归自动化", "35% → 87%"],
              ["03", "TCL", "关税政策情报 Agent", "当日 · SKU 级"],
              ["04", "三甲医院", "多 Agent 病案编码", "+13% / +7%"],
            ].map(([no, co, t, m], i) => (
              <Reveal key={no} delay={i * 120}>
                <button
                  onClick={() => navigate(`/cases/${["zhipu","oppo","tcl","hospital"][i]}`)}
                  className="paper-card w-full text-left p-6 hover:-translate-y-1.5 hover:border-[#4A54E2]/50 transition-all duration-300"
                >
                  <div className="font-mono2 text-[11px] text-[#9AA3B8] tracking-widest">
                    CASE {no} · {co}
                  </div>
                  <div className="text-[17px] font-bold text-[#101A30] mt-3 leading-snug">
                    {t}
                  </div>
                  <div className="font-mono2 text-[12px] text-[#4A54E2] mt-4">{m}</div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E2DEF0] py-8">
        <div className="max-w-[1440px] mx-auto px-10 flex justify-between font-mono2 text-[12px] text-[#9AA3B8]">
          <span>© 2026 LI ZEYAN · NTU CS (AI TRACK)</span>
          <span>DESIGNED & BUILT BY LZY</span>
        </div>
      </footer>
    </div>
  );
}
