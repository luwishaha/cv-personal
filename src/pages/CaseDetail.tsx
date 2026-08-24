import type React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Reveal, SiteNav } from "@/components/common";
import { cases, type CaseData } from "@/data/cases";
import {
  TriangleAlert,
  AppWindow,
  ChartColumn,
  Bell,
  Bookmark,
  BookOpen,
  Bot,
  Brain,
  Calculator,
  Camera,
  CircleCheckBig,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Cog,
  Crosshair,
  Database,
  FileClock,
  FileCog,
  FileSearch,
  FileText,
  Globe,
  Image,
  Landmark,
  Layers,
  LayoutGrid,
  Link2,
  ListTree,
  MessageSquare,
  Newspaper,
  Package,
  ChartPie,
  Play,
  Puzzle,
  RefreshCcw,
  Scan,
  Share2,
  ShieldCheck,
  Stethoscope,
  Table,
  Target,
  Terminal,
  TrendingUp,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

/* ---------- 通用：图标流程链（可点击，弹出对应素材） ---------- */

interface FlowDetail {
  title: string;
  lines: string[];
  kind?: "experts";
}

interface FlowNode {
  icon: LucideIcon;
  label: string;
  sub?: string;
  chips?: string[];
  detail?: FlowDetail;
}

const EXPERT_ICONS: LucideIcon[] = [Stethoscope, Brain, UserCheck, FileCog];

/** 节点素材弹层（流程图与架构图共用） */
function NodeDetailPanel({ detail, onClose }: { detail: FlowDetail; onClose: () => void }) {
  return (
    <div className="mt-8 rounded-2xl border-2 border-[#4A54E2]/40 bg-white shadow-[0_24px_48px_-20px_rgba(74,84,226,0.25)] p-7 detail-pop">
      <div className="flex items-center justify-between">
        <div className="font-mono2 text-[11px] tracking-widest text-[#9AA3B8]">
          节点素材 · NODE MATERIAL
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full border border-[#E2DEF0] text-[#9AA3B8] hover:text-[#4A54E2] hover:border-[#4A54E2] transition-colors text-[13px]"
          aria-label="关闭"
        >
          ✕
        </button>
      </div>
      <div className="mt-2 text-[17px] font-bold text-[#101A30]">{detail.title}</div>
      {detail.kind === "experts" ? (
        <div className="grid grid-cols-4 gap-3 mt-5">
          {detail.lines.map((name, i) => {
            const Icon = EXPERT_ICONS[i % EXPERT_ICONS.length];
            return (
              <div
                key={name}
                className="flex flex-col items-center gap-2 rounded-xl bg-[#F4F3FB] border border-[#E2DEF0] px-3 py-4"
              >
                <div className="w-11 h-11 rounded-full bg-white border border-[#E2DEF0] flex items-center justify-center text-[#4A54E2]">
                  <Icon size={19} strokeWidth={1.8} />
                </div>
                <span className="text-[12.5px] font-medium text-[#101A30] text-center">
                  {name}
                </span>
                <span className="font-mono2 text-[10px] text-[#9AA3B8]">
                  EXPERT AGENT {i + 1}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {detail.lines.map((l) => (
            <li key={l} className="flex items-start gap-2.5 text-[13.5px] text-[#55607A]">
              <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#4A54E2] shrink-0" />
              {l}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function IconFlow({ nodes, lastRed = true }: { nodes: FlowNode[]; lastRed?: boolean }) {
  const [sel, setSel] = useState<number | null>(null);
  const clickable = nodes.some((n) => n.detail);
  return (
    <div>
      <div className="flex items-start justify-between gap-2">
        {nodes.map((n, i) => {
          const last = i === nodes.length - 1;
          const red = last && lastRed;
          const active = sel === i;
          return (
            <div key={n.label} className="flex items-start gap-2 flex-1 min-w-0">
              <div className="flex flex-col items-center flex-1 min-w-0">
                <button
                  type="button"
                  disabled={!n.detail}
                  onClick={() => setSel(active ? null : i)}
                  className={`w-16 h-16 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                    active
                      ? "bg-white border-[#4A54E2] text-[#4A54E2] shadow-[0_14px_28px_-10px_rgba(74,84,226,0.45)] -translate-y-1"
                      : red
                        ? "bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]"
                        : "bg-[#F4F3FB] border-[#E2DEF0] text-[#4A54E2]"
                  } ${n.detail ? "cursor-pointer hover:-translate-y-1 hover:shadow-[0_14px_28px_-12px_rgba(74,84,226,0.35)]" : "cursor-default"}`}
                >
                  <n.icon size={26} strokeWidth={1.8} />
                </button>
                <div
                  className={`mt-2.5 text-[13.5px] font-bold text-center ${
                    active ? "text-[#4A54E2]" : red ? "text-[#DC2626]" : "text-[#101A30]"
                  }`}
                >
                  {n.label}
                </div>
                {n.sub && (
                  <div className="mt-1 text-[11px] text-[#9AA3B8] text-center leading-relaxed">
                    {n.sub}
                  </div>
                )}
                {n.chips && (
                  <div className="flex gap-1.5 mt-2">
                    {n.chips.map((c) => (
                      <span
                        key={c}
                        className="px-2.5 py-0.5 rounded-md bg-white border border-[#E2DEF0] font-mono2 text-[10px] text-[#55607A]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {!last && (
                <span className="text-[#4A54E2] text-lg mt-5 shrink-0">→</span>
              )}
            </div>
          );
        })}
      </div>
      {clickable && sel === null && (
        <div className="mt-6 text-center font-mono2 text-[11px] tracking-widest text-[#B6BCD0]">
          ↑ 点击流程节点，查看对应素材
        </div>
      )}
      {sel !== null && nodes[sel].detail && (
        <NodeDetailPanel detail={nodes[sel].detail!} onClose={() => setSel(null)} />
      )}
    </div>
  );
}

/* ---------- 02 / 各 case 系统图（按截图） ---------- */

function ZhipuSystem() {
  return (
    <div className="paper-card p-10">
      <IconFlow
        nodes={[
          {
            icon: Users,
            label: "业务需求",
            sub: "定义问题",
            detail: {
              title: "业务需求来源",
              lines: [
                "PPT 生成：大纲结构、内容逻辑、场景化分页",
                "视觉理解 / Design QA：信息覆盖、属性与位置、幻觉控制",
                "Excel 能力：表格理解、公式生成、数据分析",
              ],
            },
          },
          {
            icon: Target,
            label: "评测目标",
            sub: "定义什么是好",
            detail: {
              title: "把“什么是好”拆成可打分的维度",
              lines: [
                "每个业务场景拆为 3 个可评测量化维度",
                "维度与业务验收标准一一对应",
                "业务场景 → 评价维度 → 评测样本 → 结果对比",
              ],
            },
          },
          {
            icon: Database,
            label: "评测集",
            sub: "样本与规则",
            detail: {
              title: "评测集构成",
              lines: [
                "150+ 评测样本，覆盖 3 类业务场景",
                "样本绑定评价维度与打分规则",
                "版本化管理，支持复测与回归",
              ],
            },
          },
          {
            icon: Play,
            label: "自动评测",
            sub: "任务编排",
            chips: ["Direct", "Gateway"],
            detail: {
              title: "双通道自动评测",
              lines: [
                "Direct 直连：模型直出，作为能力基线",
                "Gateway 网关：走真实产品链路",
                "Gateway E2E − Direct E2E = 网关净开销",
              ],
            },
          },
          {
            icon: ChartColumn,
            label: "结果对比",
            sub: "统一指标",
            detail: {
              title: "可复现的对比口径",
              lines: [
                "同一模型 × 同一样本 × 相邻时间窗口",
                "8 个模型横向对比，统一指标输出",
                "结果可直接进入选型与验收讨论",
              ],
            },
          },
          {
            icon: ChartPie,
            label: "产品决策",
            sub: "选型 / 回归 / 验收",
            detail: {
              title: "评测结果的三个去向",
              lines: [
                "模型选型：横向对比质量、性能与成本",
                "版本回归：识别能力变化与异常退化",
                "上线验收：按场景标准完成产品验收",
              ],
            },
          },
        ]}
      />
      <div className="mt-10 max-w-[560px] mx-auto rounded-xl border border-dashed border-[#B9B2E8] bg-[#F4F3FB] px-8 py-3.5 text-center text-[14px] text-[#4A54E2]">
        同一模型 × 同一样本 × 相邻时间窗口
      </div>
      <p className="text-center font-mono2 text-[12px] text-[#9AA3B8] mt-3">
        Gateway E2E − Direct E2E = 网关净开销
      </p>
    </div>
  );
}

function OppoSystem() {
  const [sel, setSel] = useState<string | null>(null);
  const hostItems: [LucideIcon, string][] = [
    [ClipboardList, "任务拆解"],
    [AppWindow, "应用生命周期"],
    [RefreshCcw, "调度与重试"],
    [ChartPie, "状态汇总"],
  ];
  const inputs: [LucideIcon, string][] = [
    [Camera, "界面截图"],
    [ListTree, "UI 结构信息"],
    [BookOpen, "领域知识"],
  ];
  const outputs: [LucideIcon, string][] = [
    [LayoutGrid, "目标应用"],
    [ShieldCheck, "状态校验"],
    [FileText, "日志与报告"],
  ];
  const DETAILS: Record<string, FlowDetail> = {
    任务拆解: {
      title: "任务拆解",
      lines: ["将用例批次拆为可执行的原子任务", "按功能模块分组，生成执行顺序", "输出结构化任务清单给执行面"],
    },
    应用生命周期: {
      title: "应用生命周期管理",
      lines: ["启动、挂载、关闭目标应用", "异常退出自动拉起", "保证每个任务从干净状态开始"],
    },
    调度与重试: {
      title: "调度与重试",
      lines: ["多任务排队与并发控制", "失败自动重试并记录原因", "超时熔断，避免单任务卡死"],
    },
    状态汇总: {
      title: "状态汇总",
      lines: ["实时汇总各任务执行状态", "通过 / 失败 / 重试中一目了然", "为报告与告警提供数据源"],
    },
    界面截图: { title: "界面截图", lines: ["当前屏幕帧，作为视觉输入", "供 VLM 路径做界面理解"] },
    "UI 结构信息": { title: "UI 结构信息", lines: ["控件树 / 可访问性树", "为 Skill 路径提供稳定锚点"] },
    领域知识: { title: "领域知识", lines: ["软件文档与历史操作步骤", "让 Agent 理解专业看图软件的功能语义"] },
    观察界面: { title: "观察界面", lines: ["读取截图与 UI 结构信息", "判断当前处于哪个功能状态"] },
    规划步骤: { title: "规划步骤", lines: ["把任务拆成动作序列", "校验未通过则回到此步重新规划"] },
    执行动作: { title: "执行动作", lines: ["点击、输入、拖拽等界面操作", "优先走 Skill 路径，必要时调用 VLM"] },
    校验结果: { title: "校验结果", lines: ["断言执行后的界面状态", "通过则完成任务，未通过则回流"] },
    "Skill 路径": {
      title: "Skill 路径",
      lines: ["稳定控件 / 高频操作直接调用预置技能", "不依赖视觉模型，速度快、确定性高"],
    },
    "VLM 路径": {
      title: "VLM 路径",
      lines: ["复杂界面 / 自绘控件走视觉理解", "小型 VLM 经领域优化，定位更稳定"],
    },
    目标应用: { title: "目标应用", lines: ["被测的专业看图软件（脱敏）", "自绘控件密集，通用模型定位困难"] },
    状态校验: { title: "状态校验", lines: ["执行后状态与预期比对", "结果回传控制面汇总"] },
    日志与报告: { title: "日志与报告", lines: ["完整步骤日志留痕", "自动生成回归测试报告"] },
  };
  const toggle = (k: string) => setSel((s) => (s === k ? null : k));
  const pickCls = (k: string, base: string) =>
    `${base} cursor-pointer transition-all duration-300 ${
      sel === k
        ? "!border-[#4A54E2] shadow-[0_12px_24px_-10px_rgba(74,84,226,0.4)] -translate-y-0.5"
        : "hover:-translate-y-0.5 hover:border-[#C7CBFF]"
    }`;
  return (
    <div className="paper-card p-8">
      {/* Host 控制面 */}
      <div className="max-w-[720px] mx-auto rounded-xl bg-[#F4F3FB] border border-[#E2DEF0] px-6 py-4">
        <div className="text-center font-mono2 text-[12px] tracking-widest text-[#4A54E2]">
          Host Agent / 控制面
        </div>
        <div className="grid grid-cols-4 gap-3 mt-3.5">
          {hostItems.map(([Icon, t]) => (
            <button
              type="button"
              key={t}
              onClick={() => toggle(t)}
              className={pickCls(
                t,
                "flex items-center justify-center gap-2 rounded-lg bg-white border border-[#E2DEF0] px-3 py-2.5 text-[12.5px] text-[#101A30]"
              )}
            >
              <Icon size={15} className="text-[#4A54E2]" />
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-24 my-1 text-[#4A54E2]">
        <span>↓</span>
        <span>↓</span>
        <span>↓</span>
      </div>

      <div className="grid grid-cols-[1fr_auto_2.4fr_auto_1fr] gap-3 items-center mt-1">
        {/* 输入 */}
        <div className="space-y-3">
          {inputs.map(([Icon, t]) => (
            <button
              type="button"
              key={t}
              onClick={() => toggle(t)}
              className={pickCls(
                t,
                "w-full flex items-center gap-2.5 rounded-xl bg-white border border-[#E2DEF0] px-4 py-3 text-[12.5px] text-[#101A30] text-left"
              )}
            >
              <Icon size={16} className="text-[#4A54E2] shrink-0" />
              {t}
            </button>
          ))}
        </div>
        <span className="text-[#4A54E2] text-xl">→</span>

        {/* App 执行面 */}
        <div className="rounded-xl bg-[#F4F3FB] border-2 border-[#4A54E2]/50 p-5">
          <div className="text-center font-mono2 text-[12px] tracking-widest text-[#4A54E2]">
            App Agent / 执行面
          </div>
          <div className="flex items-center justify-center gap-2 mt-3.5 flex-wrap">
            {["观察界面", "规划步骤", "执行动作", "校验结果"].map((s, i, arr) => (
              <div key={s} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggle(s)}
                  className={pickCls(
                    s,
                    "px-4 py-2 rounded-lg bg-white border border-[#E2DEF0] text-[12.5px] font-medium text-[#101A30]"
                  )}
                >
                  {s}
                </button>
                {i < arr.length - 1 && <span className="text-[#4A54E2]">→</span>}
              </div>
            ))}
          </div>
          <div className="font-mono2 text-[10.5px] text-[#9AA3B8] text-center mt-2.5">
            - - 未通过则重新规划，直到通过 - -
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {([["Skill 路径", Cog, "稳定控件 / 高频操作"], ["VLM 路径", Image, "复杂界面 / 视觉理解"]] as const).map(
              ([t, Icon, sub]) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => toggle(t)}
                  className={pickCls(
                    t,
                    "flex items-center gap-3 rounded-xl bg-white border border-[#E2DEF0] px-4 py-3 text-left"
                  )}
                >
                  <Icon size={20} className="text-[#4A54E2] shrink-0" />
                  <div>
                    <div className="text-[13px] font-bold text-[#101A30]">{t}</div>
                    <div className="text-[11px] text-[#9AA3B8]">{sub}</div>
                  </div>
                </button>
              )
            )}
          </div>
        </div>
        <span className="text-[#4A54E2] text-xl">→</span>

        {/* 输出 */}
        <div className="space-y-3">
          {outputs.map(([Icon, t]) => (
            <button
              type="button"
              key={t}
              onClick={() => toggle(t)}
              className={pickCls(
                t,
                "w-full flex items-center gap-2.5 rounded-xl bg-white border border-[#E2DEF0] px-4 py-3 text-[12.5px] text-[#101A30] text-left"
              )}
            >
              <Icon size={16} className="text-[#4A54E2] shrink-0" />
              {t}
            </button>
          ))}
        </div>
      </div>

      {sel === null ? (
        <div className="mt-6 text-center font-mono2 text-[11px] tracking-widest text-[#B6BCD0]">
          ↑ 点击任意模块，查看对应素材
        </div>
      ) : (
        <NodeDetailPanel detail={DETAILS[sel]} onClose={() => setSel(null)} />
      )}

      <div className="mt-6 rounded-xl bg-[#4A54E2] text-white text-center text-[14px] px-8 py-4">
        ★ 稳定步骤优先走 Skill；视觉能力只用于必须理解界面的环节。
      </div>
    </div>
  );
}

function TclSystem() {
  return (
    <div className="paper-card p-10">
      <IconFlow
        nodes={[
          {
            icon: Globe,
            label: "目标市场",
            detail: {
              title: "目标市场范围",
              lines: [
                "覆盖重点出货国家与地区",
                "按市场维护关税、退税与 VAT 规则",
                "市场 × 品类 构成监测网格",
              ],
            },
          },
          {
            icon: Bookmark,
            label: "白名单来源",
            detail: {
              title: "白名单来源清单",
              lines: [
                "海关 / 政府官网：政策原文第一手来源",
                "税务与贸易机构：税率与执行细则",
                "权威贸易媒体：解读与补充信号",
              ],
            },
          },
          {
            icon: Bot,
            label: "当日自动抓取",
            detail: {
              title: "当日自动抓取",
              lines: [
                "每日定时抓取白名单来源更新",
                "变更检测，只保留新增与修订",
                "失败自动重试并记录抓取日志",
              ],
            },
          },
          {
            icon: FileSearch,
            label: "政策解析",
            sub: "国家 · 品类 · 税率 · 生效时间",
            detail: {
              title: "政策解析抽取字段",
              lines: [
                "国家 / 地区：政策适用范围",
                "品类：受影响的商品类目",
                "税率与生效时间：计算与排期依据",
              ],
            },
          },
          {
            icon: Calculator,
            label: "影响计算",
            sub: "关税 / 退税 / VAT",
            detail: {
              title: "影响计算口径",
              lines: [
                "政策变更 × SKU × 国家 × 出货量",
                "输出单位到岸成本变化",
                "汇总为影响价值，支持排序",
              ],
            },
          },
          {
            icon: Bell,
            label: "证据与预警",
            sub: "原文链接 · 关键条款 · 阈值告警",
            detail: {
              title: "证据与预警卡片",
              lines: [
                "每条结论绑定原文链接与关键条款",
                "超过阈值自动触发告警",
                "标准文件 · 证据卡片 · 阈值告警",
              ],
            },
          },
          {
            icon: Package,
            label: "库存 / 出货调整",
            detail: {
              title: "落到业务动作",
              lines: [
                "影响价值转化为库存调整建议",
                "出货节奏与目的国优先级调整",
                "政策变化 → 影响价值 → 库存与出货调整",
              ],
            },
          },
        ]}
      />
      <div className="mt-10 flex items-center justify-center gap-4">
        <div className="rounded-xl border border-[#CFC9FF] bg-[#F4F3FB] px-8 py-3.5 text-[14px] text-[#4A54E2]">
          政策变更 × SKU × 国家 × 出货量
        </div>
        <span className="text-[#4A54E2] text-xl">→</span>
        <div className="rounded-xl border border-[#CFC9FF] bg-white px-8 py-3.5 text-[14px] text-[#4A54E2]">
          单位到岸成本变化 / 影响价值
        </div>
      </div>
    </div>
  );
}

function HospitalSystem() {
  return (
    <div className="paper-card p-10">
      <IconFlow
        lastRed={false}
        nodes={[
          {
            icon: FileText,
            label: "病案输入",
            sub: "病案首页 · 入院手术 · 出院",
            detail: {
              title: "病案输入材料",
              lines: [
                "病案首页：主诊断候选与基础信息",
                "入院记录 / 手术记录：临床经过",
                "出院记录：转归与最终诊断描述",
              ],
            },
          },
          {
            icon: Layers,
            label: "证据增强",
            sub: "国临 2.0 · ICD 院内知识库",
            detail: {
              title: "证据增强来源",
              lines: [
                "国临 2.0 编码与 ICD 注释",
                "院内知识库：历史病例与编码口径",
                "知识图谱 Top-3 关键路径注入",
              ],
            },
          },
          {
            icon: Users,
            label: "专家讨论",
            sub: "临床 · 病理 编码 · 规则",
            detail: {
              title: "4 个专家 Agent 参与讨论",
              kind: "experts",
              lines: ["甲乳临床专家", "甲乳病理专家", "专科编码员", "规则分析师"],
            },
          },
          {
            icon: UserCheck,
            label: "Moderator",
            sub: "识别分歧 · 形成共识",
            detail: {
              title: "Moderator 共识判断",
              lines: [
                "识别各专家 Agent 之间的分歧点",
                "共识度低则发起定向讨论，更新判断",
                "共识度高则进入决策环节",
              ],
            },
          },
          {
            icon: Target,
            label: "Decision Maker",
            sub: "整合判断 · 标记疑点",
            detail: {
              title: "Decision Maker 决策",
              lines: [
                "整合讨论结论，给出编码判断",
                "存在可疑点时转编码员复核",
                "保留完整推理链，支持复盘",
              ],
            },
          },
          {
            icon: ClipboardCheck,
            label: "辅助编码结果",
            sub: "建议 · 证据链 · 可疑点",
            detail: {
              title: "辅助编码结果输出",
              lines: [
                "编码建议：主诊断编码候选",
                "证据链：每条建议可追溯到病历原文",
                "可疑点：⚠ 标记需人工复核的位置",
              ],
            },
          },
        ]}
      />
      {/* 回流：共识度低则定向讨论 */}
      <div className="relative mx-[18%] mt-1 h-16 border-b-2 border-l-2 border-r-2 border-dashed border-[#C7CBFF] rounded-b-2xl">
        <div className="absolute -top-1.5 left-0 -translate-x-1/2 text-[#4A54E2]">↑</div>
        <div className="absolute inset-x-0 top-4 flex items-center justify-center gap-4">
          <span className="font-mono2 text-[11.5px] text-[#4A54E2]">
            定向讨论，更新判断
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-white border border-[#F0D9B5] text-[11.5px] text-[#D97706]">
            ⚠ 共识度低 / 存在可疑点
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- 03 / 各 case 机制段（按截图） ---------- */

function ZhipuMech() {
  const rows: [LucideIcon, string, string[]][] = [
    [FileText, "PPT 生成", ["大纲结构完整性", "内容逻辑连贯性", "场景化分页能力"]],
    [Image, "视觉理解 / Design QA", ["关键信息覆盖率", "属性与位置准确性", "幻觉与遗漏控制"]],
    [Table, "Excel 能力", ["表格与意图理解", "公式生成与纠错", "数据分析与指令执行"]],
  ];
  return (
    <div className="paper-card p-9">
      <div className="flex items-center justify-between">
        <span className="font-mono2 text-[11px] tracking-widest text-[#9AA3B8]">
          EVALUATION TARGET BUILDER
        </span>
        <span className="font-mono2 text-[11px] text-[#9AA3B8]">3 个场景</span>
      </div>
      <div className="mt-4 divide-y divide-[#F0EDF8]">
        {rows.map(([Icon, name, dims]) => (
          <div key={name} className="flex items-center gap-5 py-5">
            <div className="w-11 h-11 rounded-lg bg-[#F4F3FB] border border-[#E2DEF0] flex items-center justify-center text-[#4A54E2] shrink-0">
              <Icon size={20} strokeWidth={1.8} />
            </div>
            <div className="w-44 shrink-0 text-[14.5px] font-bold text-[#101A30]">{name}</div>
            <div className="flex gap-3 flex-1">
              {dims.map((d) => (
                <span
                  key={d}
                  className="flex-1 text-center px-4 py-2.5 rounded-lg bg-[#F5F4EF] border border-[#EFEBF7] text-[12.5px] text-[#55607A]"
                >
                  {d}
                </span>
              ))}
            </div>
            <ChevronRight size={16} className="text-[#C7CBE0] shrink-0" />
          </div>
        ))}
      </div>
      <div className="mt-4 pt-5 border-t border-[#F0EDF8] text-center font-mono2 text-[12px] text-[#9AA3B8]">
        业务场景 → 评价维度 → 评测样本 → 结果对比
      </div>
    </div>
  );
}

function OppoMech() {
  const beforeItems: [LucideIcon, string][] = [
    [LayoutGrid, "图标相似"],
    [LayoutGrid, "控件密集"],
    [Crosshair, "像素级位置偏差"],
  ];
  const optSteps: [LucideIcon, string][] = [
    [Camera, "真实软件截图"],
    [Scan, "控件框与功能语义标注"],
    [Brain, "小型 VLM 领域训练"],
    [ShieldCheck, "定位置信度校验"],
  ];
  const afterItems: [LucideIcon, string][] = [
    [Crosshair, "复杂控件定位位置稳定"],
    [CircleCheckBig, "任务中断减少"],
    [TrendingUp, "端到端完成度提升"],
  ];
  return (
    <>
      <div className="grid grid-cols-[1fr_auto_1.4fr_auto_1.15fr] gap-3 items-stretch">
        <div className="rounded-2xl bg-white border border-[#F3D9D9] p-6">
          <div className="font-mono2 text-[12px] text-[#DC2626]">Before · 通用 VLM</div>
          <div className="mt-5 space-y-4">
            {beforeItems.map(([Icon, t]) => (
              <div key={t} className="flex items-center gap-2.5 text-[12.5px] text-[#55607A]">
                <Icon size={16} className="text-[#DC2626]/70 shrink-0" />
                {t}
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-[#F3D9D9] text-[13px] font-bold text-[#DC2626]">
            定位不稳定
          </div>
        </div>
        <div className="self-center text-[#4A54E2] text-xl">→</div>
        <div className="rounded-2xl bg-[#F4F3FB] border border-[#CFC9FF] p-6">
          <div className="font-mono2 text-[12px] text-[#4A54E2]">Domain Optimization</div>
          <div className="mt-5 flex items-center justify-between gap-1">
            {optSteps.map(([Icon, t], i) => (
              <div key={t} className="flex items-center gap-1">
                <div className="flex flex-col items-center w-[88px]">
                  <div className="w-11 h-11 rounded-lg bg-white border border-[#E2DEF0] flex items-center justify-center text-[#4A54E2]">
                    <Icon size={19} strokeWidth={1.8} />
                  </div>
                  <div className="mt-2 text-[11px] text-[#55607A] text-center leading-snug">
                    {t}
                  </div>
                </div>
                {i < optSteps.length - 1 && (
                  <span className="text-[#4A54E2] text-sm -mt-6">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="self-center text-[#4A54E2] text-xl">→</div>
        <div className="rounded-2xl bg-white border-2 border-[#4A54E2]/50 p-6 shadow-[0_20px_40px_-18px_rgba(74,84,226,0.25)]">
          <div className="font-mono2 text-[13px] font-bold text-[#4A54E2]">After · 结论</div>
          <div className="mt-5 space-y-4">
            {afterItems.map(([Icon, t]) => (
              <div key={t} className="flex items-center gap-3 text-[15px] font-semibold text-[#101A30]">
                <Icon size={19} className="text-[#4A54E2] shrink-0" />
                {t}
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-[#F0EDF8] grid grid-cols-3 divide-x divide-[#F0EDF8]">
            {[
              ["87%", "端到端完成率"],
              ["12s→6s", "单用例耗时"],
              ["120+", "自动化用例"],
            ].map(([v, l]) => (
              <div key={l} className="px-3 first:pl-0 last:pr-0 text-center">
                <div className="font-mono2 text-[19px] font-bold text-[#4A54E2]">{v}</div>
                <div className="text-[11px] text-[#9AA3B8] mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 rounded-xl border border-[#CFC9FF] bg-[#F4F3FB] px-8 py-4 text-center text-[13.5px] text-[#4A54E2]">
        ★ 不是所有步骤都需要视觉理解：先判断可否 Skill 化，再决定是否调用 VLM。
      </div>
    </>
  );
}

function TclMech() {
  const sources: [LucideIcon, string][] = [
    [Landmark, "海关 /\n政府官网"],
    [ShieldCheck, "税务与\n贸易机构"],
    [Newspaper, "权威贸易媒体"],
  ];
  return (
    <>
      <div className="grid grid-cols-[1fr_auto_1.3fr] gap-5 items-stretch">
        {/* V1：文档堆 + 告警 */}
        <div className="rounded-2xl bg-white border border-[#E2DEF0] p-7">
          <div className="font-mono2 text-[13px] font-bold text-[#4A54E2]">V1 · 全网抓取</div>
          <div className="relative h-[104px] mt-5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute left-1/2 top-1 w-[120px] h-[86px] rounded-lg bg-[#FAFAF7] border border-[#E8E4DA] shadow-[0_8px_18px_-10px_rgba(16,26,48,0.2)]"
                style={{
                  transform: `translateX(calc(-50% + ${(i - 1) * 34}px)) rotate(${(i - 1) * 7}deg)`,
                  zIndex: i,
                }}
              >
                <div className="p-3 space-y-1.5">
                  {[76, 60, 68, 48].map((w, j) => (
                    <div key={j} className="h-1.5 rounded bg-[#E4E1D8]" style={{ width: w }} />
                  ))}
                </div>
                {i === 2 && (
                  <TriangleAlert size={18} className="absolute -right-2 -bottom-2 text-[#DC2626] bg-white rounded-full" />
                )}
              </div>
            ))}
          </div>
          <ul className="mt-5 space-y-2.5 text-[13px] text-[#55607A] list-disc pl-5">
            <li>页面数量过多</li>
            <li>重复与过期信息混入</li>
            <li>噪声导致结果失真</li>
          </ul>
        </div>
        <div className="self-center flex flex-col items-center gap-3 px-2">
          <span className="text-[#4A54E2] text-2xl">→</span>
          <p className="text-[13px] font-semibold text-[#101A30] text-center leading-relaxed max-w-[180px]">
            覆盖率不是唯一目标，可信度决定结果能否进入业务决策。
          </p>
        </div>
        {/* V2：三个来源卡 + 要点 */}
        <div className="rounded-2xl bg-white border-2 border-[#4A54E2]/40 p-7">
          <div className="font-mono2 text-[13px] font-bold text-[#4A54E2]">V2 · 白名单优先</div>
          <div className="grid grid-cols-3 gap-3 mt-5">
            {sources.map(([Icon, t]) => (
              <div
                key={t}
                className="rounded-xl border border-[#E2DEF0] border-t-[3px] border-t-[#4A54E2] bg-[#FAFAFF] px-3 py-4 flex flex-col items-center gap-2.5 text-center"
              >
                <Icon size={22} strokeWidth={1.8} className="text-[#4A54E2]" />
                <span className="text-[12px] font-bold text-[#101A30] leading-snug whitespace-pre-line">
                  {t}
                </span>
              </div>
            ))}
          </div>
          <ul className="mt-5 space-y-2.5 text-[13px] text-[#101A30] list-disc pl-5">
            <li>官方来源优先抓取</li>
            <li>按来源可信度排序</li>
            <li>输出结果绑定证据</li>
          </ul>
        </div>
      </div>
    </>
  );
}

function HospitalMech() {
  const mechs: [LucideIcon, string, string][] = [
    [Stethoscope, "角色专业化", "临床、病理、编码与规则从不同视角独立判断"],
    [Share2, "证据路径注入", "将知识图谱 Top-3 关键路径注入讨论，连接症状、检查与历史诊断"],
    [FileCog, "规则可执行化", "将 10+ 条高频业务规则转译为 Prompt 约束，并接入场景词表与 RAG"],
  ];
  return (
    <div className="grid grid-cols-3 divide-x divide-[#E2DEF0]">
      {mechs.map(([Icon, t, d]) => (
        <div key={t} className="px-9 first:pl-0 last:pr-0">
          <div className="w-12 h-12 rounded-xl bg-[#F4F3FB] border border-[#E2DEF0] flex items-center justify-center text-[#4A54E2]">
            <Icon size={22} strokeWidth={1.8} />
          </div>
          <div className="mt-4 text-[16px] font-bold text-[#101A30]">{t}</div>
          <div className="w-8 h-0.5 bg-[#4A54E2] mt-2.5" />
          <p className="mt-3.5 text-[13px] text-[#55607A] leading-relaxed">{d}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------- 04 / 各 case 结果段（按截图） ---------- */

function MetricRow({ c, cols }: { c: CaseData; cols?: string }) {
  return (
    <div className={`grid ${cols ?? "grid-cols-3"} divide-x divide-[#E2DEF0]`}>
      {c.metrics.map(([v, l, sub]) => (
        <div key={l} className="px-8 first:pl-0 last:pr-0 text-center">
          <div className="flex items-baseline justify-center gap-2">
            {sub && <span className="text-[14px] text-[#55607A]">{l}</span>}
            <span className="font-mono2 text-[34px] font-bold text-[#4A54E2]">{v}</span>
            {!sub && <span className="text-[14px] text-[#55607A]">{l}</span>}
          </div>
          {sub && <div className="text-[11.5px] text-[#9AA3B8] mt-1.5">{sub}</div>}
        </div>
      ))}
    </div>
  );
}

function ZhipuResult({ c }: { c: CaseData }) {
  const rows: [LucideIcon, string, string][] = [
    [Target, "模型选型", "横向对比质量、性能与成本"],
    [CircleCheckBig, "版本回归", "识别能力变化与异常退化"],
    [ShieldCheck, "上线验收", "按场景标准完成产品验收"],
  ];
  return (
    <>
      <div className="kicker">04 / 输出与价值</div>
      <h2 className="font-display text-4xl mt-4 text-[#101A30]">
        让评测结果，真正进入产品决策
      </h2>
      <div className="grid grid-cols-2 gap-10 mt-10 items-center">
        <div className="paper-card p-8">
          <div className="font-mono2 text-[11px] tracking-widest text-[#9AA3B8]">
            DECISION OUTPUT
          </div>
          <div className="mt-4 space-y-4">
            {rows.map(([Icon, t, d]) => (
              <div key={t} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#F4F3FB] border border-[#E2DEF0] flex items-center justify-center text-[#4A54E2] shrink-0">
                  <Icon size={18} strokeWidth={1.8} />
                </div>
                <div>
                  <span className="text-[14.5px] font-bold text-[#101A30]">{t}</span>
                  <span className="text-[13px] text-[#55607A] ml-3">{d}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-[#F0EDF8] font-mono2 text-[11px] text-[#9AA3B8]">
            DEMO / 脱敏展示
          </div>
        </div>
        <div>
          <MetricRow c={c} />
          <div className="mt-10 text-center text-[16px] font-medium text-[#101A30]">
            业务问题 <span className="text-[#4A54E2]">→</span> 可执行评测{" "}
            <span className="text-[#4A54E2]">→</span>{" "}
            <span className="text-[#DC2626]">产品决策</span>
          </div>
        </div>
      </div>
    </>
  );
}

function OppoResult({ c }: { c: CaseData }) {
  return (
    <>
      <div className="kicker">04 / 结果</div>
      <div className="mt-10">
        <MetricRow c={c} />
      </div>
      <p className="text-center text-[13.5px] text-[#55607A] mt-10">
        覆盖 2000+ 全量回归用例池中的高频重复场景
      </p>
      <p className="text-center font-mono2 text-[11px] text-[#9AA3B8] mt-3">
        Demo data / 脱敏展示
      </p>
    </>
  );
}

function TclResult({ c }: { c: CaseData }) {
  return (
    <>
      <div className="kicker">04 / 结果</div>
      <div className="mt-10">
        <MetricRow c={c} />
      </div>
      <div className="mt-10 text-center text-[17px] font-bold text-[#101A30]">
        政策变化 <span className="text-[#4A54E2]">→</span> 影响价值{" "}
        <span className="text-[#4A54E2]">→</span> 库存与出货调整
      </div>
      <div className="mt-8 max-w-[620px] mx-auto rounded-xl border border-dashed border-[#B9B2E8] px-8 py-3.5 text-center font-mono2 text-[12.5px] text-[#4A54E2]">
        标准文件　·　证据卡片　·　阈值告警
      </div>
    </>
  );
}

function HospitalResult({ c }: { c: CaseData }) {
  return (
    <>
      <div className="kicker">04 / 结果</div>
      <h2 className="font-display text-4xl mt-4 text-[#101A30]">
        效果提升，同时保留复盘依据
      </h2>
      <div className="mt-10 max-w-[720px] mx-auto">
        <MetricRow c={c} cols="grid-cols-2" />
      </div>
      <div className="mt-8 max-w-[720px] mx-auto rounded-xl bg-[#F4F3FB] px-8 py-4 flex items-center justify-center gap-3 text-[13.5px] text-[#101A30]">
        <ChartColumn size={16} className="text-[#4A54E2]" />
        较最佳单模型： 准确率 <strong className="text-[#4A54E2]">+6%</strong> · 召回率{" "}
        <strong className="text-[#4A54E2]">+3%</strong>
      </div>
      <div className="mt-4 max-w-[720px] mx-auto rounded-xl bg-[#F4F3FB] px-8 py-4 flex items-center justify-center gap-3 text-[13.5px] text-[#101A30]">
        <RefreshCcw size={15} className="text-[#4A54E2]" />
        场景 <span className="text-[#4A54E2]">→</span> 模板{" "}
        <span className="text-[#4A54E2]">→</span> 评测{" "}
        <span className="text-[#4A54E2]">→</span> 迭代
      </div>
      <p className="text-center font-mono2 text-[11px] text-[#9AA3B8] mt-8">
        DEMO DATA / 脱敏展示
      </p>
    </>
  );
}

/* ---------- 映射表 ---------- */

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
const RESULTS: Record<string, React.ComponentType<{ c: CaseData }>> = {
  zhipu: ZhipuResult,
  oppo: OppoResult,
  tcl: TclResult,
  hospital: HospitalResult,
};
const S2_META: Record<string, [string, string]> = {
  zhipu: ["02 / 评测系统", "从业务问题，到产品决策的自动化闭环"],
  oppo: ["02 / Agent 自动化架构", "Host Agent 负责编排，App Agent 负责把任务做完"],
  tcl: ["02 / Agent 工作流", "从政策变化，到业务影响的自动化闭环"],
  hospital: ["02 / Multi-Agent 系统", "让分歧被发现、讨论并收敛"],
};
const S3_META: Record<string, [string, string]> = {
  zhipu: ["03 / 自定义评测目标", "围绕真实产品场景，定义“什么是好”"],
  oppo: ["03 / 关键难点", "通用多模态模型看得到界面，却点不准控件"],
  tcl: ["03 / 关键迭代", "从“抓得更多”，转向“信得过的来源”"],
  hospital: ["03 / 关键机制", "不是简单投票，而是基于证据收敛"],
};
const PAIN_ICONS: Record<string, LucideIcon[]> = {
  zhipu: [Puzzle, Terminal, TriangleAlert],
  oppo: [RefreshCcw, Link2, Crosshair],
  tcl: [FileClock, Globe, TriangleAlert],
  hospital: [FileText, MessageSquare, UserCheck],
};

/* ---------- 页面 ---------- */

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // 切换到下一个 case 时回到页面最上方
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [id]);
  const c = cases.find((x) => x.id === id);
  if (!c)
    return (
      <div className="min-h-screen bg-white">
        <SiteNav active="cases" />
        <div className="pt-40 text-center text-[#55607A]">CASE 不存在</div>
      </div>
    );
  const System = SYSTEMS[c.id];
  const Mech = MECHS[c.id];
  const Result = RESULTS[c.id];
  const painIcons = PAIN_ICONS[c.id];
  const idx = cases.findIndex((x) => x.id === c.id);
  const next = cases[(idx + 1) % cases.length];

  return (
    <div className="min-h-screen bg-white">
      <SiteNav active="cases" />

      {/* 头部 + 悬浮卡片 */}
      <section className="relative pt-36 pb-14 overflow-hidden">
        <div className="glow glow-violet w-[700px] h-[420px] -top-40 right-[-100px]" />
        <div className="max-w-[1280px] mx-auto px-10 grid grid-cols-12 gap-10">
          <div className={c.runCard ? "col-span-7" : "col-span-12"}>
            <Reveal>
              <div className="kicker">{c.headerTag}</div>
              <h1 className="font-display text-[52px] leading-[1.3] mt-5 text-[#101A30]">
                {c.title.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </h1>
              <p className="text-[15px] text-[#55607A] leading-[1.8] mt-5 max-w-[560px]">
                {c.subtitle}
              </p>
              {c.caps && (
                <div className="font-mono2 text-[13px] text-[#4A54E2] mt-4">{c.caps}</div>
              )}
            </Reveal>
          </div>
          {c.runCard && (
            <div className="col-span-5 relative">
              <Reveal delay={150}>
                <div className="relative paper-card p-7 !shadow-[0_40px_80px_-24px_rgba(74,84,226,0.22)]">
                  <div className="flex items-center justify-between">
                    <span className="font-mono2 text-[11px] tracking-widest text-[#9AA3B8]">
                      {c.runCard.label}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#E3E0FF] text-[#4A54E2] text-[11px]">
                      {c.runCard.status}
                    </span>
                  </div>
                  {c.runCard.roles && (
                    <div className="grid grid-cols-4 gap-2 mt-5">
                      {c.runCard.roles.map((r, ri) => {
                        const RoleIcon = [Stethoscope, Brain, UserCheck, FileText][ri];
                        return (
                          <div key={r} className="flex flex-col items-center gap-1.5">
                            <div className="w-10 h-10 rounded-full bg-[#F4F3FB] border border-[#E2DEF0] flex items-center justify-center text-[#4A54E2]">
                              <RoleIcon size={17} strokeWidth={1.8} />
                            </div>
                            <span className="text-[11px] text-[#55607A]">{r}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {c.runCard.main && (
                    <div className="mt-4 pl-4 border-l-4 border-[#4A54E2]">
                      <p className="text-[15px] font-bold text-[#101A30]">● {c.runCard.main}</p>
                      <p className="text-[12px] text-[#55607A] mt-1">{c.runCard.mainSub}</p>
                    </div>
                  )}
                  <div className="mt-5 space-y-2.5 border-t border-[#F0EDF8] pt-4">
                    {c.runCard.rows.map(([k, v]) => (
                      <div key={k} className="flex justify-between text-[12px]">
                        <span className="text-[#9AA3B8]">{k}</span>
                        <span className="font-mono2 text-[#101A30]">{v}</span>
                      </div>
                    ))}
                  </div>
                  {c.runCard.foot && (
                    <div className="mt-4 pt-4 border-t border-[#F0EDF8] text-[12px] text-[#55607A]">
                      {c.runCard.foot.split("｜").map((seg, i) => (
                        <span key={seg} className={i === 0 ? "font-bold text-[#101A30] block" : "block mt-1"}>
                          {seg}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="text-right text-[13px] text-[#4A54E2] mt-4">
                    {c.runCard.cta}
                  </div>
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </section>

      {/* 指标条 */}
      <section className="border-t border-b border-[#E2DEF0] py-9">
        <div className="max-w-[1080px] mx-auto px-10">
          <MetricRow c={c} cols={c.id === "hospital" ? "grid-cols-3" : undefined} />
        </div>
      </section>

      {/* 01 背景 */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-10">
          <Reveal>
            <div className="kicker">{c.s1Label}</div>
            <h2 className="font-display text-4xl mt-4 text-[#101A30]">{c.s1Title}</h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid grid-cols-3 divide-x divide-[#E2DEF0] mt-12">
              {c.pains.map((p, i) => {
                const Icon = painIcons[i];
                const lines = Array.isArray(p) ? p : [p];
                return (
                  <div key={i} className="flex items-center gap-4 px-9 first:pl-0 last:pr-0">
                    <div className="w-12 h-12 rounded-full bg-[#F4F3FB] border border-[#E2DEF0] flex items-center justify-center text-[#4A54E2] shrink-0">
                      <Icon size={21} strokeWidth={1.8} />
                    </div>
                    <p className="text-[15px] font-semibold text-[#101A30] leading-relaxed">
                      {lines[0]}
                      {lines[1] && (
                        <>
                          <br />
                          {lines[1]}
                        </>
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="flex items-center gap-6 mt-14">
              <div className="flex-1 border-t border-[#C7CBE0]" />
              <span className="text-[15.5px] text-[#4A54E2] whitespace-nowrap">{c.goal}</span>
              <div className="flex-1 border-t border-[#C7CBE0] relative">
                {c.id === "tcl" && (
                  <span className="absolute right-0 -top-[13px] text-[#4A54E2] text-lg">→</span>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 02 系统 */}
      <section className="py-20 border-t border-[#E2DEF0]">
        <div className="max-w-[1280px] mx-auto px-10">
          <Reveal>
            <div className="kicker">{S2_META[c.id][0]}</div>
            <h2 className="font-display text-4xl mt-4 text-[#101A30]">{S2_META[c.id][1]}</h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="mt-12">
              <System />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 03 机制 */}
      <section className="py-20 border-t border-[#E2DEF0]">
        <div className="max-w-[1280px] mx-auto px-10">
          <Reveal>
            <div className="kicker">{S3_META[c.id][0]}</div>
            <h2 className="font-display text-4xl mt-4 text-[#101A30]">{S3_META[c.id][1]}</h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="mt-12">
              <Mech />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 04 结果 */}
      <section className="py-20 border-t border-[#E2DEF0]">
        <div className="max-w-[1280px] mx-auto px-10">
          <Reveal>
            <Result c={c} />
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
