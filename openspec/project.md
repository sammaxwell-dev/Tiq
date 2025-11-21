# Project Context

## Purpose
Tippr is a Chrome browser extension that provides instant AI-powered translation of selected text using OpenAI's GPT models. Users can select any text on a webpage, and the extension displays a floating icon that triggers a draggable translation modal. The extension supports manual text input via popup and offers full configuration through an options page.

## Tech Stack
- **Runtime**: Chrome Extension Manifest V3
- **Language**: TypeScript
- **UI Framework**: React 18
- **Build Tool**: Vite with @crxjs/vite-plugin
- **Styling**: Tailwind CSS 3 with CVA (Class Variance Authority)
- **UI Components**: Radix UI primitives
- **AI Integration**: OpenAI Chat Completions API (GPT-4o-mini default)
- **Storage**: Chrome Storage API (chrome.storage.sync) with localStorage fallback
- **DOM Isolation**: Shadow DOM for content script UI

## Project Conventions

### Code Style
- **Naming**: All CSS classes in content scripts use `gpt-translate-*` prefix to avoid conflicts with host pages
- **Components**: Reusable UI components in `src/components/ui/` built on Radix UI primitives
- **Styling**: Tailwind utility classes with CVA for component variants
- **Imports**: CSS imported with `?inline` suffix in Shadow DOM contexts to prevent style leaks
- **TypeScript**: Strict typing with interfaces for message passing and storage objects

### Architecture Patterns
- **Extension Structure**: Four entry points following Chrome Extension Manifest V3:
  1. Background Service Worker (`src/background/index.ts`) - handles API calls
  2. Content Script (`src/content/`) - injected into all pages, text selection detection
  3. Popup (`src/popup/`) - manual translation interface
  4. Options Page (`src/options/`) - full settings configuration

- **Message Passing**: Typed message interfaces for communication:
  - `PING`: Health check
  - `TRANSLATE_REQUEST`: Translation with text and target language
  - `VALIDATE_API_KEY`: API key validation

- **Shadow DOM Isolation**: `ShadowHost.tsx` wraps all content script UI with inline CSS to prevent style conflicts with host pages

- **Storage Layer**: `src/lib/storage.ts` wrapper around `chrome.storage.sync` with localStorage fallback for development

- **UI Composition**: Draggable modal for translations, floating icon on text selection with debounced event handlers

### Testing Strategy
- **Manual Testing**: Load unpacked extension in Chrome (`chrome://extensions`) after `npm run build`
- **Development Testing**: Hot reload via Vite dev server (port 5173) for rapid iteration
- **Validation Points**:
  - API key validation in options page
  - Text selection detection on various websites
  - Translation modal drag functionality
  - Shadow DOM style isolation verification

### Git Workflow
- **Not currently initialized**: Project is not yet a git repository (as of 2025-11-21)
- **Recommended**: Standard feature branch workflow with descriptive commit messages
- **Build artifacts**: `dist/` folder should be gitignored (contains build output)

## Domain Context
- **Browser Extension Development**: Must follow Chrome Extension security policies and permissions model
- **Text Selection UX**: Detects user text selection via debounced `selectionchange` and `mouseup` events
- **AI Translation**: Uses OpenAI's chat completion format with system prompt for translation context
- **Multi-language Support**: Configurable target language (e.g., 'ru', 'en') stored in user preferences
- **Style Isolation**: Critical requirement to avoid CSS conflicts with arbitrary host pages using Shadow DOM

## Important Constraints
- **Manifest V3 Requirements**: Must comply with Chrome's Manifest V3 specifications (service workers, no remote code execution)
- **Content Security Policy**: Limited inline script execution, all code must be bundled
- **Shadow DOM Requirement**: All content script UI must render in Shadow DOM to prevent style conflicts
- **API Key Security**: OpenAI API key stored locally in chrome.storage.sync (user-provided, not bundled)
- **Permissions**: Requires `<all_urls>` permission to inject content scripts on all pages
- **Offline Limitations**: Requires internet connection for OpenAI API calls

## External Dependencies
- **OpenAI API**:
  - Endpoint: `https://api.openai.com/v1/chat/completions`
  - Authentication: Bearer token (user-provided API key)
  - Default Model: `gpt-4o-mini`
  - Error Handling: 401 (unauthorized), 429 (rate limit), general API failures

- **Chrome Extension APIs**:
  - `chrome.runtime`: Message passing between extension components
  - `chrome.storage.sync`: Persistent user preferences and settings
  - `chrome.tabs`: Tab management and content script injection

- **Development Dependencies**:
  - Vite dev server (port 5173) for hot reload during development
