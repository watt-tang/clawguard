# Feature Directory Convention

Put files of the same page/module together under `src/features/<feature-name>/`.

Recommended structure:

- `pages/`: route/page components
- `components/`: UI used by this feature only
- `services/`: API/data logic for this feature
- `utils/`: utility helpers for this feature
- `hooks/`: feature-specific hooks (optional)
- `constants/`: feature constants (optional)

If a file is reused by multiple features, move it to global shared folders (for example `src/hooks`, `src/config.js`, `src/styles.css`).
