# Key Prompts and AI Interaction Rules (Frontend)

## Global Prompt Rules
* Vue 3 Composition API strictly with `setup` script.
* Feature-Sliced Design (FSD) enforcement.
* TailwindCSS v4 natively.
* Axios for stateless API binding with Pinia tracking persistent sessions.

## Architecture Prompt
```
Create Vue 3 project structure using Feature-Sliced Design.
Layers: app → pages → widgets → features → entities → shared
Avoid cross-layer imports. Ensure Public API slicing via index.ts files.
```

## Auth Store Prompt
```
Implement a Pinia authentication store inside the 'entities/session' slice.
It should track current Admin or Seller tokens, automatically hydrate from localStorage, and provide utilities for login/logout state resetting.
```

## Iterative Refactoring Prompt
```
Remove hardcoded mockup lists inside products-list/index.vue.
Replace with actual reactive API calls to adminProductApi.getList, mapping the actual Thumbnail URL from the backend MinIO node.
```

## Modals Prompt
```
Create a reusable modal component for Admin Product modification.
It must handle both Create and Edit states dynamically based on the bound prop.
Include dynamic form fields for the Attributes list and file upload handling.
```
