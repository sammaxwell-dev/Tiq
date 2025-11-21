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

**Tippr** is a Chrome browser extension that provides instant AI-powered translation of selected text using OpenAI's GPT models. The extension offers two translation modes: a full-featured modal interface and an inline typewriter replacement mode that animates translations directly into the page content. All content script UI uses Shadow DOM isolation to prevent style conflicts with host pages.

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
   - Handles OpenAI API calls via message passing (avoids CORS issues)
   - Manages API key validation
   - Processes translation requests from content scripts and popup
   - Routes to different translation prompts based on context (`inline-replace` vs standard)

2. **Content Script** (`src/content/`)
   - Injected into all web pages (`<all_urls>`)
   - Detects text selection and shows floating action buttons
   - Provides two translation modes:
     - **Modal Mode**: Full-featured draggable modal with translation history
     - **Inline Replace Mode**: Typewriter animation that replaces selected text in-place
   - All UI renders in Shadow DOM for style isolation
   - Entry point: `src/content/index.tsx` → `ShadowHost.tsx` → `ContentApp.tsx`

3. **Popup** (`src/popup/`)
   - Accessible via browser action (extension icon)
   - Provides manual text input for translation
   - Entry point: `src/popup/index.html` → `PopupApp.tsx`

4. **Options Page** (`src/options/`)
   - Full settings interface for API key, language, model selection, instant translation toggle
   - Entry point: `src/options/index.html` → `OptionsApp.tsx`

### Key Technical Decisions

**Shadow DOM Isolation** (`src/content/ShadowHost.tsx`):
- Wraps all content script UI in Shadow DOM to prevent CSS conflicts
- Imports Tailwind CSS as an inline string using Vite's `?inline` import suffix
- The imported stylesheet (`src/content/styles.ts`) re-exports `tailwind.css?inline`
- React Portal renders UI into Shadow DOM root
- Theme support (light/dark/system) applied at Shadow DOM level

**Message Passing** (`src/background/index.ts`):
Content scripts and popup communicate with the background service worker using `chrome.runtime.sendMessage` with typed interfaces:
- `PING`: Health check
- `TRANSLATE_REQUEST`: Translation with text, target language, and optional context
  - Standard context: Uses `createTranslationPrompt()` for modal translations
  - `inline-replace` context: Uses `createInlineTranslationPrompt()` for DOM replacement
- `VALIDATE_API_KEY`: API key validation

**Storage Layer** (`src/lib/storage.ts`):
Wrapper around `chrome.storage.sync` with localStorage fallback for development. Stores:
- `apiKey`: OpenAI API key (required)
- `targetLang`: Default target language (e.g., 'ru', 'en')
- `model`: OpenAI model (default: 'gpt-4o-mini')
- `theme`: UI theme preference ('light' | 'dark' | 'system')
- `showBackdrop`: Whether to show modal backdrop
- `instantTranslation`: Auto-translate on icon click vs manual modal

**OpenAI Integration** (`src/lib/openai.ts`):
- Direct fetch to OpenAI Chat Completions API (bypasses CORS via background worker)
- Error handling for 401 (invalid key), 429 (rate limit), quota errors
- Two prompt strategies:
  - `createTranslationPrompt()`: General-purpose translation with optional context
  - `createInlineTranslationPrompt()`: Fragment-aware translation that preserves capitalization, punctuation, and handles incomplete sentences

**Inline DOM Replacement** (`src/lib/inlineReplace.ts`):
- Captures text selection using Range API
- Replaces selected text with a `<span>` element that inherits parent styles
- `animateTypewriter()`: Character-by-character animation with blinking cursor
- Returns restore/cancel functions for undo functionality
- All manipulated elements use `gpt-translate-*` class prefix

### Component Structure

**UI Components** (`src/components/ui/`):
- Reusable primitives (Button, Input, Select, Textarea, Loader, Switch)
- Built on Radix UI with Tailwind CSS and Class Variance Authority (CVA)
- All components designed to work within Shadow DOM

**Content Script Components** (`src/content/`):
- `FloatingIcon.tsx`: Shows two action buttons near text selection
  - Purple wand button (Wand2 icon): Triggers inline replacement mode
  - Blue sparkles button (Sparkles icon): Opens translation modal
- `modal/TranslationModal.tsx`: Draggable, resizable modal with translation UI
  - Supports pinning to keep open after clicking away
  - Backdrop toggle via settings
- `modal/InstantTranslationPopUp.tsx`: Compact draggable popup for instant translations
  - Shows when `instantTranslation` setting is enabled
  - Copy and expand-to-modal actions

**Settings Sections** (`src/options/sections/`):
- `GeneralSection.tsx`: Theme, language, instant translation toggle
- `OpenAISection.tsx`: API key configuration and model selection

### Build System

Uses Vite with `@crxjs/vite-plugin` for Chrome extension bundling:
- Parses `manifest.json` to identify entry points
- Handles TypeScript, React, and Tailwind compilation
- Supports hot reload during development (port 5173)

## Translation Modes

### Modal Translation
- Triggered by blue sparkles button or when `instantTranslation` is disabled
- Full-featured interface with editable source/target text
- Draggable and resizable
- Language switching and model selection
- Pin feature to keep modal open
- Auto-translates on open if `instantTranslation` is enabled

### Inline Typewriter Replace
- Triggered by purple wand button
- Replaces selected text directly in the DOM with animated translation
- Character-by-character typewriter effect (20ms/char)
- Blinking cursor animation during typing
- Preserves parent element styling (font, color, size)
- Uses specialized `inline-replace` context for fragment-aware translation
- Non-reversible (no undo currently implemented)

## Important Implementation Details

- Extension requires a valid OpenAI API key to function
- Selection detection uses `mousedown`/`mouseup` events (not just `selectionchange`) to properly track user interaction
- Icon positioning logic handles viewport boundaries and multi-line selections
- All content script class names use `gpt-translate-*` prefix to avoid host page conflicts
- Shadow DOM prevents Tailwind classes from leaking to/from host page
- Timeout handling on all `chrome.runtime.sendMessage` calls (30s for translations, 5s for modal)
- Extension context validation checks (`chrome.runtime?.id`) to handle reload scenarios

## Development Workflow

### Local Development
```bash
npm run dev  # Starts Vite dev server on port 5173 with hot reload
```

After running dev:
1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `dist` folder
4. Changes hot-reload automatically (may need extension refresh for manifest changes)

### Production Build
```bash
npm run build  # Compiles TypeScript, bundles with Vite, outputs to dist/
```

### Playground Testing
- `playground.html` exists for testing UI components outside the extension context
- Uses localStorage fallback in storage layer
- Access via dev server (not critical for extension development)

## Common Issues

**Tailwind CSS not working in Shadow DOM:**
1. Ensure CSS import uses `?inline` suffix: `import styles from './styles.css?inline'`
2. Verify styles are injected via `<style>` tag inside Shadow DOM
3. Check `vite.config.ts` includes PostCSS configuration

**Extension context invalidated errors:**
- Happens when extension is reloaded while content scripts are still active
- Always check `chrome.runtime?.id` before making API calls
- User must refresh pages after extension reload

**Floating icon not appearing:**
- Check console for positioning errors
- Verify selection is not collapsed and has visible rect
- Icon hidden when modal/popup is already open or during active selection drag

**Inline replacement not preserving styles:**
- Uses `window.getComputedStyle()` to inherit parent styles
- If issues occur, check that parent element has computable styles
- Some complex CSS (grid/flex positioning) may affect layout

## Testing Checklist

After building (`npm run build`), load in Chrome and verify:
1. Extension loads without errors in `chrome://extensions`
2. Configure API key in options page (right-click extension icon → Options)
3. Select text on any webpage → two buttons appear
4. Purple wand button → inline replacement with typewriter animation
5. Blue sparkles button → modal opens with translation
6. Instant translation toggle in options → auto-translates to popup
7. Theme switcher in options → applies to all extension UI
8. Modal dragging, resizing, and pinning work correctly
