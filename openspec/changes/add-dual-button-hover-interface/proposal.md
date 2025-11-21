# Change: Dual-Button Hover Interface for Floating Icon

## Why
Currently, the floating icon provides only one action - opening the translation modal. Users who want quick translations must always open the modal and click translate, which adds friction. Power users would benefit from an instant translate option, while others may still prefer manual language selection. DeepL's extension provides this choice through a dual-button interface, which users find intuitive.

## What Changes
- Transform the floating icon into a two-button interface when hovered:
  - **Fast Translate button**: Instantly translates selected text using the default target language, displaying results immediately in the modal
  - **Manual Translate button**: Opens the translation modal where users can choose target language before translating
- Add smooth hover expansion animation to reveal both buttons
- Maintain compact single-icon appearance when not hovered

## Impact
- **Affected specs**: `floating-icon` (new capability)
- **Affected code**:
  - `src/content/FloatingIcon.tsx` - Major refactor to support dual-button expandable interface
  - `src/content/ContentApp.tsx` - Update click handler to support two different translation modes
  - Styling updates for button expansion animations
- **User-facing changes**:
  - Faster workflow for users who want instant translation with default language
  - More control for users who need to select specific target languages
  - Familiar UX pattern matching DeepL extension
