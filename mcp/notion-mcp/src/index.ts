#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { Client } from "@notionhq/client";
import fs from "node:fs/promises";
import path from "node:path";

// --- Environment and Notion client setup ---
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DEFAULT_PARENT_PAGE_ID = process.env.NOTION_PARENT_PAGE_ID;

if (!NOTION_TOKEN) {
  // Fail fast: this server requires a Notion token in env
  throw new Error("NOTION_TOKEN environment variable is required for notion-mcp.");
}

const notion = new Client({ auth: NOTION_TOKEN });

// --- Types ---
type RichText = {
  type: "text";
  text: { content: string; link?: { url: string } | null };
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: string;
  };
  plain_text?: string;
  href?: string | null;
};

type NotionBlock =
  | {
      object?: "block";
      type: "paragraph";
      paragraph: { rich_text: RichText[] };
    }
  | {
      object?: "block";
      type: "heading_1";
      heading_1: { rich_text: RichText[] };
    }
  | {
      object?: "block";
      type: "heading_2";
      heading_2: { rich_text: RichText[] };
    }
  | {
      object?: "block";
      type: "heading_3";
      heading_3: { rich_text: RichText[] };
    }
  | {
      object?: "block";
      type: "bulleted_list_item";
      bulleted_list_item: { rich_text: RichText[] };
    }
  | {
      object?: "block";
      type: "numbered_list_item";
      numbered_list_item: { rich_text: RichText[] };
    }
  | {
      object?: "block";
      type: "quote";
      quote: { rich_text: RichText[] };
    }
  | {
      object?: "block";
      type: "code";
      code: { rich_text: RichText[]; language?: string };
    }
  | { object?: "block"; type: "divider"; divider: {} };

// --- Helpers ---

function text(content: string): RichText {
  return {
    type: "text",
    text: { content },
  };
}

function toParagraph(line: string): NotionBlock {
  return { type: "paragraph", paragraph: { rich_text: [text(line)] } };
}

function toHeading(level: 1 | 2 | 3, line: string): NotionBlock {
  const content = line.replace(/^#{1,3}\s*/, "");
  if (level === 1) return { type: "heading_1", heading_1: { rich_text: [text(content)] } };
  if (level === 2) return { type: "heading_2", heading_2: { rich_text: [text(content)] } };
  return { type: "heading_3", heading_3: { rich_text: [text(content)] } };
}

function toBullet(line: string): NotionBlock {
  const content = line.replace(/^(\s*[-*+])\s+/, "");
  return { type: "bulleted_list_item", bulleted_list_item: { rich_text: [text(content)] } };
}

function toNumbered(line: string): NotionBlock {
  const content = line.replace(/^\s*\d+\.\s+/, "");
  return { type: "numbered_list_item", numbered_list_item: { rich_text: [text(content)] } };
}

function toQuote(line: string): NotionBlock {
  const content = line.replace(/^\s*>\s*/, "");
  return { type: "quote", quote: { rich_text: [text(content)] } };
}

function toCodeBlock(lines: string[], language?: string): NotionBlock {
  return {
    type: "code",
    code: { rich_text: [text(lines.join("\n"))], language: (language || "plain_text") as any },
  };
}

// Minimal Markdown → Notion blocks converter
function markdownToBlocks(md: string): NotionBlock[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks: NotionBlock[] = [];
  let i = 0;
  let codeOpen = false;
  let codeLang: string | undefined = undefined;
  let codeLines: string[] = [];

  const flushParagraphBuffer = (buffer: string[]) => {
    if (buffer.length === 0) return;
    const paragraphText = buffer.join(" ").trim();
    if (paragraphText.length > 0) {
      blocks.push(toParagraph(paragraphText));
    }
    buffer.length = 0;
  };

  const paragraphBuffer: string[] = [];

  while (i < lines.length) {
    const raw = lines[i];

    // Code fences ```lang
    const codeFenceMatch = raw.match(/^```(\w+)?\s*$/);
    if (codeFenceMatch) {
      if (!codeOpen) {
        // opening fence
        codeOpen = true;
        codeLang = codeFenceMatch[1]?.toLowerCase();
        flushParagraphBuffer(paragraphBuffer);
      } else {
        // closing fence
        blocks.push(toCodeBlock(codeLines, codeLang));
        codeOpen = false;
        codeLines = [];
        codeLang = undefined;
      }
      i++;
      continue;
    }

    if (codeOpen) {
      codeLines.push(raw);
      i++;
      continue;
    }

    // Divider
    if (/^\s*---\s*$/.test(raw)) {
      flushParagraphBuffer(paragraphBuffer);
      blocks.push({ type: "divider", divider: {} } as any);
      i++;
      continue;
    }

    // Headings
    if (/^#{3}\s+/.test(raw)) {
      flushParagraphBuffer(paragraphBuffer);
      blocks.push(toHeading(3, raw));
      i++;
      continue;
    }
    if (/^#{2}\s+/.test(raw)) {
      flushParagraphBuffer(paragraphBuffer);
      blocks.push(toHeading(2, raw));
      i++;
      continue;
    }
    if (/^#\s+/.test(raw)) {
      flushParagraphBuffer(paragraphBuffer);
      blocks.push(toHeading(1, raw));
      i++;
      continue;
    }

    // Quote
    if (/^\s*>\s+/.test(raw)) {
      flushParagraphBuffer(paragraphBuffer);
      blocks.push(toQuote(raw));
      i++;
      continue;
    }

    // Bulleted list
    if (/^\s*[-*+]\s+/.test(raw)) {
      flushParagraphBuffer(paragraphBuffer);
      blocks.push(toBullet(raw));
      i++;
      continue;
    }

    // Numbered list
    if (/^\s*\d+\.\s+/.test(raw)) {
      flushParagraphBuffer(paragraphBuffer);
      blocks.push(toNumbered(raw));
      i++;
      continue;
    }

    // Blank line → paragraph break
    if (/^\s*$/.test(raw)) {
      flushParagraphBuffer(paragraphBuffer);
      i++;
      continue;
    }

    // Accumulate paragraph
    paragraphBuffer.push(raw.trim());
    i++;
  }

  // Flush last paragraph
  if (paragraphBuffer.length > 0) {
    flushParagraphBuffer(paragraphBuffer);
  }

  return blocks;
}

// Search for a child page by title under a specific parent page using Notion search and filtering by parent.page_id
async function findChildPageByTitle(parentPageId: string, title: string): Promise<string | null> {
  const search: any = await notion.search({
    query: title,
    filter: { value: "page", property: "object" },
    sort: { direction: "descending", timestamp: "last_edited_time" },
    page_size: 50,
  });

  for (const res of (search.results as any[])) {
    if (res.object === "page" && res.parent?.type === "page_id" && res.parent.page_id === parentPageId) {
      // Extract page title from properties or title field
      const pageTitle =
        res.properties?.title?.title?.[0]?.plain_text ??
        res.properties?.Name?.title?.[0]?.plain_text ??
        res.properties?.["Title"]?.title?.[0]?.plain_text ??
        res.properties?.["Page"]?.title?.[0]?.plain_text ??
        (res as any).title?.[0]?.plain_text;

      // If query returns multiple with same parent, choose exact match on title when possible
      if (!pageTitle || pageTitle.trim() === title.trim()) {
        return res.id;
      }
    }
  }
  return null;
}

// Replace page content blocks by archiving existing children and appending new blocks
async function replacePageContent(pageId: string, blocks: NotionBlock[]): Promise<void> {
  // List children and archive them
  let cursor: string | undefined = undefined;
  do {
    const resp: any = await notion.blocks.children.list({ block_id: pageId, start_cursor: cursor, page_size: 100 });
    for (const blk of resp.results) {
      // Archive existing block
      await notion.blocks.update({ block_id: (blk as any).id, archived: true } as any);
    }
    cursor = resp.has_more ? resp.next_cursor ?? undefined : undefined;
  } while (cursor);

  // Append new content
  // Notion API allows 100 children per request; chunk if needed
  const chunkSize = 90;
  for (let idx = 0; idx < blocks.length; idx += chunkSize) {
    const slice = blocks.slice(idx, idx + chunkSize) as any[];
    await notion.blocks.children.append({ block_id: pageId, children: slice });
  }
}

// Create a new page under a parent with given title and optional icon/cover
async function createPageUnderParent(parentPageId: string, title: string, children?: NotionBlock[], options?: { icon?: string; coverUrl?: string }) {
  const properties: Record<string, any> = {
    title: [
      {
        type: "text",
        text: { content: title },
      },
    ],
  };

  // Create page without children, then append in chunks to respect Notion's 100 children limit
  const page = await notion.pages.create({
    parent: { page_id: parentPageId },
    properties,
    icon: options?.icon ? ({ type: "emoji", emoji: options.icon } as any) : undefined,
    cover: options?.coverUrl ? { type: "external", external: { url: options.coverUrl } } : undefined
  });

  const pageId = (page as any).id;

  if (children && children.length) {
    const chunkSize = 90;
    for (let idx = 0; idx < children.length; idx += chunkSize) {
      const slice = children.slice(idx, idx + chunkSize) as any[];
      await notion.blocks.children.append({ block_id: pageId, children: slice });
    }
  }

  return pageId;
}

// Upsert page by title under parent: create if not exists, else replace its content
async function upsertPage(parentPageId: string, title: string, blocks: NotionBlock[], opts?: { icon?: string; coverUrl?: string; clearExisting?: boolean }) {
  const existingId = await findChildPageByTitle(parentPageId, title);
  if (!existingId) {
    return await createPageUnderParent(parentPageId, title, blocks, { icon: opts?.icon, coverUrl: opts?.coverUrl });
  }
  if (opts?.clearExisting !== false) {
    await replacePageContent(existingId, blocks);
  } else {
    // Append without clearing
    const chunkSize = 90;
    for (let idx = 0; idx < blocks.length; idx += chunkSize) {
      const slice = blocks.slice(idx, idx + chunkSize) as any[];
      await notion.blocks.children.append({ block_id: existingId, children: slice });
    }
  }
  return existingId;
}

// --- MCP Server ---

const server = new McpServer({
  name: "notion-mcp",
  version: "0.1.0",
});

// NOTE: McpServer.tool expects a ZodRawShape (plain object mapping param names to zod validators),
// not a ZodObject instance. Use shapes below.

// create_page tool
server.tool(
  "create_page",
  {
    title: z.string().min(1).describe("Title for the Notion page"),
    parentPageId: z.string().optional().describe("Destination parent page ID; defaults to NOTION_PARENT_PAGE_ID"),
    icon: z.string().optional().describe("Emoji icon for the page, e.g., 🕒"),
    coverUrl: z.string().url().optional().describe("External cover image URL"),
    content: z.string().optional().describe("Optional Markdown content to include in the page"),
  },
  async ({ title, parentPageId, icon, coverUrl, content }) => {
    const parent = parentPageId ?? DEFAULT_PARENT_PAGE_ID;
    if (!parent) {
      return {
        content: [{ type: "text", text: "Missing parent page id. Provide parentPageId or set NOTION_PARENT_PAGE_ID." }],
        isError: true,
      };
    }
    const blocks = content ? markdownToBlocks(content) : [];
    const pageId = await createPageUnderParent(parent, title, blocks, { icon, coverUrl });
    return {
      content: [{ type: "text", text: JSON.stringify({ pageId }, null, 2) }],
    };
  }
);

// set_page_properties tool
server.tool(
  "set_page_properties",
  {
    pageId: z.string().min(5).describe("Target Notion page ID"),
    properties: z.record(z.any()).describe("Raw Notion properties payload to merge into the page"),
  },
  async ({ pageId, properties }) => {
    const resp = await notion.pages.update({ page_id: pageId, properties } as any);
    return {
      content: [{ type: "text", text: JSON.stringify({ pageId: (resp as any).id, last_edited_time: (resp as any).last_edited_time }, null, 2) }],
    };
  }
);

// upload_markdown tool
server.tool(
  "upload_markdown",
  {
    filePath: z.string().min(1).describe("Local Markdown file path to upload"),
    title: z.string().optional().describe("Title for the page; defaults to first H1 or filename"),
    parentPageId: z.string().optional().describe("Destination parent page ID; defaults to NOTION_PARENT_PAGE_ID"),
    upsert: z.boolean().optional().describe("If true, update existing page with same title under parent"),
    clearExisting: z.boolean().optional().describe("When upserting, clear existing content before upload (default: true)"),
    icon: z.string().optional().describe("Emoji icon"),
    coverUrl: z.string().url().optional().describe("External cover image URL"),
  },
  async ({ filePath, title, parentPageId, upsert = true, clearExisting = true, icon, coverUrl }) => {
    const parent = parentPageId ?? DEFAULT_PARENT_PAGE_ID;
    if (!parent) {
      return {
        content: [{ type: "text", text: "Missing parent page id. Provide parentPageId or set NOTION_PARENT_PAGE_ID." }],
        isError: true,
      };
    }

    const absPath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
    const md = await fs.readFile(absPath, "utf8");
    const blocks = markdownToBlocks(md);

    // Title fallback: first H1 or filename
    let resolvedTitle = title;
    if (!resolvedTitle) {
      const h1Line = md.split("\n").find((l) => /^#\s+/.test(l));
      if (h1Line) resolvedTitle = h1Line.replace(/^#\s+/, "").trim();
    }
    if (!resolvedTitle) resolvedTitle = path.basename(absPath).replace(/\.[^.]+$/, "").replace(/[-_]/g, " ").trim();

    let pageId: string;
    if (upsert) {
      pageId = await upsertPage(parent, resolvedTitle, blocks, { icon, coverUrl, clearExisting });
    } else {
      pageId = await createPageUnderParent(parent, resolvedTitle, blocks, { icon, coverUrl });
    }

    return {
      content: [{ type: "text", text: JSON.stringify({ pageId, title: resolvedTitle, parentId: parent }, null, 2) }],
    };
  }
);

// upsert_page tool
server.tool(
  "upsert_page",
  {
    title: z.string().min(1).describe("Title for the page"),
    parentPageId: z.string().optional().describe("Destination parent page ID; defaults to NOTION_PARENT_PAGE_ID"),
    content: z.string().optional().describe("Markdown content to upload"),
    filePath: z.string().optional().describe("Local Markdown file path (used if content is not supplied)"),
    clearExisting: z.boolean().optional().describe("Clear existing content before upload (default: true)"),
    icon: z.string().optional().describe("Emoji icon"),
    coverUrl: z.string().url().optional().describe("External cover image URL"),
  },
  async ({ title, parentPageId, content, filePath, clearExisting = true, icon, coverUrl }) => {
    const parent = parentPageId ?? DEFAULT_PARENT_PAGE_ID;
    if (!parent) {
      return {
        content: [{ type: "text", text: "Missing parent page id. Provide parentPageId or set NOTION_PARENT_PAGE_ID." }],
        isError: true,
      };
    }
    let md = content ?? "";
    if (!md && filePath) {
      const abs = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
      md = await fs.readFile(abs, "utf8");
    }
    const blocks = markdownToBlocks(md);
    const pageId = await upsertPage(parent, title, blocks, { icon, coverUrl, clearExisting });
    return {
      content: [{ type: "text", text: JSON.stringify({ pageId, title, parentId: parent }, null, 2) }],
    };
  }
);

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("notion-mcp server running on stdio");