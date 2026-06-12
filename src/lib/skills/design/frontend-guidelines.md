# Frontend Guidelines

*Distilled from bendc/frontend-guidelines. These rules are always active in this workspace.*

Apply to every HTML, CSS, and JS file you write or review.

---

## HTML

**Semantics.** Use the right element for the right job. `<main>`, `<article>`, `<header>`, `<section>`, `<footer>`, `<nav>`, `<time>`. Never use `<div>` or `<span>` when a semantic element exists. Using a semantic element wrongly is worse than using a neutral one.

**Brevity.** Write terse HTML. No self-closing slash on void elements. No `type` attribute on `<script>` or `<link>`. No redundant `method="get"` or `charset` on `<meta>` after doctype.

**Accessibility.** Every image needs meaningful `alt` text. Every form control needs a label. Buttons must be `<button>`, not `<div class=button>`. Accordions use `<button aria-expanded>`. Never communicate information through color alone. Tables must be real `<table>` markup, not grids.

**Language and encoding.** Always declare `lang` on `<html>`. Always declare `<meta charset=utf-8>` at the top of `<head>`.

**Performance.** Load scripts at the end of `<body>` unless there is a valid reason to block rendering. Defer non-critical stylesheets.

---

## CSS

**Semicolons.** Every declaration ends with a semicolon. Treat it as a terminator, not a separator.

**Box model.** Use `* { box-sizing: border-box; }` globally. Do not change the box model on individual elements when you can avoid it.

**Flow.** Do not change the default display or position of an element if you can achieve the result within normal document flow. Prefer `margin-left: auto` over `position: absolute; right: 0`. Favor Flexbox and Grid. Avoid `position: absolute` for layout.

**Selectors.** Keep selectors short. Add a class to the element you want to match rather than writing a selector deeper than 3 structural combinators. Do not overload selectors.

**Specificity.** Minimize `id` selectors in CSS. Never use `!important` except as a genuine last resort override. Prefer `.foo.bar { }` over `.bar { color: green !important; }`.

**Overriding.** Do not write a rule that exists only to undo another rule. Restructure the cascade instead.

**Inheritance.** Do not duplicate declarations that can be inherited. Apply to the parent.

**Brevity.** Use shorthand properties. `padding: 5px 10px 20px` beats four separate declarations. `transition: 1s` beats `transition: all 1s`.

**Units.** Use unitless values for `line-height` and `margin: 0`. Favor `rem` over `em` or `px` for font-relative values. Use `s` not `ms` for transition durations.

**Colors.** Use hex for opaque colors. Use `rgba` only when transparency is needed. Do not use `hsl` for production values.

**Animations.** Favor `transition` over `@keyframes` when possible. Only animate `opacity` and `transform`. Add `prefers-reduced-motion` media query for any motion-based reveal.

**Vendor prefixes.** Remove obsolete prefixes. When required, write the prefixed form before the standard property.

**No hacks.** No commented-out property tricks. Use `will-change` when you need GPU promotion, not `translateZ(0)`.

---

## JavaScript

**Readability first.** Prefer readability, correctness, and expressiveness over micro-optimizations. The performance bottleneck is almost never JavaScript.

**Statelessness.** Write pure functions. Functions should ideally have no side effects, use no outside data, and return new objects instead of mutating existing ones.

**Native APIs.** Use native browser and language APIs. Do not polyfill what you can feature-detect inline. Do not load a full library for two utility functions.

**Loops.** Do not use `for`, `while`, or `for...in` when `array.prototype` methods cover the case. Use `.filter()`, `.map()`, `.reduce()`, `.forEach()`, `.find()`. Fall back to recursion when array methods are an awkward fit.

**Variables.** `const` by default. `let` when reassignment is required. Never `var`.

**Arguments.** Use rest parameters (`...args`) instead of the `arguments` object.

**Spread.** Use the spread operator instead of `.apply()`.

**Arrow functions.** Use arrow functions to preserve lexical `this` instead of `.bind(this)`.

**Composition.** Avoid deeply nested function calls. Compose small pure functions into pipelines.

**Object iteration.** Use `Object.keys().forEach()` or `Object.entries()` instead of `for...in`.

**Maps.** When you need a key-value store that is not a fixed data shape, use `Map` instead of a plain object.

**Conditions.** Favor early returns and IIFE patterns over deeply nested `if/else if/else`.

**Readability.** Never use clever tricks that obscure intent. `if (!foo) doSomething()` beats `foo || doSomething()`.

**Dependencies.** Minimize third-party dependencies. Replicate small utility functions inline rather than pulling in a library.

**Caching.** Cache expensive operations, feature tests, and large data structures at module scope, not inside hot code paths.

---

## General

- Semantic structure beats `div`-soup every time.
- CSS that reads like English (`border-radius: 8px`) beats math tricks.
- JS that expresses intent beats JS that saves keystrokes.
- Accessible by default, not as an afterthought.
- No horizontal scroll except intentional table overflow.
