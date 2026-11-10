import { ApiResponse, Region } from '@/types';
import { AssistantChatRequest, AssistantChatResponse, AssistantMessage } from '@/types/assistant';
import { processAssistantMessage } from '@/lib/assistant/assistant-engine';

export async function sendAssistantMessage(
  userText: string,
  region: Region,
  conversationHistory: AssistantMessage[] = []
): Promise<AssistantMessage> {
  const timestamp = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  try {
    const payload: AssistantChatRequest = {
      message: userText,
      regionId: region.id,
      conversationHistory: conversationHistory.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    };

    const res = await fetch('/api/v1/assistant/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = (await res.json()) as ApiResponse<AssistantChatResponse>;
    if (!res.ok || !json.success || !json.data) {
      throw new Error(json.message || 'Gagal menerima respons asisten');
    }

    return {
      id: `bot_${Date.now()}`,
      role: 'assistant',
      timestamp,
      content: json.data.reply,
      provider: json.data.provider,
      model: json.data.model,
      sourceComparisons: json.data.sourceComparisons,
      suggestedActions: json.data.suggestedActions,
      referencedCommodities: json.data.referencedCommodities,
    };
  } catch {
    return processAssistantMessage(userText, region);
  }
}
