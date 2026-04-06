import { useEffect, useRef, useState } from "react";
import { CornerDownLeft, LoaderCircle, Search, X } from "lucide-react";
import { getPageMeta, searchAppContent } from "../search/globalSearch.js";

const SEARCH_DELAY_MS = 180;

export default function GlobalSearchBar({ modules, onNavigate }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setError("");
      setIsLoading(false);
      setActiveIndex(0);
      return undefined;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true);
      setError("");

      try {
        const nextResults = await searchAppContent(trimmed, modules);
        if (cancelled) return;
        setResults(nextResults);
        setActiveIndex(0);
      } catch (searchError) {
        if (cancelled) return;
        setResults([]);
        setError(searchError instanceof Error ? searchError.message : "搜索失败，请稍后重试");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }, SEARCH_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [modules, query]);

  function commitSelection(item) {
    if (!item) return;
    onNavigate(item.pageId);
    setIsOpen(false);
    setQuery("");
    setResults([]);
    setError("");
    setActiveIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleKeyDown(event) {
    if (!isOpen && event.key === "ArrowDown" && results.length) {
      event.preventDefault();
      setIsOpen(true);
      return;
    }

    if (event.key === "ArrowDown" && results.length) {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % results.length);
      return;
    }

    if (event.key === "ArrowUp" && results.length) {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + results.length) % results.length);
      return;
    }

    if (event.key === "Enter") {
      if (results.length) {
        event.preventDefault();
        commitSelection(results[activeIndex] || results[0]);
      }
      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  const showPanel = isOpen && (query.trim() || isLoading || error);

  return (
    <div className="global-search" ref={rootRef}>
      <label className={`global-search-shell${showPanel ? " is-open" : ""}`}>
        <Search size={15} className="global-search-icon" />
        <input
          className="global-search-input"
          type="text"
          value={query}
          placeholder="聚合搜索产品、漏洞、论文、Skill 情报"
          onFocus={() => setIsOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          aria-label="聚合搜索"
        />
        {query ? (
          <button
            type="button"
            className="global-search-clear"
            onClick={() => {
              setQuery("");
              setResults([]);
              setError("");
              setActiveIndex(0);
            }}
            aria-label="清空搜索"
          >
            <X size={14} />
          </button>
        ) : null}
      </label>

      {showPanel ? (
        <div className="global-search-panel">
          <div className="global-search-panel-head">
            <span>跨模块聚合搜索</span>
            <span>{isLoading ? "检索中..." : `结果 ${results.length} 条`}</span>
          </div>

          {isLoading ? (
            <div className="global-search-state">
              <LoaderCircle size={16} className="global-search-spin" />
              <span>正在整理前端已展示的信息...</span>
            </div>
          ) : null}

          {!isLoading && error ? <div className="global-search-state is-error">{error}</div> : null}

          {!isLoading && !error && query.trim() && !results.length ? (
            <div className="global-search-state">没有命中内容，可以换个关键词试试。</div>
          ) : null}

          {!isLoading && results.length ? (
            <div className="global-search-result-list" role="listbox" aria-label="聚合搜索结果">
              {results.map((item, index) => {
                const pageMeta = getPageMeta(item.pageId);
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`global-search-result${index === activeIndex ? " is-active" : ""}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => commitSelection(item)}
                  >
                    <div className="global-search-result-top">
                      <strong>{item.title}</strong>
                      <span>{item.section}</span>
                    </div>
                    <div className="global-search-result-sub">{item.subtitle}</div>
                    <div className="global-search-result-meta">
                      <span>{pageMeta.label}</span>
                      <span>{item.intent}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : null}

          {!isLoading && results.length ? (
            <div className="global-search-tip">
              <CornerDownLeft size={13} />
              <span>回车直达当前高亮结果</span>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
