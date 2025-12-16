import { storage } from '../lib/storage';
import { fetchCompletion, createTranslationPrompt, createInlineTranslationPrompt, createToneAwarePrompt, createExplainPrompt, createDefinePrompt, createContextualDefinePrompt } from '../lib/openai';

console.log('Lume Background Service Worker started');

// Message types
type MessageType =
  | { type: 'PING' }
  | { type: 'TRANSLATE_REQUEST'; payload: { text: string; targetLang: string; context?: string; tone?: string; mode?: 'translate' | 'explain' | 'define' | 'define-context' } }
  | { type: 'VALIDATE_API_KEY'; payload: { key: string } };

chrome.runtime.onMessage.addListener((message: MessageType, _, sendResponse) => {
  console.log('Background received message:', message);

  if (message.type === 'PING') {
    sendResponse({ status: 'ok' });
    return;
  }

  if (message.type === 'TRANSLATE_REQUEST') {
    // We need to return true to indicate we will sendResponse asynchronously
    handleTranslation(message.payload, sendResponse);
    return true;
  }

  if (message.type === 'VALIDATE_API_KEY') {
    handleValidation(message.payload.key, sendResponse);
    return true;
  }
});

async function handleTranslation(payload: { text: string; targetLang: string; context?: string; tone?: string; mode?: 'translate' | 'explain' | 'define' | 'define-context' }, sendResponse: (response: any) => void) {
  try {
    const settings = await storage.get();
    if (!settings.apiKey) {
      sendResponse({ success: false, error: 'API Key is missing. Please configure it in settings.' });
      return;
    }

    const tone = payload.tone || 'standard';

    // Use tone-aware prompts based on context
    let systemPrompt: string;

    if (payload.mode === 'explain') {
      systemPrompt = createExplainPrompt(payload.targetLang);
    } else if (payload.mode === 'define') {
      systemPrompt = createDefinePrompt(payload.targetLang);
    } else if (payload.mode === 'define-context') {
      systemPrompt = createContextualDefinePrompt(payload.targetLang);
    } else if (payload.context === 'inline-replace') {
      // Inline replacement mode with tone
      systemPrompt = createInlineTranslationPrompt(payload.targetLang, tone);
    } else if (tone !== 'standard') {
      // Standard translation with custom tone
      systemPrompt = createToneAwarePrompt(payload.targetLang, tone, payload.context);
    } else {
      // Standard translation with standard tone
      systemPrompt = createTranslationPrompt(payload.targetLang, payload.context);
    }

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: payload.text }
    ];

    const result = await fetchCompletion(
      { apiKey: settings.apiKey, model: settings.model },
      messages
    );

    sendResponse({ success: true, data: result });

  } catch (error: any) {
    console.error('Translation error:', error);
    // More specific error messages for common issues
    let errorMessage = 'Unknown error occurred';
    if (error.message?.includes('401')) {
      errorMessage = 'Invalid API key. Please check your OpenAI API key.';
    } else if (error.message?.includes('429')) {
      errorMessage = 'Rate limit exceeded. Please try again later.';
    } else if (error.message?.includes('quota')) {
      errorMessage = 'API quota exceeded. Please check your OpenAI billing.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    sendResponse({ success: false, error: errorMessage });
  }
}

async function handleValidation(key: string, sendResponse: (response: any) => void) {
  try {
    // Minimal request to verify key
    await fetchCompletion(
      { apiKey: key, model: 'gpt-3.5-turbo' },
      [{ role: 'user', content: 'Hi' }]
    );
    sendResponse({ success: true });
  } catch (e) {
    sendResponse({ success: false, error: 'Invalid API Key' });
  }
}

