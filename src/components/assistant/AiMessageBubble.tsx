'use client';

import Link from 'next/link';
import { ArrowSquareOut, Scales, Tag } from '@phosphor-icons/react';
import { AssistantMessage } from '@/types/assistant';
import { MarkdownMessage } from './MarkdownMessage';

interface Props {
  message: AssistantMessage;
  onNavigate?: () => void;
}

export function AiMessageBubble({ message, onNavigate }: Props) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="max-w-[88%] rounded-2xl rounded-tr-xs px-4 py-3 bg-[#132E20] text-[#F9F3EE] border-2 border-[var(--border-ink)] shadow-xs">
          <MarkdownMessage content={message.content} isUser />
        </div>
        <span className="text-[10px] text-[var(--text-muted)] px-1 font-mono-num">
          Anda &bull; {message.timestamp}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="max-w-[94%] rounded-2xl rounded-tl-xs p-3.5 sm:p-4 bg-[var(--bg-card)] border-2 border-[var(--border-ink)] text-[var(--text-primary)] shadow-[2px_2px_0px_var(--border-ink)] space-y-3">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#EEF773] border border-[#132E20] text-[#132E20] text-[11px] font-bold flex items-center justify-center shrink-0">
              P
            </span>
            <span className="text-[12px] font-bold text-[var(--text-primary)]">PUNTEN</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                message.provider === 'gemini'
                  ? 'bg-[#E2EFE6] text-[#132E20] border-[#245034]/40'
                  : 'bg-[var(--bg-muted)] text-[var(--text-secondary)] border-[var(--border-subtle)]'
              }`}
            >
              {message.provider === 'gemini' ? 'Gemini AI' : 'Acuan DB'}
            </span>
          </div>
          <span className="text-[10px] text-[var(--text-muted)] font-mono-num">
            {message.timestamp}
          </span>
        </div>

        <MarkdownMessage content={message.content} />

        {message.sourceComparisons && message.sourceComparisons.length > 0 && (
          <div className="pt-2.5 border-t border-[var(--border-subtle)] space-y-2.5">
            {message.sourceComparisons.map((cmp) => (
              <div
                key={cmp.commodityName}
                className="rounded-xl bg-[var(--bg-paper)] border border-[var(--border-ink)] p-2.5 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2 text-[11px] font-bold">
                  <span className="inline-flex items-center gap-1.5 text-[var(--accent-chili)]">
                    <Scales size={13} weight="bold" />
                    <span>{cmp.commodityName}</span>
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">/{cmp.unit}</span>
                </div>

                <div className="space-y-1">
                  {cmp.sources.map((src) => (
                    <div
                      key={src.sourceName}
                      className={`flex items-center justify-between gap-2 text-[11px] px-2.5 py-1 rounded-lg ${
                        src.isLowest
                          ? 'bg-[#E2EFE6] text-[#132E20] font-bold border border-[#245034]/35'
                          : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      <span className="truncate">{src.sourceName}</span>
                      <span className="font-mono-num shrink-0">
                        Rp {src.price.toLocaleString('id-ID')}
                        {src.isLowest ? ' (Hemat)' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {message.referencedCommodities && message.referencedCommodities.length > 0 && (
          <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-wrap gap-1.5">
            {message.referencedCommodities.map((com) => (
              <div
                key={com.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[11px]"
              >
                <Tag size={11} weight="bold" className="text-[var(--accent-chili)]" />
                <span className="font-semibold">{com.name}</span>
                <span className="font-mono-num font-bold text-[var(--forest-ink)]">
                  Rp {com.currentPrice.toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        )}

        {message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-wrap gap-2">
            {message.suggestedActions.map((act) => (
              <Link
                key={act.href}
                href={act.href}
                onClick={onNavigate}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--bg-muted)] hover:bg-[#EEF773] hover:text-[#132E20] text-[var(--text-primary)] border border-[var(--border-ink)] text-[11px] font-bold transition-colors"
              >
                <span>{act.label}</span>
                <ArrowSquareOut size={11} weight="bold" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

