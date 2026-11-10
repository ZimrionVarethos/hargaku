'use client';

import React from 'react';
import { Warning, Trash, ArrowsCounterClockwise } from '@phosphor-icons/react';

interface AdminConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'neutral';
}

export function AdminConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  variant = 'danger',
}: AdminConfirmModalProps) {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#0A120E]/65 transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm market-card p-6 z-10 text-center space-y-4">
        <div
          className={`w-12 h-12 rounded-[12px] border-2 border-[var(--border-ink)] flex items-center justify-center mx-auto ${
            isDanger
              ? 'bg-[var(--accent-chili-soft)] text-[var(--accent-chili)]'
              : 'bg-[var(--ochre-surface)] text-[var(--warning-ink)]'
          }`}
        >
          {isDanger ? (
            <Trash size={22} weight="bold" />
          ) : (
            <ArrowsCounterClockwise size={22} weight="bold" />
          )}
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-[var(--text-primary)]">{title}</h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{description}</p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="market-btn-secondary w-full py-2.5 text-xs font-bold cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="market-btn-primary w-full py-2.5 text-xs cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
