# The Dolphins Registration

Mobile-first registration flow for The Dolphins swim club, built with Next.js (App Router), React 19 and TypeScript.

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run lint
npm run build
```

## Flow

`/` welcome → `/register/period` → `/register/children` → `/register/parent` → `/register/review` → `/register/success`

## Structure

```
src/
  app/                         Routes only: thin pages, layout (fonts, provider), API route
    api/registrations/route.ts   POST: validates input, recomputes price, returns a receipt
  components/
    ui/                        Generic, reusable primitives (Button, Card, ChoiceGroup, TextField, ...)
    brand/                     Logo, dolphin artwork, pool background
  features/registration/       Everything specific to the registration domain
    config.ts                  Club data: price, discounts, periods, age groups (edit here)
    types.ts                   Domain types
    lib/                       Pure logic: pricing, validation, formatting, step definitions
    state/                     Reducer, context provider, draft persistence, step guard
    api/                       Client for the registrations endpoint
    components/                Domain components (ChildCard, PeriodPicker, StepLayout, ...)
    screens/                   One component per page; composes the above
  lib/                         Cross-cutting helpers
```

## Design decisions

- **State**: one `useReducer` in `RegistrationProvider` shared by all steps. Actions are exposed as stable callbacks;
  the price is derived (never stored). The draft (everything except submission status) is saved to
  `sessionStorage` and restored after mount, so a refresh doesn't lose data and SSR/CSR markup match.
- **Step guard**: `useStepGuard` redirects deep links to the first incomplete step.
- **Validation** is shared by the form and the API route (`lib/validation.ts`); the server never trusts the client's total.
- **Styling**: CSS Modules per component with design tokens as CSS variables in `app/globals.css`; layouts are
  mobile-first and expand at 720px / 900px.
- **Adding a step**: add it to `REGISTRATION_STEPS`, give `isStepComplete` a case, create a screen and a route page.
- **Changing prices/discounts/periods**: edit `features/registration/config.ts` only.

The API route currently returns a receipt without persisting anything (see the `TODO` in `route.ts`).
