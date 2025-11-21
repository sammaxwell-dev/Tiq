## ADDED Requirements

### Requirement: Selection Direction Detection
The system SHALL detect the direction of text selection to determine the appropriate endpoint for icon placement.

#### Scenario: Detect left-to-right selection
- **WHEN** user selects text by dragging cursor from left to right
- **THEN** the system identifies the selection direction as LTR
- **AND** marks the rightmost position as the selection endpoint
- **AND** stores the endpoint coordinates for icon positioning

#### Scenario: Detect right-to-left selection
- **WHEN** user selects text by dragging cursor from right to left
- **THEN** the system identifies the selection direction as RTL
- **AND** marks the leftmost position as the selection endpoint
- **AND** stores the endpoint coordinates for icon positioning

#### Scenario: Handle keyboard selection
- **WHEN** user selects text using keyboard (Shift + Arrow keys)
- **THEN** the system detects the current cursor position as the endpoint
- **AND** positions icon based on the final cursor location

### Requirement: Endpoint-Based Icon Positioning
The floating icon SHALL appear at the endpoint of the text selection, offset by a small margin, following the natural direction of the user's selection gesture.

#### Scenario: Position icon at LTR selection endpoint
- **WHEN** user completes a left-to-right text selection
- **THEN** the icon appears immediately to the right of the last selected character
- **AND** is offset by 8 pixels horizontally from the selection boundary
- **AND** vertically aligns with the endpoint character baseline or center

#### Scenario: Position icon at RTL selection endpoint
- **WHEN** user completes a right-to-left text selection
- **THEN** the icon appears at the left endpoint where the cursor stopped
- **AND** is offset by 8 pixels horizontally from the selection boundary
- **AND** vertically aligns with the endpoint character baseline or center

#### Scenario: Position icon for multi-line selection
- **WHEN** user selects text spanning multiple lines
- **THEN** the icon appears at the endpoint of the selection on the final line
- **AND** is positioned relative to where the user's cursor ended
- **AND** maintains the 8px offset from the character

#### Scenario: Calculate endpoint coordinates using Range API
- **WHEN** system needs to position the icon
- **THEN** it uses Selection.getRangeAt(0) to get the selection range
- **AND** extracts the endContainer and endOffset from the range
- **AND** converts the DOM endpoint to viewport coordinates using getBoundingClientRect
- **AND** applies the 8px offset to calculate final icon position

### Requirement: Viewport Boundary Constraints
The floating icon SHALL remain fully visible within the viewport, even when the calculated endpoint position would place it outside visible boundaries.

#### Scenario: Adjust position when too close to right edge
- **WHEN** the endpoint-based position would place icon beyond viewport right edge
- **THEN** the icon is repositioned leftward to remain fully visible
- **AND** maintains minimum 16px padding from the viewport edge

#### Scenario: Adjust position when too close to left edge
- **WHEN** the endpoint-based position would place icon beyond viewport left edge
- **THEN** the icon is repositioned rightward to remain fully visible
- **AND** maintains minimum 16px padding from the viewport edge

#### Scenario: Adjust position when too close to top edge
- **WHEN** the endpoint-based position would place icon beyond viewport top edge
- **THEN** the icon is repositioned downward to remain fully visible
- **AND** maintains minimum 16px padding from the viewport edge

#### Scenario: Adjust position when too close to bottom edge
- **WHEN** the endpoint-based position would place icon beyond viewport bottom edge
- **THEN** the icon is repositioned upward to remain fully visible
- **AND** maintains minimum 16px padding from the viewport edge

#### Scenario: Prioritize endpoint positioning over boundaries
- **WHEN** there is a conflict between endpoint positioning and viewport constraints
- **THEN** the system first tries to position at the endpoint
- **AND** only adjusts the position if the icon would be clipped or invisible
- **AND** makes minimal adjustments to stay as close to the endpoint as possible
