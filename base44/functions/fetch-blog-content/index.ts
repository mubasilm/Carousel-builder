import { createClientFromRequest } from "npm:@base44/sdk";

function stripHtml(html: string): string {
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/gi, "");

  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/p>/gi, "\n\n");
  text = text.replace(/<\/h[1-6]>/gi, "\n\n");
  text = text.replace(/<[^>]+>/g, " ");
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  return text.replace(/\s+/g, " ").replace(/\n\s+/g, "\n").trim();
}

function extractTitle(html: string): string {
  const ogMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
  if (ogMatch) return ogMatch[1].trim();

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) return titleMatch[1].trim();

  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match) return h1Match[1].trim();

  return "Untitled Blog";
}

function extractMainContent(html: string): string {
  const articleMatch = html.match(/<article[\s\S]*?<\/article>/i);
  if (articleMatch) return stripHtml(articleMatch[0]);

  const mainMatch = html.match(/<main[\s\S]*?<\/main>/i);
  if (mainMatch) return stripHtml(mainMatch[0]);

  return stripHtml(html).slice(0, 15000);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: "Authentication required" }, { status: 401 });
    }

    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return Response.json({ error: "Invalid URL" }, { status: 400 });
    }

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return Response.json({ error: "Only HTTP/HTTPS URLs are supported" }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "GTM-Buddy-BlogCarousel/1.0",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return Response.json(
        {
          error: `Could not fetch URL (${response.status}). Try pasting the blog content instead.`,
          success: false,
        },
        { status: 422 },
      );
    }

    const html = await response.text();
    const title = extractTitle(html);
    const body = extractMainContent(html);

    if (body.length < 200) {
      return Response.json(
        {
          error: "Could not extract enough content from this page. Try pasting the blog content instead.",
          success: false,
          title,
          body,
        },
        { status: 422 },
      );
    }

    return Response.json({
      success: true,
      title,
      body,
      source_url: url,
    });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch blog content",
        success: false,
      },
      { status: 500 },
    );
  }
});
