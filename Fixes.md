# Fixes

## 2026-03-28

### 1) Fixed direct state mutation for layer selection
- Updated layer selection logic to use immutable state updates instead of mutating the existing array.
- Why: mutating React state in place can cause stale UI and unreliable re-renders.
- File: src/App.tsx
