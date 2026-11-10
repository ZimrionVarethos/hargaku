import { NextRequest, NextResponse } from 'next/server';
import { generateMultiSourceAiReply } from '@/lib/server/gemini-service';
import type { AssistantChatRequest } from '@/types/assistant';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<AssistantChatRequest>;
    const message = (body.message || '').trim();
    const regionId = (body.regionId || 'reg_jabar').trim();

    if (!message) {
      return NextResponse.json(
        { success: false, message: 'Pertanyaan tidak boleh kosong.' },
        { status: 400 }
      );
    }

    const result = await generateMultiSourceAiReply({
      message,
      regionId,
      conversationHistory: body.conversationHistory || [],
    });

    return NextResponse.json({
      success: true,
      message: 'Rekomendasi AI berhasil dihasilkan.',
      data: result,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : 'Gagal memproses konsultasi AI.',
      },
      { status: 500 }
    );
  }
}

