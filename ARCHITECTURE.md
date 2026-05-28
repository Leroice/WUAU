# WUAU Architecture Rulebook

How this app is structured and why. Built for clarity, testability, and handoff —
not ceremony.

## Core Principle

Engineers should be able to swap mock data for real API calls, replace the state
manager, or refactor any layer without touching the component tree. **If you're
rewriting components to integrate the backend, the architecture failed.**

## Structure

Layer folders live at the **repo root** (not under `src/`) so `App.tsx` /
`index.js` stay put and the native build is untouched. `tsconfig` already globs
every root folder.

```
WUAU/
├── index.js            # native entry — registers App (do not move)
├── App.tsx             # thin: providers + <RootNavigator/> only
├── services/           # data layer — async getters + mock data, typed
├── hooks/              # state logic + data orchestration (incl. context providers)
├── screens/            # page-level components (thin orchestrators)
├── components/         # reusable UI presenters
├── navigation/         # routes (typed) + navigator tree + bar options
├── types/              # TypeScript interfaces and enums
├── utils/              # helpers, formatting, validation
└── constants/          # tokens (theme) + app-wide config
```

Each layer has a job. Don't cross streams.

## Services Layer

Single source of truth for data. All data access lives here.

- Export clean async functions: `getStacks(personaId)`, `getStackTxns(id)`, etc.
- Return types are explicit and defined in `types/`.
- Services map request/response — components never see a raw API shape.
- **Mock and real share one interface** — no "if mock then different shape".
- Pure: no React, no navigation, no state mutation.
- **Persona adaptation:** this POC is persona-driven, so demo services take a
  `personaId` (the active "account"). When this becomes real, `personaId` →
  the authenticated user id and the function body swaps mock for `fetch`.

```ts
// services/stacks.ts
import { Stack } from '../types/stack';
import { personaData } from './personas';

export const getStacks = async (personaId: string): Promise<Stack[]> => {
  return personaData(personaId).stacks; // swap for fetch(`/users/${personaId}/stacks`)
};
```

## Hooks Layer

Orchestrate data fetching, state, and side effects. Components call hooks, not
services. **Context providers (persona/design/tweaks) live here** — they are the
app's state layer.

- Name `use[Resource]`: `useStacks()`, `useStackDetail(id)`.
- Return `{ data, isLoading, error, ...actions }`.
- Hooks read the active persona from `usePersona()` and pass its id to services.
- All side effects (fetching, validation) happen here, not in components/screens.

```ts
// hooks/useStacks.ts
export const useStacks = () => {
  const { persona } = usePersona();
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    getStacks(persona.id).then(setStacks).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [persona.id]);
  return { stacks, isLoading, error };
};
```

## Screens

Orchestrate a page. Call hooks, pass data to components. Minimal logic.

- Get data/actions from hooks — **never import from `services/` or mock data directly.**
- Compose child components; the only side effect allowed is **navigation**.
- Keep under ~150 lines. Bigger → extract a hook or split components.
- Typed route props from `types/navigation.ts` — no `navigation: any`.

## Components (UI Layer)

Presenters. Props in, UI out.

- Explicitly typed props (interfaces in `types/`).
- No data fetching, no business logic, no direct mock-data imports.
- Reusable — if it only works in one place, it isn't a component.
- Theme comes in as a prop (`c: Theme`) or via `useTheme()` — never hardcoded colors.

## Navigation

The map. One place.

- Routes are `ROUTES` constants, never magic strings.
- Params are typed (`RootStackParamList`); screens read typed props.
- Navigators + bar options (`whiteHeader`, `TAB_BAR_OPTIONS`) live in `navigation/`.

## Types

Single source of truth for shapes. `Account`, `Stack`, `Txn`, `Persona`,
`RootStackParamList`, etc. Services return them; components receive them. If the
API shape differs, `services/` handles the mapping.

## Constants

Design tokens (`theme.ts`: LIGHT/DARK/SPACING/RADIUS/WU_YELLOW) and config/layout
metrics. No content here — content is mock data in `services/`.

## Error Handling

- Services throw; they don't swallow.
- Hooks catch and expose `error`.
- Screens render errors via a component (`<ErrorMessage onRetry/>`).
- Never silently fail.

## Red Flags (fix before handoff)

- Components/screens importing from `services/` or mock data directly
- Business logic in components
- Different shapes for mock vs real
- Hardcoded content or colors in screens/components
- Navigation logic inside components; magic-string routes
- Hooks doing too much (>50 lines, multiple responsibilities)
- Services with side effects (React, navigation, state)

## Swapping Mock → Real (the test)

1. Keep `services/` signatures; replace bodies with real API calls.
2. Update `types/` only if the API shape differs — map inside `services/`.
3. No changes to components, screens, or hooks.
4. If you're refactoring components to integrate the backend, services were done wrong.

## This Document Is Living

Add patterns that work, remove ones that don't. An engineer should read this and
build the next feature without asking questions.
