import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCAN_SCRIPT = path.resolve(__dirname, "scan-skill-static.mjs");

function parseArgs(argv) {
  const options = {
    batchId: null,
    concurrency: null,
    limitRepos: null,
    cacheMaxRepos: null,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const current = argv[i];
    const next = argv[i + 1];
    if (current === "--batch-id") {
      options.batchId = Number(next) || null;
      i += 1;
      continue;
    }
    if (current === "--concurrency") {
      options.concurrency = Number(next) || null;
      i += 1;
      continue;
    }
    if (current === "--limit-repos") {
      options.limitRepos = Number(next) || null;
      i += 1;
      continue;
    }
    if (current === "--cache-max-repos") {
      options.cacheMaxRepos = Number(next) || null;
      i += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${current}`);
  }

  return options;
}

function runNodeScript(scriptPath, scriptArgs) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath, ...scriptArgs], {
      cwd: process.cwd(),
      env: process.env,
      stdio: "inherit",
      windowsHide: true,
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Rescan script exited with code ${code}`));
        return;
      }
      resolve();
    });
  });
}

async function main() {
  const options = parseArgs(process.argv);
  const args = ["--force-rescan-risky"];
  if (options.batchId) args.push("--batch-id", String(options.batchId));
  if (options.concurrency) args.push("--concurrency", String(options.concurrency));
  if (options.limitRepos) args.push("--limit-repos", String(options.limitRepos));
  if (options.cacheMaxRepos) args.push("--cache-max-repos", String(options.cacheMaxRepos));

  await runNodeScript(SCAN_SCRIPT, args);
}

main().catch((error) => {
  console.error(`[rescan-risky-skills] ${error.stack || error.message}`);
  process.exitCode = 1;
});
