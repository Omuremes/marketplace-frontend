# Session 01: Frontend Scaffold & Admin Architecture

**Date**: 2026-03-25
**Focus**: Initial FSD structure, Routing, and Admin CRUD.

## Key Activities
1. **Scaffold**: Created the base Vite + Vue 3 + TS + TailwindCSS setup.
2. **Architecture**: Segmented folders cleanly into FSD layers (`app`, `pages`, `shared`, etc.).
3. **Auth Integration**: Implemented JWT saving/loading via Pinia in the `session` entity store. Intercepted Axios requests in `shared/api` to inject `Bearer` tokens reliably.
4. **Admin UI**: Created the Admin Login page, Admin Products List with true data fetching, and an advanced `AdminProductModal` for creating/editing products with direct MinIO image uploads and dynamic attributes processing.
5. **Public UI**: Implemented infinite-scroll cursor pagination on the Home page, sorting, and visual polish on the Product Details view.
6. **Polishing**: Removed lingering placeholder code in favor of dynamic Vue rendering patterns using `const` refs and `computed`.
