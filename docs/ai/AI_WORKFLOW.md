# Frontend AI Development Workflow

## Purpose
This frontend project was developed using an **AI-driven approach** closely guided by the developer. The goal was to rapidly build a scalable, production-ready Vue 3 SPA using the Feature-Sliced Design (FSD) architecture while maintaining strict code boundaries.

---

## AI Tools Used
* AI Coding Assistant (acting as implementation agent)
* Local tooling:
  * TypeScript (strict mode)
  * Vite (build and HMR)
  * Vue 3 Composition API & Pinia
  * TailwindCSS v4

---

## Development Methodology
The development mirrored the backend iterative loop:
`Plan → Prompt → Generate → Review → Refactor → Document`

### 1. Planning
Before component creation:
* UI/UX requirements defined and verified against OpenAPI contracts.
* FSD layer placement determined (widgets vs features vs pages vs entities).
* API endpoints linked to specific domain entities.

### 2. Prompting Strategy
Prompts constrained the AI to:
* Enforce strict FSD compliance (no cross-slice imports).
* Separate `admin` and `public` routing trees globally.
* Rely on declarative Vue 3 setups (`<script setup lang="ts">`).
* Avoid polluting generic shared UI components with domain business logic.

### 3. Generation
AI iteratively generated:
* Store configurations (`entities/session/model/store.ts`).
* Axios API endpoints for public and admin operations.
* Base layout wrappers (`PublicLayout`, `AdminLayout`).
* Complex CRUD components (Modals with dynamic attributes).

### 4. Quality Control
* Typing everything strictly with TS Interfaces pulled from backend DTOs.
* Preventing visual mocks from lingering in production code.
* Reusing standard components (`ConfirmModal`) for repetitive behaviors.
* Validating reactive variables (`ref`, `computed`) to prevent runtime mismatches.
