export interface OpenAIConfig {
  apiKey: string;
  model: string;
}

export async function fetchCompletion(
  config: OpenAIConfig,
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[]
): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model || 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.3, // Lower temperature for more accurate translations
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API Error:', response.status, errorData);
      
      if (response.status === 401) throw new Error('Invalid API Key');
      if (response.status === 429) throw new Error('Rate Limit Exceeded');
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error: any) {
    console.error('Fetch Completion Error:', error);
    throw error;
  }
}

export function createTranslationPrompt(targetLang: string, context?: string) {
  const systemPrompt = `You are a professional translator and language expert.
Your task is to translate the user's text into the target language: ${targetLang}.
Output ONLY the translated text. Do not add any explanations, notes, or quotes unless asked.
Maintain the original tone and formatting.`;

  // If context is provided (e.g. "This is a technical document"), add it
  if (context) {
      return `${systemPrompt}\nContext: ${context}`;
  }

  return systemPrompt;
}

/**
 * Creates a specialized prompt for inline fragment translation
 * This prompt ensures minimal, context-aware translation suitable for inline replacement
 */
export function createInlineTranslationPrompt(targetLang: string, tone?: string) {
  let toneInstruction = '';

  switch (tone) {
    case 'formal':
      toneInstruction = '\n8. Use formal, professional language and honorifics where appropriate';
      break;
    case 'casual':
      toneInstruction = '\n8. Use casual, friendly language as if talking to a friend';
      break;
    case 'humorous':
      toneInstruction = '\n8. Make the translation light and playful while keeping the meaning';
      break;
    case 'code':
      toneInstruction = '\n8. Optimize for technical/programming terminology and concepts';
      break;
    case 'tldr':
      toneInstruction = '\n8. Provide a very brief summary (maximum 10 words)';
      break;
    default:
      toneInstruction = '';
  }

  return `You are a professional translator performing inline text replacement.

CRITICAL RULES:
1. Return ONLY the translated text - NO explanations, quotes, or conversational filler
2. The input may be a sentence fragment, not a complete sentence - translate it as-is
3. Preserve the exact capitalization style of the original (Title Case, lowercase, UPPERCASE, etc.)
4. Preserve all punctuation exactly as provided
5. If the fragment starts/ends mid-sentence, keep it that way
6. Match the formality and tone of the original text
7. Translate to: ${targetLang}${toneInstruction}

Example:
Input: "quick brown fox"
Output: "быстрая коричневая лиса" (NOT "The translation is: 'быстрая коричневая лиса'")`;
}

/**
 * Creates a tone-aware translation prompt for standard translations
 */
export function createToneAwarePrompt(targetLang: string, tone: string, context?: string) {
  let toneDescription = '';

  switch (tone) {
    case 'formal':
      toneDescription = 'professional and formal, using polite language and proper titles';
      break;
    case 'casual':
      toneDescription = 'casual and friendly, as if talking to a close friend';
      break;
    case 'humorous':
      toneDescription = 'light-hearted and humorous, while preserving the core meaning';
      break;
    case 'code':
      toneDescription = 'technical and precise, optimized for programming terms and concepts';
      break;
    case 'tldr':
      toneDescription = 'extremely concise - provide only a brief summary';
      break;
    default:
      toneDescription = 'natural and accurate';
  }

  const basePrompt = `You are a professional translator and language expert.
Your task is to translate the user's text into the target language: ${targetLang}.
The translation style should be ${toneDescription}.
Output ONLY the translated text. Do not add any explanations, notes, or quotes unless asked.
Maintain the original formatting.`;

  if (context) {
    return `${basePrompt}\nContext: ${context}`;
  }

  return basePrompt;
}

