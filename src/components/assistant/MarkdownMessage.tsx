'use client';

import React from 'react';
import Link from 'next/link';
import { parseMarkdownBlocks } from './markdown-parser';

interface Props {
  content: string;
  isUser?: boolean;
}

function renderInlineMarkdown(text: string, isUser: boolean): React.ReactNode[] {
  const tokenRegex = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\[[^\]]+\]\([^)]+\)|\*[^*\n]+\*)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let keyIdx = 0;

  for (const match of text.matchAll(tokenRegex)) {
    const idx = match.index ?? 0;
    if (idx > lastIndex) {
      parts.push(text.slice(lastIndex, idx));
    }

    const token = match[0];
    if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={`c_${keyIdx++}`}
          className={`px-1.5 py-0.5 rounded text-[11.5px] font-bold font-mono-num ${
            isUser
              ? 'bg-white/15 text-[#EEF773]'
              : 'bg-[var(--bg-muted)] text-[var(--forest-ink)] border border-[var(--border-subtle)]'
          }`}
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (
      (token.startsWith('**') && token.endsWith('**')) ||
      (token.startsWith('__') && token.endsWith('__'))
    ) {
      parts.push(
        <strong key={`b_${keyIdx++}`} className="font-bold">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={`i_${keyIdx++}`} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('[')) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        const safeExternal = href.startsWith('https://') || href.startsWith('http://');
        const safeInternal = href.startsWith('/');
        if (safeInternal) {
          parts.push(
            <Link key={`l_${keyIdx++}`} href={href} className="underline font-bold text-[var(--accent-chili)]">
              {label}
            </Link>
          );
        } else if (safeExternal) {
          parts.push(
            <a
              key={`a_${keyIdx++}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold text-[var(--accent-chili)]"
            >
              {label}
            </a>
          );
        } else {
          parts.push(label);
        }
      } else {
        parts.push(token);
      }
    }

    lastIndex = idx + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export function MarkdownMessage({ content, isUser = false }: Props) {
  const blocks = parseMarkdownBlocks(content);

  return (
    <div className="space-y-2.5 text-[13px] leading-[20px]">
      {blocks.map((block, idx) => {
        if (block.type === 'hr') {
          return <hr key={idx} className="border-t border-[var(--border-subtle)] my-2" />;
        }

        if (block.type === 'heading') {
          const sizeClass =
            block.level <= 2
              ? 'text-[14px] sm:text-[15px] font-bold pt-1'
              : 'text-[13px] font-bold pt-0.5 text-[var(--accent-chili)]';
          return (
            <div key={idx} className={sizeClass}>
              {renderInlineMarkdown(block.text, isUser)}
            </div>
          );
        }

        if (block.type === 'code') {
          return (
            <pre
              key={idx}
              className="p-3 rounded-xl bg-[#132E20] text-[#F9F3EE] text-[11px] font-mono overflow-x-auto border border-[var(--border-ink)]"
            >
              <code>{block.code}</code>
            </pre>
          );
        }

        if (block.type === 'blockquote') {
          return (
            <blockquote
              key={idx}
              className="border-l-4 border-[var(--accent-chili)] bg-[var(--bg-paper)]/70 pl-3 pr-2 py-1.5 rounded-r-lg text-[12px] text-[var(--text-secondary)] italic space-y-1"
            >
              {block.lines.map((line, lIdx) => (
                <p key={lIdx}>{renderInlineMarkdown(line, isUser)}</p>
              ))}
            </blockquote>
          );
        }

        if (block.type === 'table') {
          return (
            <div
              key={idx}
              className="overflow-x-auto rounded-xl border border-[var(--border-ink)] bg-[var(--bg-paper)]"
            >
              <table className="w-full text-left border-collapse text-[11.5px]">
                <thead className="bg-[var(--bg-muted)] border-b border-[var(--border-ink)]">
                  <tr>
                    {block.headers.map((h, hIdx) => (
                      <th key={hIdx} className="px-2.5 py-2 font-bold text-[var(--text-primary)] whitespace-nowrap">
                        {renderInlineMarkdown(h, isUser)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {block.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[var(--bg-muted)]/35">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-2.5 py-1.5 text-[var(--text-primary)] font-mono-num">
                          {renderInlineMarkdown(cell, isUser)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === 'ul') {
          return (
            <ul key={idx} className="space-y-1.5 pl-0.5">
              {block.items.map((item, iIdx) => (
                <li key={iIdx} className="flex items-start gap-2">
                  <span
                    className={`mt-[7px] w-1.5 h-1.5 rounded-full shrink-0 ${
                      isUser ? 'bg-[#EEF773]' : 'bg-[var(--accent-chili)]'
                    }`}
                  />
                  <span className="flex-1">{renderInlineMarkdown(item, isUser)}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'ol') {
          return (
            <ol key={idx} className="space-y-1.5 pl-0.5">
              {block.items.map((item, iIdx) => (
                <li key={iIdx} className="flex items-start gap-2">
                  <span
                    className={`mt-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                      isUser
                        ? 'bg-[#EEF773] text-[#132E20]'
                        : 'bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-ink)]'
                    }`}
                  >
                    {iIdx + 1}
                  </span>
                  <span className="flex-1">{renderInlineMarkdown(item, isUser)}</span>
                </li>
              ))}
            </ol>
          );
        }

        return (
          <div key={idx} className="space-y-1">
            {block.lines.map((line, lIdx) => (
              <p key={lIdx}>{renderInlineMarkdown(line, isUser)}</p>
            ))}
          </div>
        );
      })}
    </div>
  );
}
