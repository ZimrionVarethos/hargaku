import Image from 'next/image';

const SIDE_SCENIC_CLASS =
  'w-[45%] max-w-[180px] sm:w-[38%] sm:max-w-[240px] md:w-[32%] md:max-w-[260px] lg:w-[27%] lg:max-w-[360px] xl:w-[26%] xl:max-w-[400px]';

export function FooterScenicBackdrop() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
      <div className="footer-scenic-light absolute inset-0">
        <Image
          src="/images/pasarku/pasarku-footer-tengah.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-bottom"
        />
        <div className={`absolute bottom-0 left-0 z-[1] ${SIDE_SCENIC_CLASS}`}>
          <Image
            src="/images/pasarku/pasarku-footer-kiri.webp"
            alt=""
            width={810}
            height={355}
            sizes="(max-width: 639px) 45vw, (max-width: 1023px) 32vw, 400px"
            className="w-full h-auto block"
          />
        </div>
        <div className={`absolute bottom-0 right-0 z-[1] ${SIDE_SCENIC_CLASS}`}>
          <Image
            src="/images/pasarku/pasarku-footer-kanan.webp"
            alt=""
            width={814}
            height={355}
            sizes="(max-width: 639px) 45vw, (max-width: 1023px) 32vw, 400px"
            className="w-full h-auto block"
          />
        </div>
      </div>

      <div className="footer-scenic-dark absolute inset-0">
        <Image
          src="/images/pasarku/pasarku-footer-tengah-subuh.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-bottom"
        />
        <div className={`absolute bottom-0 left-0 z-[1] ${SIDE_SCENIC_CLASS}`}>
          <Image
            src="/images/pasarku/pasarku-footer-kiri-subuh.webp"
            alt=""
            width={810}
            height={355}
            sizes="(max-width: 639px) 45vw, (max-width: 1023px) 32vw, 400px"
            className="w-full h-auto block"
          />
        </div>
        <div className={`absolute bottom-0 right-0 z-[1] ${SIDE_SCENIC_CLASS}`}>
          <Image
            src="/images/pasarku/pasarku-footer-kanan-subuh.webp"
            alt=""
            width={814}
            height={355}
            sizes="(max-width: 639px) 45vw, (max-width: 1023px) 32vw, 400px"
            className="w-full h-auto block"
          />
        </div>
      </div>

      <div className="footer-scenic-scrim absolute inset-0 z-[2]" />
    </div>
  );
}
