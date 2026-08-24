import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";

type Tab = "overview" | "conversations" | "knowledge" | "evidence" | "api";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "overview", label: "概览", icon: "▦" },
  { key: "conversations", label: "对话记录", icon: "◉" },
  { key: "knowledge", label: "知识库", icon: "▤" },
  { key: "evidence", label: "证据库", icon: "⚑" },
  { key: "api", label: "API 设置", icon: "✦" },
];

const TOKEN_KEY = "lzy_admin_token";

export default function Admin() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );
  const [keyInput, setKeyInput] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [tab, setTab] = useState<Tab>("overview");

  // 校验本地 token
  const verify = trpc.adminAuth.verify.useQuery(
    { token: token ?? "" },
    { enabled: !!token, retry: false },
  );
  const login = trpc.adminAuth.login.useMutation({
    onSuccess: (r) => {
      localStorage.setItem(TOKEN_KEY, r.token);
      setToken(r.token);
      setLoginErr("");
    },
    onError: (e) => setLoginErr(e.message || "密钥不正确"),
  });

  const authed = !!token && verify.data?.ok === true;
  const checking = !!token && verify.isLoading;

  const doLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  /* ---------- 登录门 ---------- */
  if (!authed) {
    return (
      <div className="min-h-screen bg-white home-dots flex items-center justify-center">
        <div className="paper-card w-[400px] p-9 !shadow-[0_40px_80px_-24px_rgba(74,84,226,0.18)]">
          <div className="font-mono2 text-[13px] text-[#101A30]">
            <span className="text-[#4A54E2] font-bold">LZY</span> ADMIN
          </div>
          <h1 className="font-display text-[26px] text-[#101A30] mt-3">
            管理后台
          </h1>
          <p className="text-[13px] text-[#55607A] mt-2">
            仅站主可见。输入管理密钥进入控制台。
          </p>
          {checking ? (
            <div className="mt-8 text-[13px] text-[#9AA3B8]">验证密钥中…</div>
          ) : (
            <form
              className="mt-7 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (keyInput.trim()) login.mutate({ key: keyInput.trim() });
              }}
            >
              <input
                type="password"
                autoFocus
                placeholder="管理密钥"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-[#F5F4EF] border border-[#E2DEF0] text-[14px] font-mono2 outline-none focus:border-[#4A54E2]"
              />
              {loginErr && (
                <div className="text-[12px] text-[#D97706]">✗ {loginErr}</div>
              )}
              <button
                type="submit"
                disabled={login.isPending}
                className="w-full h-12 rounded-xl bg-[#4A54E2] text-white text-[14px] font-bold hover:opacity-90 disabled:opacity-50"
              >
                {login.isPending ? "验证中…" : "进入控制台 →"}
              </button>
            </form>
          )}
          <button
            onClick={() => navigate("/")}
            className="mt-6 text-[12px] text-[#9AA3B8] hover:text-[#4A54E2]"
          >
            ← 返回网站首页
          </button>
        </div>
      </div>
    );
  }

  /* ---------- 控制台 ---------- */
  return (
    <div className="min-h-screen bg-[#EEEBE2] flex">
      <aside className="w-56 shrink-0 border-r border-[#E2DEF0] bg-[#F5F4EF] flex flex-col">
        <div className="px-5 py-5 border-b border-[#E2DEF0]">
          <div className="font-mono2 text-[13px] text-[#101A30]">
            <span className="text-[#4A54E2] font-bold">LZY</span> ADMIN
          </div>
          <div className="font-mono2 text-[10px] text-[#9AA3B8] mt-1">
            ASK ME 控制台
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-[13px] transition-colors flex items-center gap-3 ${
                tab === t.key
                  ? "bg-[#E3E0FF] text-[#4A54E2] font-bold"
                  : "text-[#55607A] hover:bg-white"
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-[#E2DEF0] space-y-1.5">
          <button
            onClick={() => navigate("/")}
            className="block text-[12px] text-[#9AA3B8] hover:text-[#4A54E2]"
          >
            ← 返回网站
          </button>
          <button
            onClick={doLogout}
            className="block text-[12px] text-[#9AA3B8] hover:text-[#D97706]"
          >
            退出控制台 →
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl text-[#101A30]">
            {TABS.find((t) => t.key === tab)?.label}
          </h1>
          <span className="px-3 py-1.5 rounded-full bg-[#FDF3E3] border border-[#F0D9B5] text-[#D97706] text-[12px]">
            🔒 仅本人可见 · 密钥鉴权
          </span>
        </div>
        {tab === "overview" && <Overview token={token!} onKeyChanged={(t) => { localStorage.setItem(TOKEN_KEY, t); setToken(t); }} />}
        {tab === "conversations" && <Conversations token={token!} />}
        {tab === "knowledge" && <Knowledge token={token!} />}
        {tab === "evidence" && <Evidence token={token!} />}
        {tab === "api" && <ApiSettings token={token!} />}
      </main>
    </div>
  );
}

/* ---------- 概览（含修改密钥） ---------- */
function Overview({
  token,
  onKeyChanged,
}: {
  token: string;
  onKeyChanged: (t: string) => void;
}) {
  const stats = trpc.admin.stats.useQuery({ token });
  const [newKey, setNewKey] = useState("");
  const [msg, setMsg] = useState("");
  const changeKey = trpc.adminAuth.changeKey.useMutation({
    onSuccess: (r) => {
      onKeyChanged(r.token);
      setNewKey("");
      setMsg("✓ 密钥已更新，旧登录态已全部失效");
    },
    onError: (e) => setMsg(`✗ ${e.message}`),
  });
  const s = stats.data;
  const cards = [
    { label: "累计提问", value: s?.questions ?? "—", unit: "条" },
    { label: "知识库条目", value: s?.knowledge ?? "—", unit: "条" },
    { label: "证据文件", value: s?.evidence ?? "—", unit: "个" },
    { label: "回答命中率", value: s ? `${s.hitRate}` : "—", unit: "%", warn: true },
  ];
  return (
    <div>
      <div className="grid grid-cols-4 gap-5">
        {cards.map((c) => (
          <div key={c.label} className="paper-card p-6">
            <div
              className={`font-mono2 text-4xl font-bold ${c.warn ? "text-[#D97706]" : "text-[#4A54E2]"}`}
            >
              {c.value}
              <span className="text-sm font-normal text-[#9AA3B8] ml-1">{c.unit}</span>
            </div>
            <div className="text-[13px] text-[#55607A] mt-2">{c.label}</div>
          </div>
        ))}
      </div>
      <div className="paper-card p-6 mt-6">
        <div className="font-mono2 text-[11px] tracking-widest text-[#9AA3B8]">
          运营闭环 OPS LOOP
        </div>
        <div className="text-[15px] text-[#101A30] mt-3">
          看用户问什么 → 发现未命中问题 → 上传证据补知识 → 命中率提升
        </div>
        <p className="text-[13px] text-[#55607A] mt-2">
          大模型 API 在「API 设置」中配置（Base / Key /
          模型）；未命中问题可在知识库一键补充，审核后即刻生效。
        </p>
      </div>
      <div className="paper-card p-6 mt-6 max-w-[480px]">
        <div className="font-mono2 text-[11px] tracking-widest text-[#9AA3B8]">
          安全 · 修改管理密钥
        </div>
        <div className="flex gap-3 mt-4">
          <input
            type="password"
            placeholder="新密钥（至少 8 位）"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="flex-1 h-11 px-4 rounded-xl bg-[#F5F4EF] border border-[#E2DEF0] text-[13px] font-mono2 outline-none focus:border-[#4A54E2]"
          />
          <button
            onClick={() => newKey.trim().length >= 8 && changeKey.mutate({ token, newKey: newKey.trim() })}
            disabled={changeKey.isPending}
            className="px-6 h-11 rounded-xl bg-[#101A30] text-white text-[13px] font-bold disabled:opacity-50"
          >
            更新密钥
          </button>
        </div>
        {msg && <div className="text-[12px] text-[#55607A] mt-3">{msg}</div>}
        <p className="text-[12px] text-[#9AA3B8] mt-3">
          密钥只以哈希形式存于服务端数据库；更新后所有旧登录态立即失效。
        </p>
      </div>
    </div>
  );
}

/* ---------- 对话记录 ---------- */
function Conversations({ token }: { token: string }) {
  const msgs = trpc.admin.recentMessages.useQuery({ token });
  return (
    <div className="paper-card overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E2DEF0] font-mono2 text-[11px] tracking-widest text-[#9AA3B8]">
        RECENT QUESTIONS · 用户问了什么
      </div>
      <table className="w-full text-[13px]">
        <thead>
          <tr className="text-left text-[#9AA3B8] border-b border-[#E2DEF0]">
            <th className="px-6 py-3 font-normal">时间</th>
            <th className="px-6 py-3 font-normal">用户问题</th>
            <th className="px-6 py-3 font-normal">命中知识</th>
            <th className="px-6 py-3 font-normal">状态</th>
          </tr>
        </thead>
        <tbody>
          {(msgs.data ?? [])
            .filter((m) => m.role === "user")
            .map((m) => {
              const all = msgs.data ?? [];
              const idx = all.findIndex((x) => x.id === m.id);
              const reply = all
                .slice(idx + 1)
                .find(
                  (x) =>
                    x.role === "assistant" &&
                    x.conversationId === m.conversationId,
                );
              const hit = reply?.matched === "yes";
              return (
                <tr
                  key={m.id}
                  className={`border-b border-[#E2DEF0]/60 ${!hit ? "bg-[#FDF3E3]/50" : ""}`}
                >
                  <td className="px-6 py-3.5 font-mono2 text-[11px] text-[#9AA3B8] whitespace-nowrap">
                    {new Date(m.createdAt).toLocaleString("zh-CN", {
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-3.5 text-[#101A30]">{m.content}</td>
                  <td className="px-6 py-3.5 font-mono2 text-[11px] text-[#55607A]">
                    {reply?.sources?.[0] ?? "—"}
                  </td>
                  <td className="px-6 py-3.5">
                    {hit ? (
                      <span className="text-[#4A54E2]">● 已回答</span>
                    ) : (
                      <span className="text-[#D97706]">● 未命中 · 待补充知识</span>
                    )}
                  </td>
                </tr>
              );
            })}
          {msgs.data?.filter((m) => m.role === "user").length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-10 text-center text-[#9AA3B8]">
                还没有访客提问
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- 知识库 ---------- */
function Knowledge({ token }: { token: string }) {
  const utils = trpc.useUtils();
  const list = trpc.admin.knowledgeList.useQuery({ token });
  const create = trpc.admin.knowledgeCreate.useMutation({
    onSuccess: () => utils.admin.knowledgeList.invalidate(),
  });
  const update = trpc.admin.knowledgeUpdate.useMutation({
    onSuccess: () => utils.admin.knowledgeList.invalidate(),
  });
  const del = trpc.admin.knowledgeDelete.useMutation({
    onSuccess: () => utils.admin.knowledgeList.invalidate(),
  });
  const [form, setForm] = useState({
    title: "",
    category: "通用",
    content: "",
    keywords: "",
  });

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-4">
        {(list.data ?? []).map((k) => (
          <div
            key={k.id}
            className={`paper-card p-5 ${k.enabled === "no" ? "opacity-50" : ""}`}
          >
            <div className="flex items-center justify-between">
              <div className="text-[14px] font-bold text-[#101A30]">{k.title}</div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    update.mutate({
                      token,
                      id: k.id,
                      enabled: k.enabled === "yes" ? "no" : "yes",
                    })
                  }
                  className="text-[11px] px-2.5 py-1 rounded-full border border-[#E2DEF0] text-[#55607A] hover:border-[#4A54E2]"
                >
                  {k.enabled === "yes" ? "停用" : "启用"}
                </button>
                <button
                  onClick={() =>
                    confirm("删除这条知识？") && del.mutate({ token, id: k.id })
                  }
                  className="text-[11px] px-2.5 py-1 rounded-full border border-[#E2DEF0] text-[#D97706] hover:border-[#D97706]"
                >
                  删除
                </button>
              </div>
            </div>
            <div className="font-mono2 text-[10px] text-[#4A54E2] mt-1">{k.category}</div>
            <p className="text-[13px] text-[#55607A] mt-2 leading-relaxed line-clamp-3">
              {k.content}
            </p>
            {k.keywords && (
              <div className="font-mono2 text-[10px] text-[#9AA3B8] mt-2">
                关键词：{k.keywords}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="paper-card p-6 h-fit sticky top-6">
        <div className="font-mono2 text-[11px] tracking-widest text-[#9AA3B8]">
          新增知识条目
        </div>
        <div className="space-y-3 mt-4">
          <input
            placeholder="标题，如：CASE 05 · xxx"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full h-11 px-4 rounded-xl bg-[#F5F4EF] border border-[#E2DEF0] text-[13px] outline-none focus:border-[#4A54E2]"
          />
          <input
            placeholder="分类，如：CASE / 经历 / 技能"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full h-11 px-4 rounded-xl bg-[#F5F4EF] border border-[#E2DEF0] text-[13px] outline-none focus:border-[#4A54E2]"
          />
          <input
            placeholder="检索关键词，逗号分隔，如：智谱,评测,选型"
            value={form.keywords}
            onChange={(e) => setForm({ ...form, keywords: e.target.value })}
            className="w-full h-11 px-4 rounded-xl bg-[#F5F4EF] border border-[#E2DEF0] text-[13px] outline-none focus:border-[#4A54E2]"
          />
          <textarea
            placeholder="知识内容（回答时将作为证据引用）"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={6}
            className="w-full px-4 py-3 rounded-xl bg-[#F5F4EF] border border-[#E2DEF0] text-[13px] outline-none focus:border-[#4A54E2] resize-none"
          />
          <button
            onClick={() =>
              form.title &&
              form.content &&
              create.mutate(
                { token, ...form },
                {
                  onSuccess: () =>
                    setForm({ title: "", category: "通用", content: "", keywords: "" }),
                },
              )
            }
            disabled={create.isPending}
            className="w-full h-11 rounded-xl bg-[#4A54E2] text-white text-[14px] font-bold hover:opacity-90 disabled:opacity-50"
          >
            保存到知识库
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- 证据库 ---------- */
function Evidence({ token }: { token: string }) {
  const utils = trpc.useUtils();
  const list = trpc.admin.evidenceList.useQuery({ token });
  const create = trpc.admin.evidenceCreate.useMutation({
    onSuccess: () => utils.admin.evidenceList.invalidate(),
  });
  const del = trpc.admin.evidenceDelete.useMutation({
    onSuccess: () => utils.admin.evidenceList.invalidate(),
  });
  const [form, setForm] = useState({ name: "", note: "", content: "" });

  const onFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setForm({
        name: f.name,
        note: form.note,
        content: String(reader.result ?? "").slice(0, 200000),
      });
    };
    reader.readAsText(f);
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <label
          className="block border-2 border-dashed border-[#CFC8E8] rounded-2xl p-10 text-center cursor-pointer hover:border-[#4A54E2] transition-colors bg-white"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) onFile(f);
          }}
        >
          <input
            type="file"
            accept=".md,.txt,.json,.csv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
          />
          <div className="text-[15px] text-[#101A30] font-bold">⚑ 拖拽上传证据</div>
          <div className="text-[12px] text-[#9AA3B8] mt-2">
            MD / TXT / JSON / CSV · 自动同步知识库
          </div>
        </label>
        {form.name && (
          <div className="paper-card p-5 mt-4">
            <div className="text-[13px] font-bold text-[#101A30]">
              待入库：{form.name}
            </div>
            <input
              placeholder="备注（可选）"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="w-full h-10 px-4 mt-3 rounded-xl bg-[#F5F4EF] border border-[#E2DEF0] text-[13px] outline-none focus:border-[#4A54E2]"
            />
            <button
              onClick={() =>
                create.mutate(
                  {
                    token,
                    name: form.name,
                    fileType: form.name.split(".").pop() || "txt",
                    content: form.content,
                    note: form.note,
                  },
                  { onSuccess: () => setForm({ name: "", note: "", content: "" }) },
                )
              }
              className="w-full h-10 mt-3 rounded-xl bg-[#4A54E2] text-white text-[13px] font-bold"
            >
              确认入库
            </button>
          </div>
        )}
      </div>
      <div className="space-y-3">
        {(list.data ?? []).map((f) => (
          <div
            key={f.id}
            className="paper-card px-5 py-4 flex items-center justify-between"
          >
            <div>
              <div className="text-[13px] font-bold text-[#101A30]">{f.name}</div>
              <div className="font-mono2 text-[10px] text-[#9AA3B8] mt-0.5">
                {f.fileType} · {new Date(f.createdAt).toLocaleDateString("zh-CN")}
                {f.note && ` · ${f.note}`}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#4A54E2]">✓ 已同步</span>
              <button
                onClick={() =>
                  confirm("删除该证据文件？") && del.mutate({ token, id: f.id })
                }
                className="text-[11px] text-[#D97706]"
              >
                删除
              </button>
            </div>
          </div>
        ))}
        {list.data?.length === 0 && (
          <div className="paper-card p-10 text-center text-[#9AA3B8] text-[13px]">
            还没有证据文件
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- API 设置 ---------- */
function ApiSettings({ token }: { token: string }) {
  const utils = trpc.useUtils();
  const get = trpc.admin.llmGet.useQuery({ token });
  const set = trpc.admin.llmSet.useMutation({
    onSuccess: () => utils.admin.llmGet.invalidate(),
  });
  const test = trpc.admin.llmTest.useMutation();
  const [form, setForm] = useState({
    apiBase: "",
    apiKey: "",
    model: "",
    temperature: "0.3",
  });
  const [enabled, setEnabled] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    if (get.data) {
      setForm({
        apiBase: get.data.apiBase,
        apiKey: get.data.apiKey,
        model: get.data.model,
        temperature: get.data.temperature,
      });
      setEnabled(get.data.enabled === "yes");
    }
  }, [get.data]);

  return (
    <div className="max-w-[640px]">
      <div className="paper-card p-7">
        <div className="flex items-center justify-between">
          <div className="font-mono2 text-[11px] tracking-widest text-[#9AA3B8]">
            大模型 API · OPENAI 兼容接口
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`w-12 h-6 rounded-full transition-colors relative ${enabled ? "bg-[#4A54E2]" : "bg-[#E2DEF0]"}`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${enabled ? "left-[26px]" : "left-0.5"}`}
            />
          </button>
        </div>
        <div className="space-y-3 mt-5">
          {(
            [
              ["apiBase", "API Base，如 https://api.moonshot.cn/v1"],
              ["apiKey", "API Key（已保存的密钥只显示后 4 位）"],
              ["model", "模型名，如 kimi-k2"],
              ["temperature", "温度，0-1，默认 0.3"],
            ] as const
          ).map(([k, ph]) => (
            <input
              key={k}
              placeholder={ph}
              type={k === "apiKey" ? "password" : "text"}
              value={form[k]}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              className="w-full h-11 px-4 rounded-xl bg-[#F5F4EF] border border-[#E2DEF0] text-[13px] font-mono2 outline-none focus:border-[#4A54E2]"
            />
          ))}
        </div>
        <div className="flex gap-3 mt-5">
          <button
            onClick={() =>
              set.mutate({ token, ...form, enabled: enabled ? "yes" : "no" })
            }
            disabled={set.isPending}
            className="flex-1 h-11 rounded-xl bg-[#4A54E2] text-white text-[14px] font-bold disabled:opacity-50"
          >
            保存配置
          </button>
          <button
            onClick={() => {
              setTestResult(null);
              test.mutate(
                { token },
                {
                  onSuccess: (r) =>
                    setTestResult(
                      r.ok
                        ? `✓ 连通成功：${r.answer}`
                        : `✗ 连通失败：${r.error ?? "请检查 Base / Key / 模型名"}`,
                    ),
                  onError: () => setTestResult("✗ 请求失败"),
                },
              );
            }}
            disabled={test.isPending}
            className="px-6 h-11 rounded-xl bg-white border border-[#E2DEF0] text-[14px] text-[#101A30] hover:border-[#4A54E2] disabled:opacity-50"
          >
            {test.isPending ? "测试中…" : "测试连通"}
          </button>
        </div>
        {testResult && (
          <div className="mt-4 px-4 py-3 rounded-xl bg-[#F5F4EF] text-[13px] text-[#101A30]">
            {testResult}
          </div>
        )}
      </div>
      <div className="paper-card p-6 mt-5 text-[13px] text-[#55607A] leading-relaxed">
        <strong className="text-[#101A30]">工作方式：</strong>
        未配置或关闭时，AskMe
        走本地知识库检索回答（零成本、可溯源）；配置并开启后，系统将知识库命中的证据作为上下文调用大模型生成更自然的回答。密钥仅存储在服务端数据库，前端只回显后
        4 位。
      </div>
    </div>
  );
}
