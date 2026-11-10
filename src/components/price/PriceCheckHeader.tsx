'use client';

export function PriceCheckHeader() {
  return (
    <div className="flex flex-col gap-2 pb-2">
      <h1 className="text-[32px] sm:text-[40px] font-bold text-[var(--text-primary)] leading-[1.12] tracking-tight">
        Cek Kewajaran Harga Belanja
      </h1>

      <p className="text-[14px] sm:text-[15px] text-[var(--text-secondary)] max-w-[720px] leading-[1.5]">
        Tameng belanja pangan cerdas. Cek acuan resmi sebelum ke pasar atau masukkan harga yang ditawarkan pedagang di lapak: sistem langsung memvalidasi kewajaran harga secara objektif agar Anda belanja lebih tenang dan hemat.
      </p>
    </div>
  );
}
