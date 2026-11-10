import { NextRequest, NextResponse } from 'next/server';
import { fetchBootstrapFromDb } from '@/lib/server/admin-db';
import { MOCK_MARKETS } from '@/lib/mock/markets.data';
import type { Market } from '@/types';

export async function GET(req: NextRequest) {
  const region = req.nextUrl.searchParams.get('region');
  try {
    const { markets } = await fetchBootstrapFromDb();
    const mapped: Market[] = markets
      .filter((m) => m.isActive)
      .map((m) => ({
        id: m.id,
        regionId: m.regionId,
        name: m.name,
        slug: m.slug,
        city: m.city,
        district: m.district,
        address: m.address,
        latitude: m.latitude,
        longitude: m.longitude,
        operatingHours: m.operatingHours,
        isSentra: true,
        isActive: m.isActive,
        description: m.specialty,
      }));

    if (!region) {
      return NextResponse.json({ success: true, message: 'Daftar pasar dimuat.', data: mapped });
    }

    const q = region.toLowerCase();
    const filtered = mapped.filter(
      (m) =>
        m.regionId?.toLowerCase() === q ||
        m.city.toLowerCase().includes(q.replace(/-/g, ' ')) ||
        m.city.toLowerCase().replace(/\s+/g, '-') === q
    );

    return NextResponse.json({
      success: true,
      message: 'Daftar pasar wilayah dimuat.',
      data: filtered.length > 0 ? filtered : mapped,
    });
  } catch {
    return NextResponse.json({
      success: true,
      message: 'Daftar pasar fallback dimuat.',
      data: MOCK_MARKETS,
    });
  }
}

