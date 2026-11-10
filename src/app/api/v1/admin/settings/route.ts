import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdminRequest } from '@/lib/server/admin-session';
import { getPublicAiSettings, getAiRuntimeConfig, saveAiSettings } from '@/lib/server/settings-db';
import { testGeminiConnection } from '@/lib/server/gemini-service';

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdminRequest(req)) {
    return NextResponse.json({ success: false, message: 'Otorisasi admin diperlukan.' }, { status: 401 });
  }
  const settings = await getPublicAiSettings();
  return NextResponse.json({
    success: true,
    message: 'Pengaturan integrasi AI & DB dimuat.',
    data: settings,
  });
}

export async function PUT(req: NextRequest) {
  if (!isAuthorizedAdminRequest(req)) {
    return NextResponse.json({ success: false, message: 'Otorisasi admin diperlukan.' }, { status: 401 });
  }
  try {
    const body = (await req.json()) as {
      geminiApiKey?: string;
      geminiModel?: string;
      systemInstruction?: string;
      enabledSources?: string[];
    };

    const updated = await saveAiSettings(body);
    return NextResponse.json({
      success: true,
      message: 'Konfigurasi AI & API Key berhasil disimpan ke database Supabase.',
      data: updated,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : 'Gagal menyimpan pengaturan ke Supabase.',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorizedAdminRequest(req)) {
    return NextResponse.json({ success: false, message: 'Otorisasi admin diperlukan.' }, { status: 401 });
  }
  try {
    const body = (await req.json()) as {
      action?: string;
      geminiApiKey?: string;
      geminiModel?: string;
    };
    const runtime = await getAiRuntimeConfig();
    const keyToTest = body.geminiApiKey?.trim() || runtime.apiKey;
    const modelToTest = body.geminiModel?.trim() || runtime.geminiModel;

    if (!keyToTest) {
      return NextResponse.json(
        { success: false, message: 'Belum ada Gemini API Key yang tersimpan atau dimasukkan.' },
        { status: 400 }
      );
    }

    const probe = await testGeminiConnection(keyToTest, modelToTest);
    return NextResponse.json({
      success: probe.ok,
      message: probe.ok
        ? `Koneksi Gemini (${modelToTest}) berhasil dalam ${probe.latencyMs}ms.`
        : `Gagal terhubung ke Gemini: ${probe.error}`,
      data: probe,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : 'Gagal menguji koneksi Gemini.',
      },
      { status: 500 }
    );
  }
}

