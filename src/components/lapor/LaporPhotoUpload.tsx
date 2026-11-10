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
      <label className="text-[12px] font-semibold text-[#1B1A18]">
        Foto Bukti Nota / Timbangan <span className="font-normal text-[#8E8D86]">(Opsional)</span>
      </label>

      {photoFile ? (
        <div className="p-3 rounded-[12px] bg-[#FAF9F5] outline outline-1 outline-[#E5E3DE] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[12px] text-[#1B1A18] font-medium truncate">
            <FileText size={18} weight="bold" className="text-[#8E8D86] shrink-0" />
            <span className="truncate">{photoFile.name}</span>
            <span className="text-[10px] text-[#8E8D86]">({Math.round(photoFile.size / 1024)} KB)</span>
          </div>
          <button
            type="button"
            onClick={() => setPhotoFile(null)}
            className="p-1 rounded text-[#8E8D86] hover:text-[#991B1B]"
          >
            <X size={16} weight="bold" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={fileInputId}
          className="border-2 border-dashed border-[#E5E3DE] hover:border-[#1B1A18] bg-[#FAF9F5] hover:bg-white rounded-[14px] p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center"
        >
          <UploadSimple size={24} weight="bold" className="text-[#8E8D86]" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-semibold text-[#1B1A18]">
              Unggah foto struk atau papan harga lapak
            </span>
            <span className="text-[11px] text-[#8E8D86]">
              JPG, PNG, atau WebP hingga 5MB. Koordinat GPS langsung distrip otomatis.
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

