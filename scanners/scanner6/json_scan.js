#!/usr/bin/env node

const ClawGuardAuditor = require('./src/auditor');

async function main() {
  const skillPath = process.argv[2];
  if (!skillPath) {
    console.error('Usage: node json_scan.js <skill-path>');
    process.exit(1);
  }

  const originalLog = console.log;
  console.log = (...args) => console.error(...args);

  const auditor = new ClawGuardAuditor({
    autoApproveTier: 'TIER_1',
    mlDetection: true,
    sandboxExecution: true,
  });

  const result = await auditor.audit(skillPath);
  console.log = originalLog;
  process.stdout.write(JSON.stringify(result));
  process.stdout.write('\n');
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : String(error));
  process.exit(1);
});
