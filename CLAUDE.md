<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tippr** is a Chrome browser extension that provides instant AI-powered translation of selected text using OpenAI's GPT models. The extension uses Shadow DOM isolation to prevent style conflicts with host pages.

## Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build extension for production
npm run build

# Preview production build
npm run preview
```

After building, load the `dist` folder as an unpacked extension in Chrome (`chrome://extensions` → Developer mode → Load unpacked).

## Architecture

### Extension Structure

The extension follows Chrome Extension Manifest V3 architecture with four main entry points:

1. **Background Service Worker** (`src/background/index.ts`)
   - Handles OpenAI API calls via message passing
   - Manages API key validation
   - Processes translation requests from content scripts and popup

2. **Content Script** (`src/content/`)
   - Injected into all web pages (`<all_urls>`)
   - Detects text selection and shows floating icon
   - Renders translation modal in Shadow DOM for style isolation
   - Entry point: `src/content/index.tsx` → `ContentApp.tsx`

3. **Popup** (`src/popup/`)
   - Accessible via browser action (extension icon)
   - Provides manual text input for translation
   - Entry point: `src/popup/index.html` → `PopupApp.tsx`

4. **Options Page** (`src/options/`)
   - Full settings interface for API key, language, model selection
   - Entry point: `src/options/index.html` → `OptionsApp.tsx`

### Key Technical Decisions

**Shadow DOM Isolation**: The `ShadowHost.tsx` component wraps all content script UI, importing Tailwind CSS as an inline string (`?inline` import) to prevent conflicts with host page styles. All extension UI in content scripts renders inside Shadow DOM.

**Message Passing**: Content scripts and popup communicate with the background service worker using `chrome.runtime.sendMessage` with typed message interfaces:
- `PING`: Health check
- `TRANSLATE_REQUEST`: Translation with text and target language
- `VALIDATE_API_KEY`: API key validation

**Storage Layer** (`src/lib/storage.ts`): Wrapper around `chrome.storage.sync` with localStorage fallback for development. Stores:
- `apiKey`: OpenAI API key
- `targetLang`: Default target language (e.g., 'ru', 'en')
- `model`: OpenAI model (default: 'gpt-4o-mini')
- `theme`: UI theme preference

**OpenAI Integration** (`src/lib/openai.ts`): Direct fetch to OpenAI Chat Completions API with error handling for common failures (401, 429).

### Component Structure

- `src/components/ui/`: Reusable UI components (Button, Input, Select, Textarea, Loader, Switch) built on Radix UI primitives and styled with Tailwind + CVA
- `src/content/FloatingIcon.tsx`: Icon that appears near text selection
- `src/content/modal/TranslationModal.tsx`: Draggable modal for translation interface
- `src/options/sections/`: Settings page sections (GeneralSection, OpenAISection)

### Build System

Uses Vite with `@crxjs/vite-plugin` for Chrome extension bundling:
- Parses `manifest.json` to identify entry points
- Handles TypeScript, React, and Tailwind compilation
- Supports hot reload during development (port 5173)

## Important Notes

- The extension requires a valid OpenAI API key to function
- Content script selection detection uses debounced `selectionchange` and `mouseup` events
- Translation modal is draggable (implementation in `TranslationModal.tsx`)
- All class names in content script use `gpt-translate-*` prefix to avoid conflicts
- The PRD document (`PRD.md`) contains full product requirements in Russian

## Common Issues

If encountering Tailwind CSS import errors with Shadow DOM, ensure:
1. The CSS is imported with `?inline` suffix
2. The imported styles are injected via `<style>` tag in Shadow DOM
3. Vite config supports inline CSS imports

## Testing

Load the extension in Chrome after building:
1. Run `npm run build`
2. Open `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `dist` folder
5. Configure API key in extension options
6. Test by selecting text on any webpage
