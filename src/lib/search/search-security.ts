export const MAX_SEARCH_QUERY_LENGTH = 80;

const TOKEN_SYNONYMS: Record<string, string[]> = {
  cabai: ['cabai', 'cabe'],
  cabe: ['cabai', 'cabe'],
  telur: ['telur', 'telor'],
  telor: ['telur', 'telor'],
  sembako: ['sembako', 'beras', 'pokok', 'minyak', 'gula'],
  bapok: ['bapok', 'beras', 'pokok', 'sembako'],
  minyak: ['minyak', 'minyakita'],
  minyakita: ['minyak', 'minyakita'],
  stasiun: ['stasiun', 'krl', 'commuter'],
  punten: ['punten', 'ai', 'asisten', 'chatbot'],
  ai: ['ai', 'punten', 'asisten'],
  map: ['map', 'peta', 'mapbox', 'lokasi'],
  peta: ['peta', 'map', 'lokasi'],
  lapor: ['lapor', 'laporan', 'aduan', 'keluhan'],
  kelangkaan: ['kelangkaan', 'langka', 'terbatas', 'stok'],
  langka: ['langka', 'kelangkaan', 'terbatas', 'stok'],
  cek: ['cek', 'hitung', 'wajar', 'tawar'],
  indeks: ['indeks', 'papan', 'daftar', 'harga'],
  wajar: ['wajar', 'cek', 'hap', 'het'],
  anyar: ['anyar', 'kebon', 'kembang'],
  gembrong: ['gembrong', 'sukasari'],
  jabar: ['jabar', 'jawa', 'barat'],
  jateng: ['jateng', 'jawa', 'tengah'],
  jatim: ['jatim', 'jawa', 'timur'],
  sumut: ['sumut', 'sumatera', 'utara'],
  sumbar: ['sumbar', 'sumatera', 'barat'],
  sumsel: ['sumsel', 'sumatera', 'selatan'],
  kaltim: ['kaltim', 'kalimantan', 'timur'],
  kalbar: ['kalbar', 'kalimantan', 'barat'],
  kalsel: ['kalsel', 'kalimantan', 'selatan'],
  sulsel: ['sulsel', 'sulawesi', 'selatan'],
  sulut: ['sulut', 'sulawesi', 'utara'],
  sulteng: ['sulteng', 'sulawesi', 'tengah'],
  jogja: ['jogja', 'yogyakarta', 'diy'],
};

function cleanSearchChars(raw: string): string {
  if (typeof raw !== 'string') return '';
  return raw
    .normalize('NFKC')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/--|\/\*|\*\//g, ' ')
    .replace(/[<>{}`\\;]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function sanitizeSearchQuery(raw: string): string {
  return cleanSearchChars(raw).slice(0, MAX_SEARCH_QUERY_LENGTH);
}

export function normalizeSearchText(raw: string): string {
  return cleanSearchChars(raw)
    .toLowerCase()
    .replace(/\bcabe\b/g, 'cabai')
    .replace(/\btelor\b/g, 'telur')
    .replace(/\s+/g, ' ')
    .trim();
}

export function escapeSqlLike(raw: string): string {
  return raw.replace(/[\\%_]/g, '\\$&');
}

export function expandSearchTokenGroups(sanitized: string): string[][] {
  const cleaned = sanitized
    .toLowerCase()
    .replace(/[^a-z0-9\s/-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return [];

  const tokens = cleaned
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .slice(0, 8);

  return tokens.map((token) => {
    const base = new Set<string>([token]);
    const extra = TOKEN_SYNONYMS[token];
    if (extra) {
      for (const alt of extra) base.add(alt);
    }
    const normalizedSingle = token.replace(/^cabe$/, 'cabai').replace(/^telor$/, 'telur');
    base.add(normalizedSingle);
    return Array.from(base);
  });
}

export function isSafeInternalHref(href: string): boolean {
  if (!href || typeof href !== 'string') return false;
  if (!href.startsWith('/') || href.startsWith('//')) return false;
  if (/[\u0000-\u001F\u007F\\]/.test(href)) return false;
  if (/javascript:|data:|vbscript:/i.test(href)) return false;
  return /^\/[a-zA-Z0-9\-._~/?#=&%+]*$/.test(href);
}
