export const DEFAULT_CLAW_EXPOSURE_PRODUCT_KEY = "openclaw";

export const CLAW_EXPOSURE_PRODUCTS = [
  {
    key: "openclaw",
    name: "OpenClaw",
    navLabel: "OpenClaw 公网暴露监测",
    pageTitle: "OpenClaw 公网暴露检测",
    description:
      "持续采集公网活跃 OpenClaw 节点，覆盖全球分布、境内覆盖、版本演化与暴露服务详情，服务于 OpenClaw 生态安全分析与资产梳理场景。",
    sourceLabel: "数据库快照",
    port: "18789",
    service: "18789 / OpenClaw",
    serviceDesc: "OpenClaw service",
    riskLabel: "待补充",
    riskTone: "review",
    isDefault: true,
  },
  {
    key: "goclaw",
    name: "GoClaw",
    navLabel: "GoClaw 公网暴露监测",
    pageTitle: "GoClaw 公网暴露检测",
    description:
      "基于 GoClaw 暴露 IP 清单聚合公网资产分布、境内外覆盖与服务明细，用于接口枚举和外部暴露面复核。",
    sourceLabel: "GoClaw_all.txt",
    sourceFile: "GoClaw_all.txt",
    port: "3000",
    service: "3000 / GoClaw",
    serviceDesc: "GoClaw Dashboard service",
    riskLabel: "低风险产品暴露",
    riskTone: "low",
  },
  {
    key: "ironclaw",
    name: "IronClaw",
    navLabel: "IronClaw 公网暴露监测",
    pageTitle: "IronClaw 公网暴露检测",
    description:
      "聚合 IronClaw 公网节点清单，观察 API、WS/SSE 实时通道相关的地域分布和暴露实例详情。",
    sourceLabel: "IronClaw_all.txt",
    sourceFile: "IronClaw_all.txt",
    port: "3000",
    service: "3000 / IronClaw",
    serviceDesc: "IronClaw API service",
    riskLabel: "中风险产品暴露",
    riskTone: "medium",
  },
  {
    key: "picoclaw",
    name: "PicoClaw",
    navLabel: "PicoClaw 公网暴露监测",
    pageTitle: "PicoClaw 公网暴露检测",
    description:
      "面向 PicoClaw Config、OAuth、Skills、Sessions 与 Gateway 接口的公网暴露清单分析。",
    sourceLabel: "PicoClaw_all.txt",
    sourceFile: "PicoClaw_all.txt",
    port: "18800",
    service: "18800 / PicoClaw",
    serviceDesc: "PicoClaw service",
    riskLabel: "中风险产品暴露",
    riskTone: "medium",
  },
  {
    key: "tinyclaw",
    name: "TinyClaw",
    navLabel: "TinyClaw 公网暴露监测",
    pageTitle: "TinyClaw 公网暴露检测",
    description:
      "跟踪 TinyClaw Mission Control 节点的公网暴露情况，辅助复核任务、项目和事件流接口。",
    sourceLabel: "TinyClaw_all.txt",
    sourceFile: "TinyClaw_all.txt",
    port: "3000",
    service: "3000 / TinyClaw",
    serviceDesc: "TinyClaw Mission Control service",
    riskLabel: "中风险产品暴露",
    riskTone: "medium",
  },
  {
    key: "zeroclaw",
    name: "ZeroClaw",
    navLabel: "ZeroClaw 公网暴露监测",
    pageTitle: "ZeroClaw 公网暴露检测",
    description:
      "围绕 ZeroClaw API、Webhook、Admin、WS/SSE 等高价值入口，汇总公网活跃实例和地域分布。",
    sourceLabel: "ZeroClaw_all.txt",
    sourceFile: "ZeroClaw_all.txt",
    port: "42617",
    service: "42617 / ZeroClaw",
    serviceDesc: "ZeroClaw service",
    riskLabel: "高风险产品暴露",
    riskTone: "high",
  },
];

export function getClawExposureProduct(productKey = DEFAULT_CLAW_EXPOSURE_PRODUCT_KEY) {
  const normalizedKey = String(productKey || DEFAULT_CLAW_EXPOSURE_PRODUCT_KEY).toLowerCase();
  return (
    CLAW_EXPOSURE_PRODUCTS.find((product) => product.key === normalizedKey) ||
    CLAW_EXPOSURE_PRODUCTS.find((product) => product.key === DEFAULT_CLAW_EXPOSURE_PRODUCT_KEY)
  );
}
