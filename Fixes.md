# Fixes

## 2026-03-28

### 1) Fixed direct state mutation for layer selection
- Updated layer selection logic to use immutable state updates instead of mutating the existing array.
- Why: mutating React state in place can cause stale UI and unreliable re-renders.
- File: src/App.tsx

### 2) Removed unnecessary configuration refetches on selection changes
- Stopped triggering configuration fetches when selecting profile, skill, or layer.
- Why: these are local UI state updates and should not cause network requests, loading delays, or flicker.
- File: src/App.tsx

### 3) Prevented stale overlapping fetch responses from overwriting state
- Added request-id based staleness checks in the configuration fetch flow.
- Why: when multiple fetches overlap, older responses should not win and overwrite newer state.
- File: src/App.tsx

### 4) Fixed stale analytics heartbeat dependency
- Updated the analytics heartbeat effect to depend on the current agent name.
- Why: without the dependency, the interval kept reading stale initial state.
- File: src/App.tsx
