import { NextResponse } from 'next/server';
import { getPublicMapConfig } from '@/lib/server/settings-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const config = await getPublicMapConfig();
  return NextResponse.json({
    success: true,
    message:
      config.source === 'unconfigured'
        ? 'Token Mapbox belum dikonfigurasi di database.'
        : 'Konfigurasi Peta 3D Mapbox berhasil dimuat dari server.',
    data: config,
  });
}

