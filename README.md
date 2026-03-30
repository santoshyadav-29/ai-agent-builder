# AI Agent Builder

A web application for creating, previewing, validating, saving, and reloading custom AI agent configurations.

## Live Demo

- Live URL: [https://ai-agent-builder-plum.vercel.app/](https://ai-agent-builder-plum.vercel.app/)

## Overview

This project evolved from a partially working scaffold into a modular, performant, and polished application with:

- centralized state management
- schema-based validation and data integrity checks
- reusable UI primitives and consistent design system usage
- smoother interactions (loading skeletons, modal transitions, blur backdrop)
- robust persistence and safer async request handling
- automated test coverage for core logic and key UI behavior

## What We Added

### Core Product Features

- Build an AI agent by selecting:
  - base profile
  - skills
  - personality layers
  - provider
- Real-time preview of the current agent configuration
- Save agent draft with validation
- Reload saved agents from a dedicated panel and modal confirmation
- Delete single saved agents or clear all saved agents
- Session heartbeat/status tracking
- Toast-driven feedback for success/error/info actions

### UX and UI Improvements

- Modern two-column responsive workspace layout
- Dedicated deployment panel for naming and saving agents
- Skeleton loading states for initial data load and refresh states
- Smooth modal open/close transitions with close-state animation
- Blur-only modal backdrop for cleaner focus treatment
- Improved select UX for multi-select summaries and selected-item visibility

### Architecture Improvements

- Moved app state and actions into a typed Zustand store
- Split monolithic app logic into feature components, pages, hooks, and typed modules
- Added schema validation with Zod
- Added guardrails against stale async fetch responses
- Added saved-agent normalization for backward-compatible persistence

## Summary of Fixes (From Fixes.md)

The detailed chronological log is maintained in `Fixes.md`. High-level summary:

- Fixed state mutation and stale effect bugs
- Removed unnecessary network refetching on local selection changes
- Prevented stale overlapping requests from overriding fresh data
- Replaced unsafe `any` usage with `unknown` + narrowing
- Replaced unstable index keys with persistent IDs
- Added full draft validation and uniqueness constraints
  - duplicate name prevention (case-insensitive)
  - duplicate configuration prevention (order-insensitive skill/layer sets)
- Migrated from local component state orchestration to a centralized Zustand store
- Extracted and modularized:
  - page container
  - configuration form
  - preview panel
  - saved-agents panel
  - session and analytics hooks
  - domain types and constants
- Introduced reusable UI primitives and Tailwind-based styling system
- Added modern toast feedback and improved accessibility semantics

## Tech Stack

- React 19
- TypeScript
- Vite 8
- Zustand
- Zod
- Sonner
- Tailwind CSS v4
- Radix UI Select
- Vitest + Testing Library + jsdom
- Bun (package manager and scripts)

## Testing

Automated tests currently cover:

- store behavior and business rules
  - validation handling
  - save/reset behavior
  - duplicate guards
  - load behavior
  - async fetch flow
- configuration component behavior
  - empty placeholders
  - multi-select summary text
  - loading skeleton rendering

## Project Structure

```text
src/
   components/
      ui/
   constants/
   hooks/
   pages/
   schemas/
   store/
   test/
   types/
```

## Getting Started

### Prerequisites

- Bun 1.3+

### Install

```bash
bun install
```

### Run in Development

```bash
bun run dev
```

### Build

```bash
bun run build
```

### Run Tests

```bash
bun run test
```

### Watch Tests

```bash
bun run test:watch
```

### Coverage

```bash
bun run test:coverage
```

## Scripts

- `bun run dev` - Start local dev server
- `bun run build` - Type-check and produce production build
- `bun run preview` - Preview production build
- `bun run test` - Run tests once
- `bun run test:watch` - Run tests in watch mode
- `bun run test:coverage` - Run tests with coverage report

## Notes

- Saved agents are persisted in `localStorage`.
- Modal interactions include smooth exit transitions.
- Configuration loading and refresh states are visually differentiated for better UX.
