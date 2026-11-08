import React, { useState } from "react";
import { Check, Copy, Code } from "lucide-react";

interface AiFormattedTextProps {
  content: string;
  className?: string;
}

const CodeBlock: React.FC<{ language: string; code: string }> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="my-2.5 rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900 text-slate-100 shadow-md">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-800/80 border-b border-slate-700/50 text-[11px] font-mono text-slate-300">
        <span className="flex items-center gap-1.5 uppercase font-semibold text-slate-400">
          <Code className="w-3 h-3 text-indigo-400" />
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-slate-700/60 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] text-emerald-300">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="text-[10px]">Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-[12px] font-mono leading-relaxed text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export const AiFormattedText: React.FC<AiFormattedTextProps> = ({
  content,
  className = "",
}) => {
  if (!content) return null;

  // First, extract fenced code blocks
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const segments: { type: "code" | "text"; content: string; language?: string }[] = [];
  let lastIndex = 0;
  let codeMatch: RegExpExecArray | null;

  while ((codeMatch = codeBlockRegex.exec(content)) !== null) {
    if (codeMatch.index > lastIndex) {
      segments.push({
        type: "text",
        content: content.substring(lastIndex, codeMatch.index),
      });
    }
    segments.push({
      type: "code",
      language: codeMatch[1]?.trim() || "plaintext",
      content: codeMatch[2]?.replace(/\n$/, "") || "",
    });
    lastIndex = codeBlockRegex.lastIndex;
  }

  if (lastIndex < content.length) {
    segments.push({
      type: "text",
      content: content.substring(lastIndex),
    });
  }

  const renderFormattedLine = (text: string) => {
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
    let localIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > localIndex) {
        parts.push(text.substring(localIndex, match.index));
      }

      const matchText = match[0];
      if (matchText.startsWith("**") && matchText.endsWith("**")) {
        const boldInner = matchText.slice(2, -2);
        parts.push(
          <strong key={`bold-${match.index}`} className="font-semibold text-slate-900">
            {boldInner}
          </strong>
        );
      } else if (matchText.startsWith("`") && matchText.endsWith("`")) {
        const codeInner = matchText.slice(1, -1);
        parts.push(
          <code
            key={`code-${match.index}`}
            className="font-mono text-[11px] sm:text-xs px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-medium"
          >
            {codeInner}
          </code>
        );
      }

      localIndex = regex.lastIndex;
    }

    if (localIndex < text.length) {
      parts.push(text.substring(localIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className={`space-y-2.5 text-[13px] sm:text-[13.5px] leading-relaxed text-slate-700 font-normal ${className}`}>
      {segments.map((seg, sIdx) => {
        if (seg.type === "code") {
          return (
            <CodeBlock
              key={`code-block-${sIdx}`}
              language={seg.language || ""}
              code={seg.content}
            />
          );
        }

        const paragraphs = seg.content.split(/\n\n+/);

        return paragraphs.map((para, pIdx) => {
          const trimmed = para.trim();
          if (!trimmed) return null;

          // Check for Header (### or ##)
          if (trimmed.startsWith("### ")) {
            return (
              <h4 key={`h4-${sIdx}-${pIdx}`} className="text-sm font-bold text-slate-900 mt-2 mb-1">
                {renderFormattedLine(trimmed.replace(/^###\s+/, ""))}
              </h4>
            );
          }
          if (trimmed.startsWith("## ")) {
            return (
              <h3 key={`h3-${sIdx}-${pIdx}`} className="text-[15px] font-bold text-slate-900 mt-2.5 mb-1.5">
                {renderFormattedLine(trimmed.replace(/^##\s+/, ""))}
              </h3>
            );
          }

          const lines = para.split("\n");
          const isBulletList = lines.every(
            (line) =>
              line.trim().length === 0 ||
              line.trim().startsWith("• ") ||
              line.trim().startsWith("- ") ||
              line.trim().startsWith("* ")
          );
          const isNumberedList = lines.every(
            (line) => line.trim().length === 0 || /^\d+\.\s/.test(line.trim())
          );

          if (isBulletList && lines.some((l) => l.trim().length > 0)) {
            return (
              <ul key={`ul-${sIdx}-${pIdx}`} className="space-y-1.5 my-1 pl-1">
                {lines.map((line, lIdx) => {
                  if (!line.trim()) return null;
                  const cleanLine = line.trim().replace(/^([•\-*]\s+)/, "");
                  return (
                    <li key={`li-${sIdx}-${pIdx}-${lIdx}`} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                      <span className="flex-1">{renderFormattedLine(cleanLine)}</span>
                    </li>
                  );
                })}
              </ul>
            );
          }

          if (isNumberedList && lines.some((l) => l.trim().length > 0)) {
            return (
              <ol key={`ol-${sIdx}-${pIdx}`} className="space-y-1.5 my-1 pl-1">
                {lines.map((line, lIdx) => {
                  if (!line.trim()) return null;
                  const match = line.trim().match(/^(\d+)\.\s+(.*)$/);
                  const num = match ? match[1] : `${lIdx + 1}`;
                  const text = match ? match[2] : line;
                  return (
                    <li key={`oli-${sIdx}-${pIdx}-${lIdx}`} className="flex items-start gap-2.5">
                      <span className="font-mono text-[11px] font-bold text-indigo-600 px-1.5 py-0.5 rounded bg-indigo-50/70 border border-indigo-100 flex-shrink-0 mt-0.5">
                        {num}
                      </span>
                      <span className="flex-1">{renderFormattedLine(text)}</span>
                    </li>
                  );
                })}
              </ol>
            );
          }

          return (
            <p key={`p-${sIdx}-${pIdx}`} className="whitespace-normal">
              {lines.map((line, lIdx) => (
                <React.Fragment key={`l-${sIdx}-${pIdx}-${lIdx}`}>
                  {lIdx > 0 && <br />}
                  {renderFormattedLine(line)}
                </React.Fragment>
              ))}
            </p>
          );
        });
      })}
    </div>
  );
};
