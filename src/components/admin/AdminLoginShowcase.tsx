'use client';

import Image from 'next/image';
import {
  Storefront,
  Lightning,
  ShieldCheck,
  CheckCircle,
} from '@phosphor-icons/react';

export function AdminLoginShowcase() {
  const highlights = [
    {
      icon: Storefront,
      iconBg: 'bg-[#FBE9E6] text-[#A92717] border border-[#132E20]',
      title: 'Sentra Pasar Rakyat Terhubung',
      desc: 'Pemantauan serempak sentra pasar tradisional di Kota Bogor dan koridor pantauan nusantara.',
    },
    {
      icon: Lightning,
      iconBg: 'bg-[#F5E9D4] text-[#8A5316] border border-[#132E20]',
      title: 'Survei Pagi 06:00 WIB',
      desc: 'Matriks harga terkalibrasi dengan panel resmi Bapanas, Perumda PPJ, dan PIHPS Bank Indonesia.',
    },
    {
      icon: ShieldCheck,
      iconBg: 'bg-[#E2EFE6] text-[#245034] border border-[#132E20]',
      title: 'Filter Anomali Statistik MAD',
      desc: 'Deteksi otomatis deviasi ekstrem >25% dan sanitasi metadata EXIF foto struk warga.',
    },
  ];

  return (
    <div className="relative w-full h-full bg-[var(--bg-stage)] text-[#F9F3EE] p-8 sm:p-12 lg:p-14 flex flex-col justify-between">
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center bg-[#F9F3EE] px-2.5 py-1 rounded-[10px] border-2 border-[#D8C8B0] shadow-[2px_2px_0px_#060B08]">
            <Image
              src="/images/pasarku/logo-nav.webp"
              alt="Logo PasarKu"
              width={400}
              height={173}
              unoptimized
              className="h-7 w-auto object-contain"
            />
          </span>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-[#F9F3EE]">
              PasarKu Console
            </span>
            <span className="text-[10px] text-[#9AB0A1] tracking-wider uppercase font-bold">
              TIM PENGAWAS &amp; PEMANTAU PASAR
            </span>
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E3127] border border-[#4E6B59] text-[11px] font-bold text-[#6EE7A0]">
            Portal Pengawas Pangan Resmi
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F9F3EE] leading-tight">
            Pusat Kendali &amp; Stabilitas Harga Pangan Daerah
          </h2>
          <p className="text-xs sm:text-sm text-[#D0DDD4] leading-relaxed max-w-md">
            Satu pintu masuk untuk memperbarui harga resmi komoditas pasar harian, memoderasi laporan nota belanja warga, dan mengawal transparansi pangan.
          </p>
        </div>
      </div>

      <div className="my-8 space-y-3 max-w-lg">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="p-3.5 rounded-[12px] bg-[#16241D] border-2 border-[#4E6B59] shadow-[2px_2px_0px_#060B08] flex items-start gap-3.5"
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.iconBg}`}
              >
                <Icon size={18} weight="bold" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="font-bold text-xs text-[#F9F3EE]">
                  {item.title}
                </span>
                <p className="text-[11px] text-[#D0DDD4] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-[#2A3F33] flex items-center justify-between text-xs text-[#9AB0A1]">
        <div className="flex items-center gap-1.5">
          <CheckCircle size={15} weight="fill" className="text-[#6EE7A0]" />
          <span className="text-[11px] font-medium">Sesi Dilindungi Enkripsi Token</span>
        </div>
        <span className="font-mono-num text-[10px]">Konsol PasarKu v2.0</span>
      </div>
    </div>
  );
}
