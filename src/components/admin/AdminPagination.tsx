'use client';

import { useState } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  itemLabel?: string;
  onPageChange: (page: number) => void;
}

type PageItem =
  | { type: 'page'; page: number; key: string }
  | { type: 'ellipsis'; hiddenPages: number[]; key: string };

function getPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => ({
      type: 'page',
      page: i + 1,
      key: `page-${i + 1}`,
    }));
  }

  const items: PageItem[] = [];

  if (currentPage <= 3) {
    for (let p = 1; p <= 3; p++) {
      items.push({ type: 'page', page: p, key: `page-${p}` });
    }
    const hidden: number[] = [];
    for (let p = 4; p < totalPages; p++) {
      hidden.push(p);
    }
    if (hidden.length > 0) {
      items.push({ type: 'ellipsis', hiddenPages: hidden, key: 'ellipsis-right' });
    }
    items.push({ type: 'page', page: totalPages, key: `page-${totalPages}` });
  } else if (currentPage >= totalPages - 2) {
    items.push({ type: 'page', page: 1, key: 'page-1' });
    const hidden: number[] = [];
    for (let p = 2; p < totalPages - 2; p++) {
      hidden.push(p);
    }
    if (hidden.length > 0) {
      items.push({ type: 'ellipsis', hiddenPages: hidden, key: 'ellipsis-left' });
    }
    for (let p = totalPages - 2; p <= totalPages; p++) {
      items.push({ type: 'page', page: p, key: `page-${p}` });
    }
  } else {
    items.push({ type: 'page', page: 1, key: 'page-1' });

    const hiddenLeft: number[] = [];
    for (let p = 2; p < currentPage; p++) {
      hiddenLeft.push(p);
    }
    if (hiddenLeft.length > 0) {
      items.push({ type: 'ellipsis', hiddenPages: hiddenLeft, key: 'ellipsis-left' });
    }

    items.push({ type: 'page', page: currentPage, key: `page-${currentPage}` });

    const hiddenRight: number[] = [];
    for (let p = currentPage + 1; p < totalPages; p++) {
      hiddenRight.push(p);
    }
    if (hiddenRight.length > 0) {
      items.push({ type: 'ellipsis', hiddenPages: hiddenRight, key: 'ellipsis-right' });
    }

    items.push({ type: 'page', page: totalPages, key: `page-${totalPages}` });
  }

  return items;
}

export function AdminPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  itemLabel = 'pasar tradisional',
  onPageChange,
}: AdminPaginationProps) {
  const [activeEllipsisKey, setActiveEllipsisKey] = useState<string | null>(null);

  const effectiveTotalPages = Math.max(1, totalPages);
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const pageItems = getPageItems(currentPage, effectiveTotalPages);

  return (
    <div className="market-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="text-xs text-[var(--text-secondary)]">
        Menampilkan <span className="font-mono-num font-bold text-[var(--text-primary)]">{startIndex}</span> s.d.{' '}
        <span className="font-mono-num font-bold text-[var(--text-primary)]">{endIndex}</span> dari{' '}
        <span className="font-mono-num font-bold text-[var(--text-primary)]">{totalItems}</span> {itemLabel}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => {
            setActiveEllipsisKey(null);
            onPageChange(Math.max(1, currentPage - 1));
          }}
          className="market-btn-secondary w-8 h-8 p-0 inline-flex items-center justify-center text-xs disabled:opacity-40"
          title="Halaman Sebelumnya"
        >
          <CaretLeft size={14} weight="bold" />
        </button>

        {pageItems.map((item) => {
          if (item.type === 'page') {
            const isSelected = currentPage === item.page;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setActiveEllipsisKey(null);
                  onPageChange(item.page);
                }}
                className={`w-8 h-8 p-0 inline-flex items-center justify-center font-mono-num text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'market-btn-primary'
                    : 'market-btn-secondary font-bold'
                }`}
              >
                {item.page}
              </button>
            );
          }

          const isOpen = activeEllipsisKey === item.key;

          return (
            <div key={item.key} className="relative">
              <button
                type="button"
                onClick={() =>
                  setActiveEllipsisKey((prev) => (prev === item.key ? null : item.key))
                }
                className={`w-8 h-8 p-0 inline-flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                  isOpen ? 'market-btn-primary' : 'market-btn-secondary'
                }`}
                title="Klik untuk memilih halaman lain"
              >
                ...
              </button>

              {isOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setActiveEllipsisKey(null)}
                  />
                  <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 z-40 market-card p-2.5 flex flex-col gap-1.5 min-w-[148px]">
                    <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider px-1 text-center">
                      Pilih Halaman
                    </div>
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      {item.hiddenPages.map((hp) => (
                        <button
                          key={hp}
                          type="button"
                          onClick={() => {
                            onPageChange(hp);
                            setActiveEllipsisKey(null);
                          }}
                          className="w-8 h-8 rounded-[10px] font-mono-num text-xs font-bold border border-[var(--border-ink)] bg-[var(--bg-paper)] text-[var(--text-primary)] hover:bg-[var(--accent-chili)] hover:text-white transition-all flex items-center justify-center cursor-pointer"
                        >
                          {hp}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}

        <button
          type="button"
          disabled={currentPage >= effectiveTotalPages}
          onClick={() => {
            setActiveEllipsisKey(null);
            onPageChange(Math.min(effectiveTotalPages, currentPage + 1));
          }}
          className="market-btn-secondary w-8 h-8 p-0 inline-flex items-center justify-center text-xs disabled:opacity-40"
          title="Halaman Berikutnya"
        >
          <CaretRight size={14} weight="bold" />
        </button>
      </div>
    </div>
  );
}
