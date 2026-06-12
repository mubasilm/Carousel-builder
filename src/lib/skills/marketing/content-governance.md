# Content Governance

*Last updated: 2026-06-03*

This file defines the default GTM Buddy content rules that should be applied automatically unless the user explicitly asks to override a specific constraint.

## Default Rule

Do not ask the user to restate these standards for normal GTM Buddy marketing work. Treat them as the baseline for strategy, briefs, copy, SEO content, sales collateral, social content, email content, and competitive content.

## Non-Negotiable Defaults

### 1. Messaging Alignment

- Every asset must stay aligned to `.agents/product-marketing-context.md`.
- Use GTM Buddy's approved category framing, contrasts, and value narrative.
- For GTM Buddy term-definition or ontology questions, resolve against the Canonical Definitions / Glossary in `.agents/product-marketing-context.md` before improvising.
- Do not collapse GTM Buddy into generic sales enablement, AI productivity, or digital sales room language.

### 2. Ontological Approval

The ontology is not optional. Do not introduce alternate category logic without explicit user approval.

- GTM Buddy is the **Revenue Activation Engine**.
- The category is **Revenue Activation**.
- **Sales Enablement prepares reps before the moment. Revenue Activation operates inside it.**
- The old model is **Storage Architecture**. The new model is **Signal Architecture**.
- GTM Buddy is the **activation engine**, not the hero.
- The hero is the rep. The operator is enablement as the **Revenue Activator**.
- AI is an enabler inside the narrative, not the category headline.
- Preserve approved GTM Buddy IP exactly: **Five Levers, Nucleus, Foundation Play, Acceleration Play, Revenue Activation Index, 16/16/27, Agentic Era of Sales, Agentic Sales Rep, Revenue Capacity per Rep**.

If a draft drifts from this ontology, fix the drift instead of preserving it.

### 3. E-E-A-T By Default

Every serious public-facing asset should satisfy E-E-A-T.

- Experience: write from real operating insight, implementation detail, and first-hand GTM Buddy understanding.
- Expertise: use named experts, proprietary frameworks, and clear domain competence.
- Authoritativeness: reinforce category claims with original GTM Buddy IP, proof points, and clean internal linking.
- Trustworthiness: avoid inflated claims, vague metrics, or ungrounded positioning.

When appropriate, prefer named attribution to Sree and tie the piece to a real point of view, framework, or operating lesson.

### 4. Keyword Universe Alignment

- Choose topics and primary targets from `.agents/keyword-universe.md`.
- Prioritize `T1*` and `T1` before spending energy on broad adjacent topics.
- Trojan horse content must bridge back to Revenue Activation instead of diluting the category.
- One asset should have one clear primary keyword/theme, even if it supports adjacent entities.

### 5. AEO / GEO Optimization

Every publication-ready GTM Buddy content asset should be optimized for answer extraction and AI citation.

For search-facing and web-native content:
- follow `.agents/content-standards.md`
- open with a direct answer
- use clean definitional language
- make the structure easy to quote, cite, and summarize
- use FAQ, schema, internal links, and named-IP blocks where appropriate

For channels that cannot support full article structure, such as ads, social posts, outbound email, or sales collateral:
- still use explicit category language
- keep claims concrete and attributable
- prefer clean noun phrases over vague positioning
- make the GTM Buddy framing easy to repeat accurately by humans and AI systems

## Style Guardrails

Apply these to all written GTM Buddy content regardless of channel or format:

- **No em dashes.** Never use em dashes (—) in any copy. Replace with a comma, colon, or full stop.

### 6. Technical SEO Floor

Every web-facing asset must pass the technical SEO checks in `.agents/seo-guardrails.md` before publishing. If the file exists, read it and apply its pre-publish checklist automatically. Do not ask the user to initiate this check separately.

Key rules from that file that apply to all web content:
- Title tag: unique, 50-60 chars, keyword-first
- H1: unique, under 70 chars, keyword-aligned, one per page
- Meta description: unique, under 160 chars, mandatory on every page
- At least 3 internal inlinks to every new page before publishing
- Schema type appropriate for the page (see matrix in seo-guardrails.md)
- No placeholder content on live pages
- AEO structure: 40-60 word direct opening for search-facing pages

### 7. Competitive Field Intel Firewall

Competitive intelligence comes in two grades, and they must not be mixed.

- **Public-safe competitive narrative** (use anywhere): the Highspot + Seismic merger as a public fact, architecture-beats-labels, the MCP reframe, the AI-native test, the Done-For-You Migration offer, and public URLs/CTAs.
- **Internal field intel** (coaching notes only): exact competitor tier pricing (for example Highspot E1/E2/E3 rates), "which tier is failing" reads, competitor ARR/valuations, unverified "their claim" outcome stats, and any "never say to a prospect" line. This lives only in `skills/sales-enablement/references/competitive-battlecards.md` and the `skills/competitor-profiling` registry, each marked INTERNAL.

Rules:
- Internal field intel may be **surfaced in chat** when the user asks a competitive or sales question (it is coaching for the user).
- Internal field intel must **never be written into a public asset**: web copy, ads, social, comparison/alternative pages, outbound email, or any customer-facing collateral.
- When unsure whether a fact is public-safe, treat it as internal and keep it out of the deliverable.

## Preflight Checklist

Before finalizing any GTM Buddy asset, confirm:

1. Messaging matches the approved product marketing context.
2. Category framing is ontologically approved and does not drift.
3. E-E-A-T is visible in attribution, proof, and specificity.
4. The topic and angle map to the keyword universe.
5. The structure is AEO / GEO ready for the target channel.
6. No em dashes in the copy.
7. Technical SEO floor passes: see `.agents/seo-guardrails.md`.
8. No internal competitive field intel (exact tier pricing, ARR, "their claim" stats, "never say" lines) has leaked into a public asset.

## Conflict Rule

If a user request conflicts with GTM Buddy's approved messaging, ontology, E-E-A-T, keyword, or AEO / GEO standards:

- do not silently comply
- note the conflict briefly
- preserve the approved framing unless the user explicitly asks for an intentional deviation
