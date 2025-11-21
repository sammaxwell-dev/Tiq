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

