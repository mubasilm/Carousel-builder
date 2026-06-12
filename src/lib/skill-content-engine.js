/**
 * Skill-based carousel content synthesis without LLM.
 * Uses blog-to-linkedin-carousel + gtm-buddy-marketing-skills heuristics:
 * content-strategy, copywriting, copy-editing, product-marketing, ad-creative, social
 */

import {
  buildCaptionHook,
  buildHookHeadline,
  LINKEDIN_LIMITS,
  pickHookAngle,
  polishCopy,
} from "@/lib/copy-polish";

const CONTRASTS = [
  { pattern: /enablement|prepar/i, eyebrow: "The shift", hook: "Enablement prepares reps. Revenue Activation operates inside the moment." },
  { pattern: /storage|search|find/i, eyebrow: "Architecture", hook: "Storage finds content. Signal Architecture activates revenue." },
  { pattern: /report|dashboard|metric/i, eyebrow: "Beyond reporting", hook: "Reporting shows what happened. Activation changes what happens next." },
];

function words(text) {
  return (text || "").split(/\s+/).filter(Boolean);
}

function wordCount(text) {
  return words(text).length;
}

function trimWords(str, max) {
  return polishCopy(str, { maxWords: max });
}

function paragraphs(text) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 40);
}

function sentences(text) {
  return text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 25);
}

function pickSlideCount(text) {
  const wc = wordCount(text);
  if (wc < 600) return 4;
  if (wc < 1200) return 5;
  if (wc < 2200) return 6;
  return 7;
}

function classifySource(text) {
  const t = text.toLowerCase();
  if (/vs\.|versus|compare|battlecard|wedge/.test(t)) return "competitive";
  if (/architecture|api|engineer|technical|limitation/.test(t)) return "technical";
  if (/framework|step|model|checklist|process|ladder|lever/.test(t)) return "framework";
  return "thought_leadership";
}

function extractThesis(title, paras, sents) {
  if (title && title.length > 10 && title.length < 100) return title;
  const declarative = sents.find((s) => s.length < 120 && /(is|are|must|should|will|can't|cannot)/i.test(s));
  if (declarative) return trimWords(declarative, 14);
  return trimWords(paras[0] || sents[0] || "Revenue Activation changes how GTM teams execute", 14);
}

function makeHook(thesis, sourceType, blogText) {
  const angle = pickHookAngle({ sourceType, thesis, text: blogText });
  const contrast = CONTRASTS.find((c) => c.pattern.test(`${thesis} ${blogText}`));

  if (contrast) {
    return {
      eyebrow: contrast.eyebrow,
      headline: polishCopy(contrast.hook, { maxWords: LINKEDIN_LIMITS.hookHeadlineWords }),
      angle: "comparison",
    };
  }

  const phrase = extractKeyPhrase(thesis);
  return {
    eyebrow: angle === "framework" ? "Revenue Activation" : "The shift",
    headline: buildHookHeadline({ angle, thesis, phrase }),
    angle,
  };
}

function extractKeyPhrase(sentence) {
  const cleaned = sentence.replace(/^(most|many|the|a|an)\s+/i, "");
  const clause = cleaned.split(/[,;:]/)[0];
  return trimWords(clause, 5);
}

function synthesizeHeadline(sentence, index, sourceType, angle) {
  const phrase = extractKeyPhrase(sentence);
  const templates = {
    thought_leadership: [`The pattern behind ${phrase}`, `Why this matters now`, `The implication`, `What changes next`],
    framework: [`Lever ${index + 1}: ${phrase}`, `The model`, `How it works`, `Put it into practice`],
    technical: [`Under the hood`, `The architecture shift`, `What breaks today`, `The real constraint`],
    competitive: [`The old way`, `The new way`, `The gap`, `Why teams switch`],
  };
  const angleTemplates = {
    pain: [`Where teams get stuck`, `The cost of ${phrase}`, `What breaks`, `The fix`],
    outcome: [`The result`, `What changes`, `Why it works`, `Next move`],
    contrarian: [`The myth`, `The real story`, `What to do instead`, `The takeaway`],
  };
  const pool = angleTemplates[angle] || templates[sourceType] || templates.thought_leadership;
  return polishCopy(pool[index % pool.length], { maxWords: LINKEDIN_LIMITS.slideHeadlineWords });
}

function bulletsFromParagraph(para, max = 4) {
  const sents = sentences(para);
  return sents.slice(0, max).map((s) => trimWords(s.replace(/^[-•*]\s*/, ""), 12));
}

function bodyFromIdeas(ideas) {
  if (ideas.length <= 1) return polishCopy(ideas[0] || "", { maxWords: LINKEDIN_LIMITS.bodyWords });
  return ideas
    .map((line) => `• ${polishCopy(line, { maxWords: 12 })}`)
    .join("\n");
}

function pickInsightBlocks(paras, count) {
  const middle = paras.slice(1, -1);
  const pool = middle.length ? middle : paras;
  const picked = [];
  const step = Math.max(1, Math.floor(pool.length / count));
  for (let i = 0; i < count && i * step < pool.length; i += 1) {
    picked.push(pool[i * step]);
  }
  while (picked.length < count && pool.length) {
    picked.push(pool[picked.length % pool.length]);
  }
  return picked.slice(0, count);
}

const VISUAL_BY_TYPE = {
  hook: "Dark forest green cover (#003013), oversized white headline, minimal mark bottom-left",
  problem: "Warm ivory (#f8f6ed), single contrast callout block, left accent bar",
  insight: "Structured diagram or numbered list, pastel workflow module",
  takeaway: "Editorial memo layout, bold closing line, generous whitespace",
  cta: "Split footer: value sentence left, green CTA button right (#00692B)",
};

export function synthesizeCarouselFromBlog({ blogText, title }) {
  const clean = blogText.trim();
  const paras = paragraphs(clean);
  const sents = sentences(clean);
  const sourceType = classifySource(clean);
  const slideCount = pickSlideCount(clean);
  const carouselTitle = title || extractThesis("", paras, sents);
  const thesis = extractThesis(title, paras, sents);
  const hook = makeHook(thesis, sourceType, clean);

  const problemPara = paras[1] || paras[0] || "";
  const problemHeadline =
    hook.angle === "pain" || sourceType === "competitive"
      ? "The old model breaks here"
      : "Where teams get stuck";
  const problemBody = polishCopy(
    sentences(problemPara).find((s) => /struggle|gap|problem|fail|miss|without|cost|stuck/i.test(s)) ||
      sentences(problemPara)[0] ||
      "Most GTM teams still optimize for preparation, not the live revenue moment.",
    { maxWords: LINKEDIN_LIMITS.bodyWords },
  );

  const insightCount = Math.max(1, slideCount - 4);
  const insightBlocks = pickInsightBlocks(paras, insightCount);

  const insightSlides = insightBlocks.map((block, i) => {
    const headline = synthesizeHeadline(block, i, sourceType, hook.angle);
    const bullets = bulletsFromParagraph(block, 4);
    return {
      type: "insight",
      eyebrow: sourceType === "framework" ? `Lever ${i + 1}` : `Insight ${i + 1}`,
      headline,
      body: bodyFromIdeas(bullets.length > 1 ? bullets : [polishCopy(block, { maxWords: 35 })]),
      closing_line: "",
      footer: "",
      visual: VISUAL_BY_TYPE.insight,
      cta: "",
    };
  });

  const takeawaySent =
    sents.find((s) => /must|should|start|next|action|takeaway/i.test(s)) || sents[sents.length - 1] || thesis;

  const slides = [
    {
      type: "hook",
      eyebrow: hook.eyebrow,
      headline: hook.headline,
      body: "",
      closing_line: "",
      footer: "GTM Buddy",
      visual: VISUAL_BY_TYPE.hook,
      cta: "",
    },
    {
      type: "problem",
      eyebrow: "The gap",
      headline: problemHeadline,
      body: problemBody,
      closing_line: "",
      footer: "",
      visual: VISUAL_BY_TYPE.problem,
      cta: "",
    },
    ...insightSlides,
    {
      type: "takeaway",
      eyebrow: "Takeaway",
      headline: "What to do next",
      body: polishCopy(takeawaySent, { maxWords: LINKEDIN_LIMITS.bodyWords }),
      closing_line: polishCopy(thesis, { maxWords: 12 }),
      footer: "",
      visual: VISUAL_BY_TYPE.takeaway,
      cta: "",
    },
    {
      type: "cta",
      eyebrow: "Next step",
      headline: "Want the full argument?",
      body: "The carousel is the compressed version. The blog has frameworks, examples, and nuance.",
      closing_line: "This is the short version. The full blog is in the first comment.",
      footer: "",
      visual: VISUAL_BY_TYPE.cta,
      cta: "Read full blog",
    },
  ].map((s, i) => ({ ...s, index: i + 1 }));

  const carouselStrategy = {
    thesis,
    audience: "B2B revenue leaders, GTM operators, and enablement leaders",
    source_type: sourceType,
    slide_count_rationale: `${slides.length} slides for ${sourceType} source (~${wordCount(clean)} words)`,
  };

  const hookLine = buildCaptionHook({
    hookHeadline: hook.headline,
    thesis,
    sourceType: hook.angle || sourceType,
  });
  const linkedinCaption = [
    hookLine,
    "",
    "Swipe for the breakdown.",
    "",
    carouselStrategy.thesis !== hookLine ? carouselStrategy.thesis : "",
    "",
    "What would you add to this list?",
    "",
    "#RevenueActivation #GTM #B2BSaaS",
  ]
    .filter(Boolean)
    .join("\n")
    .slice(0, 2800);

  return {
    title: carouselTitle,
    slides,
    linkedin_caption: linkedinCaption,
    hashtags: ["RevenueActivation", "GTM", "B2BSaaS", "SalesEnablement", "Marketing"],
    carousel_strategy: carouselStrategy,
    cta_sentence: "This is the short version. The full blog is in the first comment.",
    cta_button: "Read full blog",
    source_type: sourceType,
  };
}
