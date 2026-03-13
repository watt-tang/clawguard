import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export default function Pagination({
  currentPage,
  pageSize,
  pageSizeOptions,
  total,
  totalPages,
  pageList,
  onPageChange,
  onPageSizeChange,
}) {
  const [jumpValue, setJumpValue] = useState(String(currentPage));

  useEffect(() => {
    setJumpValue(String(currentPage));
  }, [currentPage]);

  const submitJump = () => {
    const nextPage = Number(jumpValue);
    if (!Number.isFinite(nextPage)) {
      setJumpValue(String(currentPage));
      return;
    }

    const safePage = Math.min(Math.max(1, Math.floor(nextPage)), totalPages);
    onPageChange(safePage);
    setJumpValue(String(safePage));
  };

  return (
    <footer className="flex flex-col gap-4 rounded-[26px] border border-[rgba(126,12,110,0.10)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(249,245,250,0.90))] px-5 py-5 shadow-[0_18px_44px_rgba(36,24,39,0.05)] xl:flex-row xl:items-center xl:justify-between">
      <div className="text-sm text-slate-500">
        共 <span className="font-semibold text-slate-800">{total.toLocaleString("zh-CN")}</span> 条记录，
        当前显示第 <span className="font-semibold text-[rgb(126,12,110)]">{currentPage}</span> /
        <span className="font-semibold text-slate-800"> {totalPages} </span> 页
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <PageArrow
            disabled={currentPage === 1}
            icon={ChevronLeft}
            label="上一页"
            onClick={() => onPageChange(currentPage - 1)}
          />

          {pageList.map((pageNumber, index) => {
            const previousPage = pageList[index - 1];
            const needGap = previousPage && pageNumber - previousPage > 1;

            return (
              <div key={pageNumber} className="flex items-center gap-2">
                {needGap ? (
                  <span className="inline-flex h-10 items-center px-1 text-slate-400">
                    <MoreHorizontal size={16} />
                  </span>
                ) : null}
                <button
                  className={`inline-flex h-10 min-w-10 items-center justify-center rounded-2xl border px-3 text-sm font-semibold transition ${
                    currentPage === pageNumber
                      ? "border-[rgb(126,12,110)] bg-[rgb(126,12,110)] text-white shadow-[0_10px_28px_rgba(126,12,110,0.28)]"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[rgba(126,12,110,0.24)] hover:text-[rgb(126,12,110)]"
                  }`}
                  onClick={() => onPageChange(pageNumber)}
                  type="button"
                >
                  {pageNumber}
                </button>
              </div>
            );
          })}

          <PageArrow
            disabled={currentPage === totalPages}
            icon={ChevronRight}
            label="下一页"
            onClick={() => onPageChange(currentPage + 1)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
            每页
            <select
              className="rounded-xl border-0 bg-transparent pr-6 font-semibold text-slate-800 outline-none"
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              value={pageSize}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            条
          </label>

          <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
            <span>跳至</span>
            <input
              className="h-9 w-20 rounded-xl border border-slate-200 px-3 text-center font-semibold text-slate-800 outline-none transition focus:border-[rgb(126,12,110)]"
              inputMode="numeric"
              onChange={(event) => setJumpValue(event.target.value.replace(/[^\d]/g, ""))}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  submitJump();
                }
              }}
              value={jumpValue}
            />
            <button
              className="inline-flex h-9 items-center justify-center rounded-xl bg-[rgba(126,12,110,0.10)] px-4 font-semibold text-[rgb(126,12,110)] transition hover:bg-[rgba(126,12,110,0.16)]"
              onClick={submitJump}
              type="button"
            >
              前往
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function PageArrow({ disabled, icon: Icon, label, onClick }) {
  return (
    <button
      className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-[rgba(126,12,110,0.24)] hover:text-[rgb(126,12,110)] disabled:cursor-not-allowed disabled:opacity-45"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <Icon size={16} />
      {label}
    </button>
  );
}
