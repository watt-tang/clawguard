# Academic Security Research Module Plan

## Goal
Build a new academic-intelligence module to replace the existing deployment-risk page while leaving the vulnerability page untouched. The module must:
- aggregate recent OpenClaw / Claw / Skill / plugin / agent security research
- prioritize whitelist venues: IEEE S&P, USENIX Security, ACM CCS, NDSS, Euro S&P
- supplement with arXiv and explicitly mark those records as preprints / non-top-tier
- normalize, deduplicate, score, persist, and expose research records for frontend analysis
- provide a usable "academic progress" page with list, badges, keyword filters, and time sorting
- support a 7-day scheduled refresh plus a manual refresh path

## Phases
- [completed] Inspect current app routing and confirm that `openclaw-risk` (vulnerability page) is separate from `openclaw-deploy` (deployment-risk placeholder)
- [completed] Implement research-source collectors, normalization, whitelist filtering, deduplication, and API contracts for academic intelligence
- [completed] Add database models / persistence for research snapshots and papers, then run a local refresh to seed records
- [completed] Replace the deployment-risk placeholder with a new academic progress page and wire frontend filters, badges, and sorting
- [completed] Add README documentation, verify weekly scheduling, and run build/runtime checks

## Constraints
- Do not modify the existing vulnerability page behavior
- Do not include CVE / vulnerability aggregation logic in this new module
- Do not treat arXiv as a top conference
- Keep existing exposure APIs untouched
- Prefer live sources over static mock data
- Avoid introducing new npm dependencies if native fetch/XML parsing utilities are sufficient
- Do not overwrite unrelated user changes already present in the worktree
- Do not let schema sync remove existing skill-scan tables or data
- Keep runtime cache artifacts outside `web/`

## Errors Encountered
- `npm run research:refresh` initially failed once with `Invalid string length`; the follow-up fix removed query text from inferred summaries and reduced oversized/irrelevant merged metadata pressure.
- arXiv temporarily returned `429 Rate exceeded` during repeated local refresh tests; the service now surfaces provider status and refuses to persist empty snapshots when all live collection fails.
