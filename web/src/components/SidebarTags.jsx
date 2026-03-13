import { useState } from "react";

const TAG_GROUPS = [
  {
    title: "快捷视图",
    items: ["实时监测", "重点暴露", "最新发现"],
  },
  {
    title: "资产分类",
    items: ["校园节点", "公网资产", "边界服务"],
  },
];

export default function SidebarTags() {
  const [activeTag, setActiveTag] = useState("实时监测");

  return (
    <section className="rounded-[22px] border border-[rgba(126,12,110,0.10)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(247,249,252,0.92))] p-3 shadow-[0_10px_26px_rgba(35,24,39,0.04)]">
      <div className="text-[11px] font-bold tracking-[0.16em] text-[rgb(126,12,110)]">标签化入口</div>
      <div className="mt-1 text-[11px] text-slate-400">静态交互，后续可绑定真实筛选逻辑</div>

      <div className="mt-4 space-y-4">
        {TAG_GROUPS.map((group) => (
          <div key={group.title}>
            <div className="mb-2 text-[11px] font-semibold tracking-[0.12em] text-slate-400">{group.title}</div>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => {
                const isActive = activeTag === item;

                return (
                  <button
                    key={item}
                    className={`rounded-full border px-3 py-2 text-xs font-medium transition ${
                      isActive
                        ? "border-[rgba(126,12,110,0.22)] bg-[rgb(126,12,110)] text-white shadow-[0_10px_24px_rgba(126,12,110,0.22)]"
                        : "border-transparent bg-slate-100 text-slate-600 hover:-translate-y-0.5 hover:border-[rgba(126,12,110,0.14)] hover:bg-[rgba(126,12,110,0.08)] hover:text-[rgb(126,12,110)]"
                    }`}
                    onClick={() => setActiveTag(item)}
                    type="button"
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
