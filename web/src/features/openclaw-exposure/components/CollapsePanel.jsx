import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function CollapsePanel({ title, children, defaultOpen = true, extra, onOpenChange }) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open]);

  return (
    <div className="oc-panel">
      <button
        type="button"
        className="oc-panel-header"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <div className="oc-panel-title">
          <span className="oc-panel-indicator" />
          <span>{title}</span>
        </div>
        <div className="oc-panel-header-right">
          {extra ? <div onClick={(event) => event.stopPropagation()}>{extra}</div> : null}
          <ChevronDown
            size={16}
            strokeWidth={2}
            className="oc-panel-chevron"
            style={{ transform: open ? "rotate(0deg)" : "rotate(-90deg)" }}
          />
        </div>
      </button>
      {open ? <div className="oc-panel-body">{children}</div> : null}
    </div>
  );
}
