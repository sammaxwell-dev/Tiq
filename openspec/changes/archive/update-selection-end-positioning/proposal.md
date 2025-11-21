# Change: Selection-End Icon Positioning

## Why
Currently, the floating icon appears at a calculated position based on the selection rectangle (top-right or bottom-right of the bounding box). This doesn't align with users' natural selection gesture and can feel disconnected from where they expect the icon to appear. DeepL extension positions the icon at the exact endpoint where the user's cursor stops, creating a more intuitive and predictable experience that follows the user's reading and selection direction.

## What Changes
- Update icon positioning logic to detect the actual endpoint of text selection (where the user's cursor ended)
- Position icon immediately after the last selected character, following the direction of selection:
  - Left-to-right selection: icon appears after the rightmost character
  - Right-to-left selection: icon appears after the leftmost character (selection endpoint)
- Maintain small offset (8px) from the selection boundary for visual clarity
- Preserve viewport boundary constraints to keep icon fully visible

## Impact
- **Affected specs**: `text-selection` (new capability)
- **Affected code**:
  - `src/content/ContentApp.tsx` - Complete rewrite of icon positioning logic in `handleSelectionChange`
  - Requires detection of selection direction using Range API
  - Replace current bounding box calculation with endpoint-based positioning
- **User-facing changes**:
  - More predictable icon placement aligned with user's selection gesture
  - Icon feels more responsive and "attached" to the selection action
  - Improved UX consistency with familiar tools like DeepL
