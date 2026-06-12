/**
 * Copy polish helpers distilled from gtm-buddy-marketing-skills:
 * copy-editing, copywriting, ad-creative
 */

const WEASEL_WORDS =
  /\b(almost|very|really|just|simply|basically|literally|actually|quite|rather|somewhat|perhaps|maybe|might|could potentially|in order to|utilize|leverage|facilitate|streamline|optimize|innovative|cutting-edge|best-in-class|world-class|robust|seamless|synergy|paradigm)\b/gi;

const EM_DASH = /[\u2014\u2013]/g;

export function polishCopy(text, { maxWords } = {}) {
  if (!text) return "";
  let out = text
    .replace(EM_DASH, ", ")
    .replace(WEASEL_WORDS, "")
    .replace(/\s{2,}/g, " ")
    .replace(/,\s*,/g, ",")
    .trim();

  if (maxWords) {
    const words = out.split(/\s+/).filter(Boolean);
    if (words.length > maxWords) {
      out = `${words.slice(0, maxWords).join(" ")}`;
    }
  }
  return out;
}

/** LinkedIn carousel limits from ad-creative + social skills */
export const LINKEDIN_LIMITS = {
  hookHeadlineWords: 12,
  slideHeadlineWords: 10,
  bodyWords: 40,
  captionHookChars: 210,
  eyebrowWords: 3,
};

/** Ad-creative angle categories mapped to carousel hooks */
export function pickHookAngle({ sourceType, thesis, text }) {
  const t = `${thesis} ${text}`.toLowerCase();

  if (/wrong|myth|unpopular|contrarian|stop|instead|not what you think/.test(t)) {
    return "contrarian";
  }
  if (/vs\.|versus|compare|unlike|old way|new way|storage|enablement/.test(t)) {
    return "comparison";
  }
  if (sourceType === "competitive" || /gap|fail|struggle|without|broken/.test(t)) {
    return "pain";
  }
  if (/\d+%|\d+x|double|triple|cut|reduce|faster|hours|minutes/.test(t)) {
    return "outcome";
  }
  if (sourceType === "framework" || /step|model|framework|lever|checklist/.test(t)) {
    return "framework";
  }
  if (/\?|what if|why|how/.test(thesis)) {
    return "curiosity";
  }
  return "thought_leadership";
}

export function buildHookHeadline({ angle, thesis, phrase }) {
  const p = phrase || thesis;
  const templates = {
    contrarian: `Unpopular opinion: ${p}`,
    comparison: `${p} is not the real comparison`,
    pain: `Where teams get stuck on ${p}`,
    outcome: `The shift behind ${p}`,
    framework: `${p}: the model in one pass`,
    curiosity: thesis.endsWith("?") ? thesis : `What if ${p.toLowerCase()}?`,
    thought_leadership: p,
  };
  return polishCopy(templates[angle] || templates.thought_leadership, {
    maxWords: LINKEDIN_LIMITS.hookHeadlineWords,
  });
}

export function buildCaptionHook({ hookHeadline, thesis, sourceType }) {
  const hooks = {
    contrarian: `Unpopular opinion: ${hookHeadline}`,
    comparison: hookHeadline,
    pain: `Most teams miss this: ${hookHeadline}`,
    outcome: hookHeadline,
    framework: `Framework breakdown: ${hookHeadline}`,
    curiosity: hookHeadline,
    thought_leadership: hookHeadline,
  };
  const line = hooks[sourceType] || hookHeadline;
  return polishCopy(line).slice(0, LINKEDIN_LIMITS.captionHookChars);
}
