import { useState, useMemo, useCallback } from 'react';
import { Search, Download, LogIn, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { maskIp, maskField } from '../utils/ipMask.js';
import { buildCsvContent, downloadCsv } from '../services/dataService.js';
import { PAGE_SIZE_OPTIONS } from '../config.js';

// ─── 字段格式化层 ───────────────────────────────────────────────────────────────
// 所有脱敏判断集中在此，不散落到单元格

function formatRow(row, isLoggedIn) {
  const scope = row.scope ?? '';
  const isDomestic = scope.includes('境内') || scope.includes('国内');
  return {
    ip: isLoggedIn ? (row.ip ?? '-') : maskIp(row.ip ?? ''),
    host: row.host ?? '-',
    service: row.service ?? row.serviceDesc ?? '-',
    location: row.location ?? '-',
    city: isLoggedIn ? (row.city ?? row.location ?? '-') : maskField(row.city),
    isp: isLoggedIn ? (row.isp ?? row.asn ?? '-') : maskField(row.isp ?? row.asn),
    vendor: row.vendor ?? '-',
    status: row.status ?? '-',
    scopeLabel: scope || '-',
    isDomestic,
    domesticLocation: isDomestic ? (isLoggedIn ? (row.location ?? '-') : maskField(row.location)) : '-',
    version: row.version ?? '-',
    risk: row.risk ?? '-',
    lastSeen: row.lastSeen ?? row.lastSnapshot ?? '-',
  };
}

// ─── 分页组件 ──────────────────────────────────────────────────────────────────

function TablePager({ page, pageSize, total, onPage, onPageSize }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  // 生成页码序列（最多显示 7 页）
  const pageNums = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const nums = new Set([1, totalPages, page]);
    for (let d = -2; d <= 2; d++) {
      const n = page + d;
      if (n >= 1 && n <= totalPages) nums.add(n);
    }
    return Array.from(nums).sort((a, b) => a - b);
  }, [page, totalPages]);

  return (
    <div className="oc-pager">
      <span className="oc-pager-info">
        共 {total.toLocaleString('zh-CN')} 条，第 {page}/{totalPages} 页
      </span>
      <div className="oc-pager-controls">
        <button
          className="oc-pager-btn"
          type="button"
          disabled={!canPrev}
          onClick={() => onPage(page - 1)}
          aria-label="上一页"
        >
          <ChevronLeft size={14} />
        </button>

        {pageNums.map((n, i) => {
          const prev = pageNums[i - 1];
          const gap = prev && n - prev > 1;
          return (
            <span key={n} className="oc-pager-pages">
              {gap && <span className="oc-pager-ellipsis">…</span>}
              <button
                type="button"
                className={`oc-pager-btn${n === page ? ' is-active' : ''}`}
                onClick={() => onPage(n)}
              >
                {n}
              </button>
            </span>
          );
        })}

        <button
          className="oc-pager-btn"
          type="button"
          disabled={!canNext}
          onClick={() => onPage(page + 1)}
          aria-label="下一页"
        >
          <ChevronRight size={14} />
        </button>

        <select
          className="oc-select"
          value={pageSize}
          onChange={(e) => { onPageSize(Number(e.target.value)); onPage(1); }}
          aria-label="每页条数"
        >
          {PAGE_SIZE_OPTIONS.map((s) => (
            <option key={s} value={s}>{s} 条/页</option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ─── 登录弹窗 ──────────────────────────────────────────────────────────────────

function LoginModal({ onLogin, onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = onLogin(username, password);
    if (!result.ok) setError(result.message);
  };

  return (
    <div className="oc-modal-overlay" onClick={onClose}>
      <div className="oc-modal" onClick={(e) => e.stopPropagation()}>
        <div className="oc-modal-title">登录以查看完整数据</div>
        <p className="oc-modal-desc">登录后可查看真实 IP、城市、运营商，并使用搜索和下载功能。</p>
        <form onSubmit={handleSubmit} className="oc-modal-form">
          <input
            className="oc-input"
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <input
            type="password"
            className="oc-input"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="oc-modal-error">{error}</div>}
          <button type="submit" className="oc-primary-btn">登录</button>
        </form>
      </div>
    </div>
  );
}

// ─── 主表格组件 ────────────────────────────────────────────────────────────────

const COLS = [
  { key: 'ip',              label: 'IP 地址',     width: '140px', mono: true },
  { key: 'host',            label: '主机名',       width: '90px'  },
  { key: 'service',         label: '端口 / 服务', width: '150px' },
  { key: 'location',        label: '地理位置',     width: '110px' },
  { key: 'city',            label: '城市',         width: '80px'  },
  { key: 'isp',             label: '运营商',       width: '100px', mono: true },
  { key: 'vendor',          label: '厂商',         width: '80px'  },
  { key: 'status',          label: '运行状态',     width: '90px'  },
  { key: 'scopeLabel',      label: '境内实例',     width: '90px'  },
  { key: 'domesticLocation',label: '境内位置',     width: '100px' },
  { key: 'version',         label: '版本号',       width: '110px', mono: true },
  { key: 'risk',            label: '历史漏洞关联', width: '120px' },
  { key: 'lastSeen',        label: '最后发现时间', width: '130px', mono: true },
];

/**
 * 暴露服务详情表格
 *
 * @param {{ rows: Array, loading: boolean }} props
 * @param {{ isLoggedIn: boolean, user: object, login: Function, logout: Function }} auth
 */
export default function ExposureDetailTable({ rows, loading, auth }) {
  const { isLoggedIn, login, logout } = auth;
  const [showLogin, setShowLogin] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [searchIp, setSearchIp] = useState('');
  const [searchGeo, setSearchGeo] = useState('');
  const [searchVendor, setSearchVendor] = useState('');

  // 筛选逻辑（仅已登录可用）
  const filteredRows = useMemo(() => {
    if (!rows) return [];
    if (!isLoggedIn) return rows;
    return rows.filter((r) => {
      const ipMatch = !searchIp || (r.ip ?? '').includes(searchIp.trim());
      const geoMatch = !searchGeo || (r.location ?? '').includes(searchGeo.trim());
      const vendorMatch = !searchVendor || (r.vendor ?? '-').includes(searchVendor.trim());
      return ipMatch && geoMatch && vendorMatch;
    });
  }, [rows, isLoggedIn, searchIp, searchGeo, searchVendor]);

  // 分页
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  // 搜索变更时回到第一页
  const handleSearch = useCallback(() => setPage(1), []);

  // 下载全部
  const handleDownloadAll = useCallback(() => {
    const content = buildCsvContent(filteredRows, isLoggedIn);
    downloadCsv(content, `openclaw-exposure-${new Date().toISOString().slice(0, 10)}.csv`);
  }, [filteredRows, isLoggedIn]);

  // 下载当前页
  const handleDownloadPage = useCallback(() => {
    const content = buildCsvContent(pageRows, isLoggedIn);
    downloadCsv(content, `openclaw-exposure-page${page}-${new Date().toISOString().slice(0, 10)}.csv`);
  }, [pageRows, isLoggedIn, page]);

  const handleLogin = useCallback(
    (username, password) => {
      const result = login(username, password);
      if (result.ok) setShowLogin(false);
      return result;
    },
    [login]
  );

  return (
    <div className="oc-detail-table-wrap">
      {/* 工具栏 */}
      <div className="oc-table-toolbar">
        {isLoggedIn ? (
          <div className="oc-search-bar">
            <div className="oc-search-group">
              <Search size={13} className="oc-search-icon" />
              <input
                className="oc-input oc-search-input"
                placeholder="搜索 IP"
                value={searchIp}
                onChange={(e) => { setSearchIp(e.target.value); handleSearch(); }}
              />
            </div>
            <div className="oc-search-group">
              <Search size={13} className="oc-search-icon" />
              <input
                className="oc-input oc-search-input"
                placeholder="搜索地理位置"
                value={searchGeo}
                onChange={(e) => { setSearchGeo(e.target.value); handleSearch(); }}
              />
            </div>
            <div className="oc-search-group">
              <Search size={13} className="oc-search-icon" />
              <input
                className="oc-input oc-search-input"
                placeholder="搜索厂商"
                value={searchVendor}
                onChange={(e) => { setSearchVendor(e.target.value); handleSearch(); }}
              />
            </div>
          </div>
        ) : (
          <div className="oc-auth-hint">
            <span>IP、城市、运营商已脱敏。</span>
            <button
              type="button"
              className="oc-link-btn"
              onClick={() => setShowLogin(true)}
            >
              <LogIn size={13} />
              登录查看完整数据
            </button>
          </div>
        )}

        <div className="oc-table-actions">
          {isLoggedIn ? (
            <>
              <button type="button" className="oc-ghost-btn" onClick={handleDownloadPage}>
                <Download size={13} />
                下载当页
              </button>
              <button type="button" className="oc-ghost-btn" onClick={handleDownloadAll}>
                <Download size={13} />
                下载全部
              </button>
              <button type="button" className="oc-ghost-btn" onClick={logout}>
                <LogOut size={13} />
                退出
              </button>
            </>
          ) : (
            <button type="button" className="oc-primary-btn" onClick={() => setShowLogin(true)}>
              <LogIn size={13} />
              登录
            </button>
          )}
        </div>
      </div>

      {/* 表头 */}
      <div className="oc-dt-header" style={{ gridTemplateColumns: COLS.map((c) => c.width).join(' ') }}>
        {COLS.map((c) => (
          <div key={c.key} className="oc-dt-th">{c.label}</div>
        ))}
      </div>

      {/* 表体 */}
      <div className="oc-dt-body">
        {loading && (
          <div className="oc-dt-state">正在加载数据…</div>
        )}
        {!loading && pageRows.length === 0 && (
          <div className="oc-dt-state">
            {filteredRows.length === 0 && (searchIp || searchGeo || searchVendor)
              ? '未找到匹配结果，请调整搜索条件'
              : '暂无数据'}
          </div>
        )}
        {!loading && pageRows.map((row) => {
          const f = formatRow(row, isLoggedIn);
          return (
            <div
              key={row.id ?? row.ip}
              className="oc-dt-row"
              style={{ gridTemplateColumns: COLS.map((c) => c.width).join(' ') }}
            >
              {COLS.map((col) => (
                <div
                  key={col.key}
                  className={`oc-dt-td${col.mono ? ' is-mono' : ''}${f[col.key] === '***' ? ' is-masked' : ''}`}
                >
                  {col.key === 'status' ? (
                    <StatusBadge value={f.status} />
                  ) : col.key === 'scopeLabel' ? (
                    <ScopeBadge value={f.scopeLabel} domestic={f.isDomestic} />
                  ) : (
                    <span title={String(f[col.key])}>{f[col.key]}</span>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* 分页 */}
      {!loading && filteredRows.length > 0 && (
        <TablePager
          page={page}
          pageSize={pageSize}
          total={filteredRows.length}
          onPage={setPage}
          onPageSize={setPageSize}
        />
      )}

      {/* 登录弹窗 */}
      {showLogin && <LoginModal onLogin={handleLogin} onClose={() => setShowLogin(false)} />}
    </div>
  );
}

function StatusBadge({ value }) {
  const cls =
    value === '持续在线' || value === '在线监测'
      ? 'oc-badge oc-badge-online'
      : value === '近期发现' || value === '近期出现'
        ? 'oc-badge oc-badge-recent'
        : 'oc-badge oc-badge-review';
  return <span className={cls}>{value}</span>;
}

function ScopeBadge({ value, domestic }) {
  return (
    <span className={`oc-badge ${domestic ? 'oc-badge-domestic' : 'oc-badge-overseas'}`}>
      {value}
    </span>
  );
}
