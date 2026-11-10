import { NextRequest, NextResponse } from 'next/server';
import { MOCK_REGIONS } from '@/lib/mock/regions.data';

export async function GET(req: NextRequest) {
  const island = req.nextUrl.searchParams.get('island');
  const search = req.nextUrl.searchParams.get('search')?.toLowerCase().trim();

  let list = MOCK_REGIONS;
  if (island && island !== 'ALL') {
    list = list.filter((r) => r.island === island);
  }
  if (search) {
    list = list.filter(
      (r) =>
        r.name.toLowerCase().includes(search) ||
        r.islandName.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Daftar wilayah dimuat.',
    data: list,
  });
}

