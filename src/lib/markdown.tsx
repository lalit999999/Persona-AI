"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface TextBlock {
  type: "text";
  content: string;
}

interface CodeBlock {
  type: "code";
  lang: string;
  content: string;
}

type Block = TextBlock | CodeBlock;

const FENCE_RE = /```(\w*)\n?([\s\S]*?)```/g;

function parseBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  FENCE_RE.lastIndex = 0;
  while ((match = FENCE_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    blocks.push({
      type: "code",
      lang: match[1] || "",
      content: match[2].replace(/\n$/, ""),
    });
    lastIndex = FENCE_RE.lastIndex;
  }

  if (lastIndex < text.length) {
    blocks.push({ type: "text", content: text.slice(lastIndex) });
  }

  return blocks;
}

function renderInline(segment: string, keyPrefix: string) {
  const parts = segment.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={key} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
      return (
        <code
          key={key}
          className="rounded bg-stormy-charcoal/10 px-1.5 py-0.5 font-mono text-[0.85em]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part
      .split("\n")
      .map((line, j, arr) => (
        <span key={`${key}-${j}`}>
          {line}
          {j < arr.length - 1 && <br />}
        </span>
      ));
  });
}

function TextParagraphs({ content }: { content: string }) {
  const paragraphs = content.split(/\n{2,}/).filter((p) => p.trim().length > 0);
  return (
    <>
      {paragraphs.map((para, i) => (
        <p key={i} className={i > 0 ? "mt-3" : undefined}>
          {renderInline(para, `p${i}`)}
        </p>
      ))}
    </>
  );
}

function CodeBlockView({ lang, content }: { lang: string; content: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — no-op
    }
  }

  return (
    <div className="my-3 overflow-hidden rounded-xl bg-stormy-charcoal text-stormy-ice shadow-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5">
        <span className="font-mono text-xs text-stormy-ice/70">
          {lang || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-stormy-ice/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stormy-sky"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-sm leading-relaxed">
        <code>{content}</code>
      </pre>
    </div>
  );
}

export function MarkdownContent({ text }: { text: string }) {
  const blocks = parseBlocks(text);
  return (
    <div className="text-sm leading-relaxed">
      {blocks.map((block, i) =>
        block.type === "code" ? (
          <CodeBlockView key={i} lang={block.lang} content={block.content} />
        ) : (
          <TextParagraphs key={i} content={block.content} />
        ),
      )}
    </div>
  );
}
