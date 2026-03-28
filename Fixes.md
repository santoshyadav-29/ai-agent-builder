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

### 11) Extracted current agent preview and save panel

- Moved the right preview/save section into `src/components/CurrentAgentConfiguration.tsx`.
- Added explicit remove handlers in App and passed them down as props.
- Why: isolates preview/rendering concerns from state-management logic.
- Files: src/App.tsx, src/components/CurrentAgentConfiguration.tsx

### 12) Extracted saved agents list and actions panel

- Moved saved-agents rendering and actions into `src/components/SavedAgentsPanel.tsx`.
- Added a dedicated clear-all handler in App and passed load/delete/clear actions as component props.
- Why: separates persisted-list presentation from container-level state management.
- Files: src/App.tsx, src/components/SavedAgentsPanel.tsx

### 13) Extracted session and analytics effects into reusable hooks

- Moved session timer logic to `src/hooks/useSessionTime.ts`.
- Moved analytics heartbeat side-effect to `src/hooks/useAnalyticsHeartbeat.ts`.
- Why: keeps App focused on orchestration and reduces effect-related noise in container code.
- Files: src/App.tsx, src/hooks/useSessionTime.ts, src/hooks/useAnalyticsHeartbeat.ts

### 14) Normalized formatting in extracted modules

- Applied consistent formatting (quotes, semicolons, wrapping) across newly extracted modules.
- Why: keeps style uniform after modularization and improves readability during review.
- Files: src/components/ConfigurationOptions.tsx, src/components/SavedAgentsPanel.tsx, src/constants/providers.ts, src/hooks/useAgentData.ts, src/types/agent.ts

### 15) Reduced App.tsx to a pure app entry and added barrel exports

- Moved full orchestration/render flow into `src/pages/AgentBuilderPage.tsx`.
- Added barrel exports for components in `src/components/index.ts` and page exports in `src/pages/index.ts`.
- Updated `src/App.tsx` to export the page component directly.
- Why: keeps app entry minimal and centralizes component imports through a single module.
- Files: src/App.tsx, src/pages/AgentBuilderPage.tsx, src/pages/index.ts, src/components/index.ts

### 16) Migrated app state to Zustand store with typed actions and persistence

- Added centralized store in `src/store/agentBuilderStore.ts` and barrel export in `src/store/index.ts`.
- Moved selection state, draft state, saved agents, session timer, loading/error/data state, and async fetch flow into typed store actions.
- Added store-level persistence for saved agents with normalization for legacy entries missing IDs.
- Rewired `src/pages/AgentBuilderPage.tsx` to consume store selectors/actions and removed obsolete local-state hooks.
- Why: enforces a single source of truth, reduces prop/state orchestration complexity, and aligns with professional state-management practices.
- Files: src/pages/AgentBuilderPage.tsx, src/store/agentBuilderStore.ts, src/store/index.ts, src/hooks/useAgentData.ts, src/hooks/useSessionTime.ts, package.json, bun.lock

### 17) Addressed post-migration anti-patterns and resilience gaps

- Hardened persisted store hydration by validating localStorage payload shape before normalizing saved agents.
- Moved fetch request sequencing token to store-local closure scope instead of module-level mutable state.
- Reduced timer-driven container rerenders by moving session display to `src/components/SessionStatus.tsx` and ticker side effect to `src/hooks/useSessionTicker.ts`.
- Updated analytics heartbeat to keep a stable interval and read the latest agent name via ref.
- Why: improves runtime safety, reduces unnecessary rerenders, and removes subtle lifecycle anti-patterns.
- Files: src/store/agentBuilderStore.ts, src/pages/AgentBuilderPage.tsx, src/hooks/useAnalyticsHeartbeat.ts, src/hooks/useSessionTicker.ts, src/components/SessionStatus.tsx, src/components/index.ts
