# The Dolphins Registration — Project Description & Handover

Handover document for moving this project to a new Claude account, a new GitHub account and a new Vercel account.
It covers what the project is, how it is built, every business rule, and what happened in the working sessions.

> **Scope note:** This file was written from the project source code plus the one working session that is visible
> to the assistant that wrote it (git setup, push attempt, running the app). The earlier session(s) in which the
> app was originally designed and generated are not visible to it, so their discussion cannot be reproduced here.
> The code is the record of those decisions; the "Design decisions" section below is taken from the project's own
> README and from the code. If you have the original prompts/chat export, paste them into the
> "Original requirements (to fill in)" section at the end.

---

## 1. What the project is

A **mobile-first, multi-step registration web app for "The Dolphins" swim club** (Kuwait; currency KWD).
A parent chooses a course period, registers one or more children, enters their own contact details, reviews the
price (with family discounts) and confirms. The server validates and recomputes the price and returns a receipt
reference.

- Name: `dolphins-registration` (package), "The Dolphins Registration" (site title)
- Status: front-end flow complete; **the API does not persist anything yet** (see §9 Known gaps)
- Tagline on site: "Swim club · Summer registration open"

## 2. Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js **15.5.x** (App Router), installed 15.5.28 |
| UI | React **19.1**, TypeScript **5.6+** (strict, `noUncheckedIndexedAccess`) |
| Styling | CSS Modules per component + design tokens as CSS variables in `src/app/globals.css` (no Tailwind, no UI library) |
| Fonts | `next/font/google`: **Fredoka** (display, 500/600) and **Nunito** (body, 400/600/700/800) |
| State | One `useReducer` in a context provider; draft persisted to `sessionStorage` |
| Lint | ESLint 9 flat config (`next/core-web-vitals`, `next/typescript`) via `FlatCompat` |
| Runtime used | Node v24.22.1, npm 11.19.1 (Windows 11) |
| Dependencies | Only `next`, `react`, `react-dom` at runtime. No database, auth, or email library yet. |

Scripts (`package.json`):

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm start
npm run lint
npm run typecheck  # tsc --noEmit
```

Path alias: `@/*` → `./src/*`. `next.config.ts` only sets `reactStrictMode: true`.

## 3. Business rules (all in `src/features/registration/config.ts`)

- Club: **The Dolphins**, currency **KWD**, price **120 KWD per child** per course.
- Season: **1 June – 31 August**.
- Course: **2 weeks**, **Sunday to Thursday** (5 days/week), **2 hours/day** → 10 sessions, 20 hours.
- Max **10 children** per registration; child-count quick-pick shows 5 buttons.
- **Family discounts** (best tier first, first match wins): 3+ children → **20 %**, 2 children → **10 %**.
- Age groups: `6-8`, `9-11`, `12-14`, `15-18`.
- Genders: `boy`, `girl` (displayed as "Boys"/"Girls" for training groups, e.g. "Boys, ages 9–11").
- Six 15-ish-day periods: `jun-1` (1–15 Jun), `jun-2` (16–30 Jun), `jul-1` (1–15 Jul), `jul-2` (16–31 Jul),
  `aug-1` (1–15 Aug), `aug-2` (16–31 Aug).
- Money is rounded to 3 decimals (KWD has 3 decimals) in `lib/pricing.ts` to avoid float noise.

**To change prices, discounts, periods, ages: edit `config.ts` only** — screens, validators and the API follow.

## 4. User flow / routes

```
/                      Welcome (hero, course facts, child-count picker, discounts, age groups, sticky price footer)
/register/period       Step 1  Choose your period
/register/children     Step 2  Your children (name, gender, age group per child)
/register/parent       Step 3  Parent details (name, phone, optional email)
/register/review       Step 4  Review and confirm  → POST /api/registrations
/register/success      Receipt: reference + amount due
POST /api/registrations   Validates, recomputes price, returns { reference, total, currency } (201)
```

- Deep links are guarded: `useStepGuard` redirects to the first incomplete earlier step.
- `/register/success` without a confirmed submission redirects home.
- Review screen has three states: normal, submitting (loading), error (retry / go back).
- "Back to home" on success calls `reset()` (clears draft + state).

## 5. Project structure

```
src/
  app/                          Routes only (thin pages), layout (fonts, provider), globals.css, API route
    api/registrations/route.ts
    register/{period,children,parent,review,success}/page.tsx
  components/
    ui/        Generic primitives: Button, Card, ChoiceGroup, TextField, ProgressSteps, StickyFooter, Decorations (LaneRope, Wave), Icons
    brand/     Logo, Dolphin artwork (boy/girl variants), PoolBackground
  features/registration/
    config.ts           Club data (edit here)
    types.ts            Domain types (Child, Parent, RegistrationDraft, RegistrationPayload, PriceBreakdown, ...)
    lib/                pricing.ts, validation.ts, format.ts, steps.ts  (pure logic)
    state/              reducer.ts, RegistrationProvider.tsx, draft-storage.ts, useStepGuard.ts
    api/                submit-registration.ts (client for the endpoint)
    components/         ChildCard, ChildCountPicker, PeriodPicker, StepLayout, RegistrationStep, Summary, ReceiptParts,
                        SubmissionStatus, DiscountTiers, SeasonBadge, CourseFactsCard, AgeGroupsCard
    screens/            One component per page (Welcome, Period, Children, Parent, Review, Success) + CSS modules
  lib/cx.ts             className helper
```

Config files: `eslint.config.mjs`, `next.config.ts`, `tsconfig.json`, `.gitignore`
(ignores `node_modules`, `.next`, `out`, `next-env.d.ts`, `*.tsbuildinfo`, `.env*.local`, `.DS_Store`).

## 6. Key design decisions

- **State**: a single `useReducer` in `RegistrationProvider` shared by all steps. Actions are stable callbacks
  (latest state read through a ref). **Price is derived, never stored.**
- **Draft persistence**: everything except submission status is saved to `sessionStorage`
  (key `dolphins:registration-draft:v1`) and restored *after mount* so SSR and first client render match.
  Stored data is never trusted: `sanitizeDraft` rebuilds it field by field. Storage failures are swallowed (best effort).
- **Validation is shared** between form and server (`lib/validation.ts`). The server revalidates untrusted input
  (periodId, 1–10 children, name/gender/ageGroup, parent) and **recomputes the total** — it never trusts a client total.
  - Parent name ≥ 2 chars; phone ≥ 8 digits; email optional but must look valid if given; text fields ≤ 80 chars.
- **Reducer actions**: periodSelected, childCountSet, childAdded, childRemoved (never below 1), childUpdated,
  parentUpdated, submitStarted/Succeeded/Failed, submissionDismissed, draftRestored, reset. Child ids are
  `child-<seq>` using a monotonic counter so ids stay unique after removals.
- **Submit**: client aborts any in-flight request when re-submitting/resetting/unmounting (AbortController);
  errors show server message if JSON `{error}` else a generic connectivity message.
- **Receipt reference**: `DOL-` + first 8 chars of `crypto.randomUUID()` uppercased.
- **Styling**: mobile-first; layouts expand at 720 px / 900 px; `--content-max: 1040px`; respects
  `prefers-reduced-motion`; visible focus ring (accent colour); `100dvh` body; theme colour `#0a4a75`.
- **Palette tokens** (globals.css): navy `#0a4a75`, primary `#0b5c8f`, ink `#0b2a40`, water `#dff1f8`,
  accent (CTA) `#ffb547`, alert `#c2410c`, boy `#1e6fd9`, girl `#e0559b`, lane-rope `#f26b3a`; radii 12/16/20 px.
- **Adding a step**: add to `REGISTRATION_STEPS`, add a case to `isStepComplete`, create a screen + route page.

## 7. Working-session log (what happened in the visible chat)

1. **Push request** — user asked to push the code to `git@github.com:t072405-crypto/swim-club.git`.
   - The folder `C:\Users\abbas\OneDrive\Desktop\swim aap` contained `dolphins-registration/` and
     `The Dolphins Registration.zip`; the project had **no git repo**.
   - Created a repo inside `dolphins-registration` (branch `main`), added all files, made the commit
     `92a4356 Initial commit: Dolphins registration app`, added remote `origin` = the SSH URL above.
   - Git identity was not configured; a **repo-local** identity was set (`user.email t072405@coded.edu.kw`,
     `user.name t072405-crypto`). Change it for the new account.
   - **Push failed**: `Host key verification failed` (github.com not in `known_hosts`). The assistant did not add the
     host key itself; the user was told to run `ssh -T git@github.com` once and accept the fingerprint (and make sure an
     SSH key is registered on GitHub). A re-test in non-interactive mode failed identically.
   - **Result: nothing has been pushed to the old GitHub repo.** The only commit is local.
2. **Run the app** — user asked to run it "by Google": the dev server was started (`npm run dev`, minimized
   PowerShell window) and opened in Chrome at http://localhost:3000 (HTTP 200 confirmed).
3. **This handover document** was requested for migrating to a new Claude account, GitHub and Vercel.

Line endings: Windows git warns that LF will be converted to CRLF; harmless, but consider adding `.gitattributes`
with `* text=auto eol=lf` for the new repo.

## 8. Migration checklist (new Claude / GitHub / Vercel accounts)

### Code → new GitHub
1. Create an empty repo on the new GitHub account (no README/licence, to avoid unrelated histories).
2. In `dolphins-registration/`:
   ```bash
   git remote set-url origin git@github.com:<NEW-USER>/<NEW-REPO>.git   # or HTTPS URL
   git config user.name  "<new name>"
   git config user.email "<new email>"
   git push -u origin main
   ```
   If you never push to the old repo you can also delete `.git` and re-init. If the old commit's author email
   should change: `git commit --amend --reset-author` (single commit, safe before first push).
3. SSH: run `ssh -T git@github.com` once to trust the host key; add your public key to the **new** GitHub account
   (or use HTTPS + a personal access token / Git Credential Manager instead).

### Deploy → new Vercel
1. Sign in to Vercel with the new account → **Add New Project** → import the new GitHub repo
   (install the Vercel GitHub app on the new account).
2. Framework preset auto-detects **Next.js**; defaults are right: install `npm install`, build `npm run build`,
   output handled by Next. Node 20+ recommended (developed on Node 24).
3. **Environment variables: none are required today.** Add them here when persistence/email is added (§9).
4. Deploy; every push to `main` redeploys. Add the custom domain later if wanted.
5. Alternative with CLI: `npm i -g vercel && vercel` from the project folder.

### Claude
- Start the new session with the project folder opened and tell it to read this file first (`projectDescription.md`).
- There is no `CLAUDE.md` yet; consider asking Claude to run `/init` or to turn §2–§6 into one.
- Nothing in the project depends on the old Claude account. The assistant's memory directory for the old account
  is not part of the repo.

### Do NOT carry over
- `node_modules/`, `.next/`, `tsconfig.tsbuildinfo` (all regenerated; already git-ignored).
- Any secrets: none exist in the repo. Never commit `.env*` files.

## 9. Known gaps / suggested next work

- **No persistence**: `src/app/api/registrations/route.ts` has a `TODO` — registrations are validated and a receipt
  is returned, but nothing is stored or emailed. Pick a store (e.g. Vercel Postgres/Supabase/Neon) and/or send an
  email/WhatsApp notification to the club. Without this, **real registrations would be lost**.
- No payment integration: the receipt says "Amount due"; payment method/instructions are not defined.
- No admin view to list registrations, no duplicate-submission protection, no rate limiting / spam protection on the API.
- No tests (only `typecheck` and `lint` scripts). Pricing and validation are pure functions, so unit tests are easy to add.
- Parent email is optional; there is no confirmation email.
- Phone validation only checks ≥ 8 digits (no Kuwait-specific format).
- Seasonal text ("Summer registration open", season dates) is hard-coded in `config.ts`/`WelcomeScreen.tsx`.
- Hosting/domain, privacy notice (children's data) and terms are not defined.

## 10. Original requirements (to fill in)

_The original brief/prompts used to generate the app were not available when this file was written.
Paste them here (or attach the chat export) so the new account has the full intent:_

- Original prompt(s): …
- Brand/design references: …
- Languages (English only today; Arabic/RTL not implemented): …
- Payment & data-storage decisions: …
