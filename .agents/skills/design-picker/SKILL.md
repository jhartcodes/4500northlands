---
name: design-picker
description: Explore early-stage visual directions before implementation. Use when Codex needs to inspect an unfamiliar codebase, infer the likely product audience from repo context, and propose several distinct look-and-feel options or a "design picker" deck with rationale, tradeoffs, and a recommendation.
---

# Design Skill

## Overview

Inspect the project before suggesting aesthetics. Infer what the product is, who it likely serves, and which brand constraints already exist, then turn that context into a compact set of design directions the user can compare quickly.

Keep the output decision-oriented. The goal is not a long moodboard essay. The goal is to give the user 3 or 4 viable directions they can react to and choose from.

## Workflow

### 1. Build context from the codebase

- Read the smallest set of files that establish product intent: `README`, `package.json`, route trees, navigation, hero copy, CMS schema names, and any existing theme or token files.
- Pull concrete signals from the repo: industry, user roles, content density, trust requirements, device priorities, business model, and whether the product feels editorial, transactional, SaaS, community-driven, or promotional.
- Separate evidence from inference. If the audience is not explicit in the repo, state it as a hypothesis.

### 2. Infer the audience

- Read [references/audience-inference.md](references/audience-inference.md) when the product or audience mix is ambiguous.
- Identify a likely primary audience, an optional secondary audience, and what each audience probably values visually: trust, speed, energy, authority, warmth, premium feel, clarity, or playfulness.
- Mention open questions only when they would materially change the design direction.

### 3. Gather inspiration

- Use existing brand signals in the codebase first: logos, colors, typography, imagery, editorial tone, and interaction patterns.
- If design-inspiration tooling is available, prefer grounded references or style guides over generic aesthetic invention.
- Keep the directions meaningfully distinct. Do not generate three near-identical "clean modern" options.

### 4. Build the picker

- Present 3 directions by default. Use 4 only when the codebase clearly supports multiple audiences or brand territories.
- Format the response as compact picker cards rather than dense prose. Read [references/design-picker-template.md](references/design-picker-template.md) when formatting the comparison deck.
- For each direction, include:
  - a short name
  - audience fit
  - visual thesis
  - palette direction
  - typography direction
  - layout behavior
  - interaction or motion cues
  - a one-line implementation risk or cost note
- Make each option opinionated enough that implementation would materially differ.

### 5. Recommend the best fit

- End with a clear recommendation.
- Explain why it fits the current codebase better than the alternatives.
- State what to build next if the user wants the chosen direction implemented.

## Guardrails

- Avoid false certainty. If the repo is thin, frame audience and brand assumptions as hypotheses.
- Prefer evidence over taste language.
- Avoid defaulting to generic "modern SaaS" styling unless the repo genuinely points there.
- Match tone to the product category. A healthcare, finance, civic, outdoor, or youth-oriented product needs different visual trust signals.
- Preserve any existing design system constraints when the user wants to turn the selected direction into code.

## Output Standard

- Keep each direction short enough to scan in under a minute.
- Make the comparison useful without asking the user to read a long narrative.
- Finish with:
  - `Recommended direction`
  - `Why it wins`
  - `What to build next`

## References

- Read [references/audience-inference.md](references/audience-inference.md) when product positioning or personas are unclear.
- Read [references/design-picker-template.md](references/design-picker-template.md) when the user asks for a picker, a deck of options, or quick comparison output.
