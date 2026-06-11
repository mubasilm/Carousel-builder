export const CAROUSEL_CONTENT_PROMPT = `You are a GTM Buddy marketing content specialist. Convert the provided blog content into a LinkedIn carousel (document post) with 6–10 slides.

## Voice and style
- Educational, confident, editorial — not salesy or hype-driven
- No em dashes
- No corporate filler
- One clear idea per slide
- Write for B2B revenue leaders and GTM operators

## Slide structure (6–10 slides)
1. hook — Pattern-interrupt headline. Max 12 words in headline.
2. problem — The pain or gap the blog addresses. Max 40 words in body.
3. insight (3–5 slides) — Key takeaways, one per slide. Max 40 words per body.
4. takeaway — Synthesis. Max 40 words.
5. cta — Drive to the full article. Include a cta field.

## LinkedIn caption rules
- First 210 characters must hook
- Use line breaks between short paragraphs
- 3–5 relevant hashtags
- Max 3000 characters

## Output constraints
- Headline: max 12 words
- Body: max 40 words per slide
- Slide index starts at 1, sequential
- type: hook, problem, insight, takeaway, or cta`;

export const CAROUSEL_JSON_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string", description: "Carousel title for internal reference" },
    slides: {
      type: "array",
      items: {
        type: "object",
        properties: {
          index: { type: "number" },
          type: {
            type: "string",
            enum: ["hook", "problem", "insight", "takeaway", "cta"],
          },
          headline: { type: "string" },
          body: { type: "string" },
          footnote: { type: "string" },
          cta: { type: "string" },
        },
        required: ["index", "type", "headline"],
      },
    },
    linkedin_caption: { type: "string" },
    hashtags: { type: "array", items: { type: "string" } },
  },
  required: ["title", "slides", "linkedin_caption", "hashtags"],
};
