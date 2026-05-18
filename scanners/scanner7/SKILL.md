---
name: static-skill-scanner-prototype
description: Minimal four-layer static skill scanner prototype for ClawGuard
---

# Static Skill Scanner Prototype

A minimal runnable scanner that demonstrates a four-layer architecture:

- Parser
- Normalizer
- Analyzers
- Aggregator

Run locally:

```bash
python main.py examples/suspicious_skill --format md
```
