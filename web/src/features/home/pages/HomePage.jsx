import { Activity, BarChart2, Clock, Globe, Shield } from "lucide-react";

export default function HomePage() {
  const modules = [
    {
      icon: Globe,
      title: "OpenClaw 公网暴露监测",
      desc: "实时监测 OpenClaw 节点的公网暴露状态，支持全球与境内分布可视化、趋势分析与详情检索。",
      status: "已上线",
      statusOk: true,
    },
    {
      icon: Shield,
      title: "claw系列产品安全总览",
      desc: "聚合安全事件、告警与处置状态，提供 OpenClaw 生态治理态势的全局视图。",
      status: "建设中",
      statusOk: false,
    },
    {
      icon: Activity,
      title: "OpenClaw 风险漏洞追踪",
      desc: "跟踪与 OpenClaw 相关的已知漏洞、CVE 关联情况及修复进度。",
      status: "建设中",
      statusOk: false,
    },
    {
      icon: Shield,
      title: "Skill 生态后门投毒治理",
      desc: "针对 AI Skill 生态的供应链安全监测与后门检测能力。",
      status: "建设中",
      statusOk: false,
    },
    {
      icon: BarChart2,
      title: "OpenClaw 部署安全检测",
      desc: "对 OpenClaw 部署环境的安全配置合规性进行自动化检测。",
      status: "建设中",
      statusOk: false,
    },
  ];

  return (
    <div className="oc-home">
      <div className="oc-home-hero">
        <div className="oc-home-badge">NKU OpenClaw Security View</div>
        <h1 className="oc-home-title">ClawGuard 生态安全监测平台</h1>
        <p className="oc-home-subtitle">
          面向 OpenClaw 系列生态的公网暴露面监测与安全治理平台，聚焦节点资产识别、风险量化、版本演化与持续响应。
        </p>
        <div className="oc-home-meta">
          <Clock size={13} />
          <span>数据最后更新：2026-03-13 14:37</span>
        </div>
      </div>

      <div className="oc-home-modules">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <div key={module.title} className={`oc-home-module-card${module.statusOk ? " is-active" : ""}`}>
              <div className="oc-home-module-header">
                <Icon size={20} strokeWidth={1.8} />
                <span className={`oc-badge ${module.statusOk ? "oc-badge-online" : "oc-badge-review"}`}>
                  {module.status}
                </span>
              </div>
              <div className="oc-home-module-title">{module.title}</div>
              <div className="oc-home-module-desc">{module.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
