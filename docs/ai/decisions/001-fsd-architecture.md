# ADR 001: Adoption of Feature-Sliced Design (FSD)

**Date**: 2026-03-25

## Context
The marketplace frontend requires distinct logic for Public Buyers/Sellers and Internal Administrators. They share some core UI components but have vastly different lifecycles, API endpoints, and route permissions.

## Decision
We adopted Feature-Sliced Design (FSD) to deeply modularize the application.
- **app/**: Global providers (router, store, tailwind CSS setup).
- **pages/**: Split strictly into `/public` and `/admin` boundaries.
- **features/**: Isolated interactive business logic (e.g. `auth-admin`, `auth-seller`).
- **entities/**: Domain data schemas, API fetching clients, and Pinia stores (e.g. `product`, `session`).
- **shared/**: Generic UI components, Axios instances, and global helpers.

## Consequences
- **Pros**: Stable boundaries, predictable refactoring patterns, easy separation of admin vs client concerns.
- **Cons**: Higher initial cognitive load, demands strict adherence to import rules (no upward or lateral bypasses).
