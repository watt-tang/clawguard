import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * 可折叠分块容器
 * 与现有 workspace-panel 风格保持一致，但使用不同的色彩体系
 *
 * @param {string}    title       标题
 * @param {React.ReactNode} children 内容
 * @param {boolean}   defaultOpen 默认展开状态，默认 true
 * @param {React.ReactNode} extra  标题右侧额外内容（可选）
 */
export default function CollapsePanel({ title, children, defaultOpen = true, extra }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="oc-panel">
      <button
        type="button"
        className="oc-panel-header"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="oc-panel-title">
          <span className="oc-panel-indicator" />
          <span>{title}</span>
        </div>
        <div className="oc-panel-header-right">
          {extra && <div onClick={(e) => e.stopPropagation()}>{extra}</div>}
          <ChevronDown
            size={16}
            strokeWidth={2}
            className="oc-panel-chevron"
            style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}
          />
        </div>
      </button>
      {open && <div className="oc-panel-body">{children}</div>}
    </div>
  );
}
