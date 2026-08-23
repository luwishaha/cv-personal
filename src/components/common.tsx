import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([e]) => e.isIntersecting && setOn(true),
      { threshold: 0.15 },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`reveal ${on ? "on" : ""} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function PerspectiveFloor() {
  return (
    <div className="perspective-floor">
      <svg viewBox="0 0 1440 430" preserveAspectRatio="none">
        {[100, 175, 265, 380].map((y, i) => (
          <line
            key={y}
            x1={i === 3 ? 0 : 240 - i * 80 - (i === 0 ? 0 : 0)}
            y1={y}
            x2={i === 3 ? 1440 : 1200 + i * 80}
            y2={y}
            stroke={i === 3 ? "#CFC8E8" : "#DCD6EF"}
            strokeWidth="1"
          />
        ))}
        {[0, 288, 576, 864, 1152, 1440].map((x) => (
          <line
            key={x}
            x1={x}
            y1={430}
            x2={720}
            y2={40}
            stroke="#DCD6EF"
            strokeWidth="1"
          />
        ))}
      </svg>
    </div>
  );
}

export function SiteNav({ active }: { active: string }) {
  const loc = useLocation();
  const item = (key: string, label: string, to: string) => (
    <Link
      key={key}
      to={to}
      className={`transition-colors ${
        active === key ? "text-[#4A54E2]" : "text-[#55607A] hover:text-[#101A30]"
      }`}
    >
      {label}
    </Link>
  );
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#F5F4EF]/80 border-b border-[#E2DEF0]/60">
      <div className="max-w-[1440px] mx-auto px-10 h-16 flex items-center justify-between">
        <Link to="/" className="font-mono2 text-sm text-[#101A30] tracking-wider">
          <span className="text-[#4A54E2] font-bold">LZY</span>.PORTFOLIO
        </Link>
        <nav className="font-mono2 text-[13px] flex items-center gap-8">
          {item("home", "首页", "/")}
          {item("cases", "CASE", "/cases")}
          {item("experience", "经历", "/experience")}
          {item("askme", "ASK ME", "/askme")}
        </nav>
        <Link
          to="/admin"
          className="text-[13px] px-4 py-2 rounded-full bg-white border border-[#E2DEF0] text-[#101A30] hover:border-[#4A54E2] hover:text-[#4A54E2] transition-colors"
          state={{ from: loc.pathname }}
        >
          管理后台 ⚿
        </Link>
      </div>
    </header>
  );
}
