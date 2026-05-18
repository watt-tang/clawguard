# Static Skill Scanner

A minimal runnable static skill scanner prototype with four layers:

1. `Parser`
2. `Normalizer`
3. `Analyzers`
4. `Aggregator`

## Quick Start

```bash
python -m static_skill_scanner.cli examples/suspicious_skill --format md
```

Or scan a zip archive:

```bash
python -m static_skill_scanner.cli examples/suspicious_skill.zip --format json
```

## Project Layout

- `static_skill_scanner/parser.py`: input parsing and workspace preparation
- `static_skill_scanner/normalizer.py`: build the unified `SkillModel`
- `static_skill_scanner/analyzers/`: plug-in analyzers
- `static_skill_scanner/aggregator.py`: merge findings and render summary
- `examples/`: sample skills for local testing
