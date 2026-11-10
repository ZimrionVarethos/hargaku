export interface SourceQuote {
  sourceName: string;
  price: number;
  note: string;
  isLowest?: boolean;
}

export interface SourceComparisonItem {
  commodityName: string;
  unit: string;
  regionName: string;
  recommendedSource: string;
  sources: SourceQuote[];
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  provider?: 'gemini' | 'grounded-fallback';
  model?: string;
  sourceComparisons?: SourceComparisonItem[];
  referencedCommodities?: Array<{
    id: string;
    name: string;
    currentPrice: number;
    unit: string;
    status?: 'FAIR' | 'SLIGHTLY_EXPENSIVE' | 'OVERPRICED' | 'MUCH_CHEAPER';
    statusLabel?: string;
  }>;
  suggestedActions?: Array<{
    label: string;
    href: string;
  }>;
}

export interface AssistantPromptPreset {
  id: string;
  label: string;
  prompt: string;
  category: 'compare' | 'price-check' | 'cheap-deals' | 'general';
}

export interface AssistantChatRequest {
  message: string;
  regionId: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface AssistantChatResponse {
  reply: string;
  intent?: 'PRICE_RECOMMENDATION' | 'PRICE_CHECK' | 'CHEAP_DEALS' | 'GENERAL' | string;
  provider?: 'gemini' | 'grounded-fallback';
  model?: string;
  sourceComparisons?: SourceComparisonItem[];
  suggestedActions?: Array<{
    label: string;
    href: string;
  }>;
  referencedCommodities?: Array<{
    id: string;
    name: string;
    currentPrice: number;
    unit: string;
    status?: 'FAIR' | 'SLIGHTLY_EXPENSIVE' | 'OVERPRICED' | 'MUCH_CHEAPER';
    statusLabel?: string;
  }>;
}
