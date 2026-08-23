import { useEffect, useRef, useState } from "react";
import { Reveal, SiteNav } from "@/components/common";
import { trpc } from "@/providers/trpc";

interface Msg {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

const SUGGESTED = [
  "他在智谱做的评测平台解决了什么？",
  "OPPO 项目里是怎么做技术选型的？",
  "他做过哪些多 Agent 架构？",
  "他能为团队带来什么业务价值？",
];

function getSessionId() {
  let s = localStorage.getItem("lzy_sid");
  if (!s) {
    s = crypto.randomUUID().replace(/-/g, "");
    localStorage.setItem("lzy_sid", s);
  }
  return s;
}

export default function AskMe() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const sid = useRef(getSessionId());

  const ask = trpc.askme.ask.useMutation();
  const history = trpc.askme.history.useQuery(
    { sessionId: sid.current },
    { staleTime: Infinity },
  );

  useEffect(() => {
    if (history.data && msgs.length === 0) {
      setMsgs(history.data.map((m) => ({ role: m.role, content: m.content, sources: m.sources })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.data]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, thinking]);

  const send = (q?: string) => {
    const question = (q ?? input).trim();
    if (!question || thinking) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", content: question }]);
    setThinking(true);
    ask.mutate(
      { question, sessionId: sid.current },
      {
        onSuccess: (r) => {
          setMsgs((m) => [
            ...m,
            { role: "assistant", content: r.answer, sources: r.sources },
          ]);
          setThinking(false);
        },
        onError: () => {
          setMsgs((m) => [
            ...m,
            { role: "assistant", content: "服务暂时不可用，请稍后再试。" },
          ]);
          setThinking(false);
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F4EF]">
      <SiteNav active="askme" />
      <div className="max-w-[1440px] mx-auto px-10 pt-32 pb-16 grid grid-cols-12 gap-10 min-h-screen">
        {/* 左侧 */}
        <div className="col-span-5 pt-10">
          <Reveal>
            <div className="kicker">ASK ME ANYTHING</div>
            <h1 className="font-display text-[56px] leading-[1.25] mt-5 text-[#101A30]">
              直接问我，
              <br />
              而不是猜我。
            </h1>
            <p className="text-[15px] text-[#55607A] leading-[1.9] mt-6 max-w-[420px]">
              这个助手接入我的真实经历与证据库：每个回答都能溯源到具体的
              CASE、项目文档或数据。
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div className="mt-10 space-y-3">
              <div className="font-mono2 text-[11px] tracking-widest text-[#9AA3B8]">
                试试这些问题 →
              </div>
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="block w-full text-left paper-card px-5 py-4 text-[14px] text-[#101A30] hover:border-[#4A54E2]/60 hover:-translate-y-0.5 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        {/* 右侧对话窗 */}
        <div className="col-span-7">
          <Reveal delay={100}>
            <div className="paper-card overflow-hidden flex flex-col h-[74vh]">
              {/* 头部 */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-[#E2DEF0] bg-white">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4A54E2]" />
                <span className="font-mono2 text-[12px] tracking-widest text-[#101A30]">
                  LZY ASSISTANT
                </span>
                <span className="font-mono2 text-[11px] text-[#9AA3B8]">
                  · 证据驱动 · ONLINE
                </span>
              </div>
              {/* 消息区 */}
              <div ref={listRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                {msgs.length === 0 && (
                  <div className="h-full flex items-center justify-center text-[#9AA3B8] text-[14px]">
                    输入问题，或点击左侧推荐问题开始 →
                  </div>
                )}
                {msgs.map((m, i) =>
                  m.role === "user" ? (
                    <div key={i} className="flex justify-end">
                      <div className="max-w-[75%] rounded-2xl rounded-br-md bg-[#E3E0FF] px-5 py-3.5 text-[14px] text-[#101A30]">
                        {m.content}
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-white border border-[#E2DEF0] px-5 py-4">
                        <p className="text-[14px] text-[#101A30] leading-[1.8] whitespace-pre-wrap">
                          {m.content}
                        </p>
                        {m.sources && m.sources.length > 0 && (
                          <div className="flex gap-2 mt-3 flex-wrap">
                            {m.sources.map((s) => (
                              <span
                                key={s}
                                className="px-2.5 py-1 rounded-full bg-[#F5F4EF] border border-[#E2DEF0] font-mono2 text-[10px] text-[#4A54E2]"
                              >
                                ⬈ {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ),
                )}
                {thinking && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-md bg-white border border-[#E2DEF0] px-5 py-4 text-[14px] text-[#55607A]">
                      正在检索证据库<span className="caret">▍</span>
                    </div>
                  </div>
                )}
              </div>
              {/* 输入区 */}
              <div className="px-5 py-4 border-t border-[#E2DEF0] bg-white flex gap-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="输入你的问题…"
                  className="flex-1 h-12 px-5 rounded-full bg-[#F5F4EF] border border-[#E2DEF0] text-[14px] outline-none focus:border-[#4A54E2] transition-colors"
                />
                <button
                  onClick={() => send()}
                  disabled={thinking}
                  className="h-12 px-7 rounded-full bg-[#4A54E2] text-white text-[14px] font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  发送 ↑
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
      <div className="text-center font-mono2 text-[11px] tracking-widest text-[#9AA3B8] pb-8">
        POWERED BY 大模型 API · 所有回答基于已上传证据，可溯源 · 管理后台仅本人可见
      </div>
    </div>
  );
}
