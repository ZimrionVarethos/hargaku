'use client';

import { UploadSimple, FileText, X } from '@phosphor-icons/react';

interface Props {
  photoFile: File | null;
  setPhotoFile: (file: File | null) => void;
  fileInputId: string;
}

export function LaporPhotoUpload({ photoFile, setPhotoFile, fileInputId }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[12px] font-bold text-[var(--text-primary)]">
        Foto Bukti Nota / Papan Harga{' '}
        <span className="font-normal text-[var(--text-muted)]">(Opsional)</span>
      </label>

      {photoFile ? (
        <div className="p-3 rounded-[12px] bg-[var(--bg-paper)] border border-[var(--border-ink)] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[12px] text-[var(--text-primary)] font-medium truncate">
            <FileText size={18} weight="bold" className="text-[var(--text-muted)] shrink-0" />
            <span className="truncate">{photoFile.name}</span>
            <span className="text-[10px] text-[var(--text-muted)]">
              ({Math.round(photoFile.size / 1024)} KB)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setPhotoFile(null)}
            className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--accent-chili)] cursor-pointer"
          >
            <X size={16} weight="bold" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={fileInputId}
          className="border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--border-ink)] bg-[var(--bg-paper)] hover:bg-[var(--bg-muted)] rounded-[14px] p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center"
        >
          <UploadSimple size={24} weight="bold" className="text-[var(--text-muted)]" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-semibold text-[var(--text-primary)]">
              Unggah foto struk, label harga, atau kondisi stok lapak
            </span>
            <span className="text-[11px] text-[var(--text-muted)]">
              JPG, PNG, atau WebP hingga 5MB. Metadata EXIF GPS dihapus otomatis.
            </span>
          </div>
          <input
            id={fileInputId}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setPhotoFile(e.target.files[0]);
              }
            }}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
