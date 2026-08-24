import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { SiteNav } from "@/components/common";
import { cases } from "@/data/cases";

const TITLE_CHARS = "四个从0到1的AI产品决策".split("");

export default function Cases() {
  const navigate = useNavigate();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0..3

  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p = Math.min(Math.max(-r.top / total, 0), 1);
      setProgress(p * (cases.length - 1));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeIdx = Math.round(progress);

  return (
    <div className="bg-[#F5F4EF]">
      <SiteNav active="cases" />

      {/* 滚动驱动环形轮播 */}
      <div ref={wrapRef} style={{ height: "420vh" }}>
        <section className="sticky top-0 h-screen overflow-hidden pt-16">
          <div className="glow glow-violet w-[700px] h-[420px] -top-32 right-[-100px]" />

          {/* 操作提示：右上角 */}
          <div className="absolute top-24 right-10 z-20 inline-flex items-center gap-3 px-5 h-11 rounded-full bg-white border border-[#E2DEF0] shadow-[0_10px_24px_-12px_rgba(16,26,48,0.18)] font-mono2 text-[12px] text-[#55607A]">
            <span className="text-[#4A54E2]">↓</span> 滚动 = 旋转圆环
          </div>

          <div className="max-w-[1440px] mx-auto px-10 h-full grid grid-cols-12 gap-6">
            {/* 左：逐字错峰标题 */}
            <div className="col-span-5 pt-[16vh]">
              <div className="kicker">SELECTED CASES · 2024—2026</div>
              <h1 className="font-display text-[68px] leading-[1.25] mt-6 text-[#101A30]">
                {TITLE_CHARS.map((c, i) => (
                  <span
                    key={i}
                    className="char-in"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {c}
                  </span>
                ))}
              </h1>
              <p className="text-[15px] text-[#55607A] leading-[1.8] mt-6 max-w-[400px]">
                四个 CASE 始终停在圆环上，滚动时依次转到镜头前；点击正面卡片进入完整故事。
              </p>
              <div className="mt-10 font-mono2 text-sm">
                <span className="text-[#4A54E2] text-2xl font-bold">
                  0{activeIdx + 1}
                </span>
                <span className="text-[#9AA3B8]"> / 04</span>
              </div>
              <div className="flex gap-2 mt-4">
                {cases.map((c, i) => (
                  <span
                    key={c.id}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === activeIdx ? "w-8 bg-[#4A54E2]" : "w-1.5 bg-[#E2DEF0]"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 右：环状舞台（四卡常驻可见） */}
            <div className="col-span-7 relative">
              {/* 轨道椭圆 */}
              <div className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 w-[760px] h-[300px] rounded-[100%] border border-dashed border-[#CFC8E8]" />
              {cases.map((c, i) => {
                const rad = ((i * 90 - progress * 90) * Math.PI) / 180;
                const depth = Math.cos(rad); // 1=正前方 -1=最后方
                const t = (depth + 1) / 2; // 0..1
                const x = Math.sin(rad) * 300;
                const y = -(1 - t) * 120; // 后方卡片沿环上浮，始终探出一部分
                const scale = 0.62 + 0.38 * t;
                const opacity = 0.45 + 0.55 * t;
                const isFront = i === activeIdx;
                return (
                  <div
                    key={c.id}
                    onClick={() => isFront && navigate(`/cases/${c.id}`)}
                    className={`absolute left-1/2 top-[54%] w-[340px] rounded-2xl p-6 select-none ${
                      isFront
                        ? "bg-white border-2 border-[#4A54E2] shadow-[0_36px_72px_-20px_rgba(74,84,226,0.35)] cursor-pointer"
                        : "bg-white/90 border border-[#E2DEF0] shadow-[0_18px_40px_-18px_rgba(16,26,48,0.15)]"
                    }`}
                    style={{
                      height: 400,
                      transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,
                      opacity,
                      zIndex: Math.round(t * 20),
                      filter: `blur(${(1 - t) * 1.2}px)`,
                      transition:
                        "transform 0.12s linear, opacity 0.12s linear, filter 0.12s linear, border-color 0.3s ease",
                    }}
                  >
                    <div className="font-mono2 text-[11px] tracking-widest text-[#9AA3B8]">
                      CASE {c.no} · {c.company}
                    </div>
                    <div className="font-display text-[24px] text-[#101A30] mt-2 leading-snug">
                      {c.title[0]}
                      {c.title[1]}
                    </div>
                    {/* 迷你流程条 */}
                    <div className="mt-5 flex items-center gap-1 flex-wrap">
                      {(c.id === "oppo"
                        ? ["输入", "Host", "App", "校验"]
                        : c.id === "tcl"
                          ? ["抓取", "解析", "计算", "预警", "动作"]
                          : c.id === "hospital"
                            ? ["病案", "证据", "讨论", "决策"]
                            : ["需求", "目标", "评测集", "评测", "决策"]
                      ).map((n, j, arr) => (
                        <div key={n} className="flex items-center gap-1">
                          <span
                            className={`px-2 py-1 rounded-md text-[10px] font-mono2 ${
                              j === arr.length - 1
                                ? "bg-[#4A54E2] text-white"
                                : "bg-[#F5F4EF] border border-[#E2DEF0] text-[#55607A]"
                            }`}
                          >
                            {n}
                          </span>
                          {j < arr.length - 1 && (
                            <span className="text-[#CFC8E8] text-[10px]">→</span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 space-y-2">
                      {c.metrics.map(([v, l]) => (
                        <div key={l} className="flex items-baseline gap-2">
                          <span className="font-mono2 text-[18px] font-bold text-[#4A54E2]">
                            {v}
                          </span>
                          <span className="text-[12px] text-[#55607A]">{l}</span>
                        </div>
                      ))}
                    </div>
                    {isFront && (
                      <div className="absolute bottom-5 right-6 font-mono2 text-[12px] text-[#4A54E2]">
                        点击进入 →
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono2 text-[11px] tracking-[0.3em] text-[#9AA3B8]">
            RING ROTATION · 每 90° 切换一个 CASE
          </div>
        </section>
      </div>

      {/* 出口 */}
      <section className="py-24 text-center border-t border-[#E2DEF0]">
        <p className="text-[#55607A]">想看完整经历时间线？</p>
        <button
          onClick={() => navigate("/experience")}
          className="mt-5 px-7 h-[52px] rounded-full bg-[#4A54E2] text-white font-bold shadow-[0_20px_40px_-12px_rgba(74,84,226,0.5)] hover:-translate-y-0.5 transition-all"
        >
          前往经历页 →
        </button>
      </section>
    </div>
  );
}
