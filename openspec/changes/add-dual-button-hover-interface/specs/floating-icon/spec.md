## ADDED Requirements

### Requirement: Dual-Button Expandable Interface
The floating icon SHALL transform into two distinct action buttons when the user hovers over it, providing both instant translation and manual language selection options.

#### Scenario: Hover reveals two buttons
- **WHEN** user hovers their cursor over the floating icon
- **THEN** the icon smoothly expands to reveal two distinct buttons
- **AND** the buttons are labeled "Fast Translate" and "Manual Translate"
- **AND** both buttons remain accessible while cursor is over the expanded interface

#### Scenario: Icon collapses when hover ends
- **WHEN** user moves cursor away from the icon and buttons
- **THEN** the interface smoothly collapses back to the compact single-icon state
- **AND** the icon remains visible at the same position
- **AND** the collapse animation completes within 200ms

#### Scenario: Buttons are visually distinct
- **WHEN** the dual-button interface is expanded
- **THEN** each button has clear visual distinction (different icons or colors)
- **AND** button labels or tooltips clearly indicate their purpose
- **AND** buttons meet minimum touch target size (40x40px) for accessibility

### Requirement: Fast Translate Action
The Fast Translate button SHALL trigger immediate translation of the selected text using the user's default target language, without requiring additional input.

#### Scenario: Fast translate executes immediately
- **WHEN** user clicks the "Fast Translate" button
- **THEN** the system immediately sends a translation request to OpenAI API
- **AND** uses the selected text and default target language from storage
- **AND** displays a loading state in the translation modal

#### Scenario: Fast translate shows result in modal
- **WHEN** fast translation completes successfully
- **THEN** the translation modal opens with the result pre-populated
- **AND** the original text is displayed in the source section
- **AND** the translated text is displayed in the translation section
- **AND** the floating icon is hidden

#### Scenario: Fast translate handles errors
- **WHEN** fast translation fails (network error, API error, invalid API key)
- **THEN** the translation modal opens with an error message
- **AND** the original selected text is still displayed
- **AND** user can retry or switch to manual translation

### Requirement: Manual Translate Action
The Manual Translate button SHALL open the translation modal with empty translation field, allowing users to select target language before translating.

#### Scenario: Manual translate opens modal for language selection
- **WHEN** user clicks the "Manual Translate" button
- **THEN** the translation modal opens immediately
- **AND** the selected text is pre-filled in the source section
- **AND** the translation field is empty
- **AND** user can select target language from dropdown
- **AND** user must click "Translate" button to trigger translation

#### Scenario: Manual translate preserves existing behavior
- **WHEN** user clicks "Manual Translate"
- **THEN** the modal behavior matches the current single-button behavior
- **AND** all existing modal features remain functional (language selection, copy button, etc.)
- **AND** the floating icon is hidden

#### Scenario: Modal respects instantTranslation setting
- **WHEN** user has `instantTranslation` setting enabled
- **THEN** "Fast Translate" button still triggers instant translation
- **AND** "Manual Translate" button still allows manual language selection
- **AND** both modes work independently of the setting
