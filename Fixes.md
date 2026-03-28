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

### 5) Replaced explicit any in fetch error handling
- Updated fetch error handling to use `unknown` with safe Error narrowing.
- Why: removes unsafe typing and restores lint compliance.
- File: src/App.tsx

### 6) Replaced index-based keys with stable saved-agent IDs
- Added persistent IDs for saved agents and used those IDs for list keys and deletion.
- Included a localStorage normalization step so older saved items without IDs are upgraded automatically.
- Why: index keys are unstable during list updates and can cause UI/state mismatches.
- File: src/App.tsx

### 7) Added full save-time validation for agent configuration
- Enforced required fields before saving: name, profile, at least one skill, at least one layer, and provider.
- Why: prevents persisting incomplete or logically invalid agent definitions.
- File: src/App.tsx

### 8) Modularized domain types and provider constants
- Moved agent-related interfaces/types into `src/types/agent.ts`.
- Moved AI provider list into `src/constants/providers.ts`.
- Why: centralizes shared domain definitions and reduces component file size/coupling.
- Files: src/App.tsx, src/types/agent.ts, src/constants/providers.ts

### 9) Modularized data-loading logic into a reusable hook
- Moved API loading, loading/error state, initial fetch, and stale-request guarding to `src/hooks/useAgentData.ts`.
- Updated app state initialization for saved agents to lazy-load from localStorage and persist via a dedicated effect.
- Why: separates data concerns from UI composition and simplifies App state orchestration.
- Files: src/App.tsx, src/hooks/useAgentData.ts

### 10) Extracted configuration form into a dedicated component
- Moved the entire left configuration pane into `src/components/ConfigurationOptions.tsx`.
- Kept App focused on orchestration by passing explicit callback props for profile/skill/layer/provider updates.
- Why: reduces App rendering complexity and improves component-level maintainability.
- Files: src/App.tsx, src/components/ConfigurationOptions.tsx
