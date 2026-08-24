import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Reveal, SiteNav } from "@/components/common";

type Frame = "left" | "center" | "right";
const FRAME_SRC: Record<Frame, string> = {
  left: "/frames/point-left.png",
  center: "/frames/point-center.png",
  right: "/frames/point-right.png",
};

export default function Home() {
  const navigate = useNavigate();
  const [frame, setFrame] = useState<Frame>("center");

  // 预加载帧，保证指向切换不闪烁
  useEffect(() => {
    Object.values(FRAME_SRC).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

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
        primary ? "indigo-card" : "paper-card hover:border-[#4A54E2]/60"
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
    <div className="min-h-screen bg-white overflow-hidden home-dots">
      <SiteNav active="home" />

      {/* ============ HERO ============ */}
      <section className="relative min-h-screen pt-16">
        <div className="glow glow-violet w-[640px] h-[400px] -top-40 right-[-100px]" />
        <div className="glow glow-indigo w-[480px] h-[360px] top-[300px] left-[36%]" />

        <div className="relative max-w-[1440px] mx-auto px-10 grid grid-cols-12 gap-6">
          {/* 左侧主张 */}
          <div className="col-span-6 pt-[14vh]">
            <Reveal>
              <div className="kicker">LI ZEYAN · AI PRODUCT MANAGER · 2027</div>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="font-display text-[68px] leading-[1.22] mt-8 text-[#101A30]">
                把复杂留给系统，
                <br />
                把简单留给用户。
              </h1>
            </Reveal>
            <Reveal delay={260}>
              <p className="text-[16px] text-[#55607A] leading-[1.95] mt-8 max-w-[520px]">
                我是李泽延，南洋理工大学计算机硕士（人工智能方向）。从模型评测、GUI
                自动化到多 Agent
                决策系统——我关心的始终是：模型能力如何真正落成业务结果。
              </p>
            </Reveal>
            <Reveal delay={380}>
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
              <div className="mt-16">
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
          <div className="col-span-6 relative pt-[9vh]">
            {/* 层板 */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[29vh] w-[400px] h-[400px] rounded-3xl bg-[#E3E0FF] rotate-6" />
            <div className="absolute left-1/2 -translate-x-1/2 top-[28vh] w-[400px] h-[400px] rounded-3xl bg-white border border-[#E2DEF0] -rotate-3 shadow-[0_40px_80px_-24px_rgba(74,84,226,0.18)]" />

            {/* 人物三帧叠加：悬停入口时指向对应方向 */}
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
                  onClick={() => navigate(`/cases/${["zhipu", "oppo", "tcl", "hospital"][i]}`)}
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
