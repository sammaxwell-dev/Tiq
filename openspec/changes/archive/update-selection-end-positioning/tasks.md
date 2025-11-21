# Implementation Tasks

## 1. Implement Selection Direction Detection
- [ ] 1.1 Research Range API for detecting selection endpoint (endContainer, endOffset)
- [ ] 1.2 Add helper function to determine if selection is LTR or RTL
- [ ] 1.3 Use anchorNode vs focusNode comparison to detect direction
- [ ] 1.4 Handle edge cases (single-line vs multi-line selections)
- [ ] 1.5 Test direction detection with various selection patterns

## 2. Calculate Endpoint Position
- [ ] 2.1 Extract selection Range using window.getSelection().getRangeAt(0)
- [ ] 2.2 Get endContainer and endOffset from the Range object
- [ ] 2.3 Create a new Range at the endpoint position only
- [ ] 2.4 Use getBoundingClientRect() on the endpoint range to get coordinates
- [ ] 2.5 Add 8px horizontal offset from the endpoint boundary
- [ ] 2.6 Calculate vertical alignment (baseline or center of endpoint character)

## 3. Update Icon Positioning Logic in ContentApp
- [ ] 3.1 Remove current bounding box positioning logic
- [ ] 3.2 Implement endpoint-based position calculation
- [ ] 3.3 Update iconPos state with new x, y coordinates
- [ ] 3.4 Handle null/undefined cases when selection is invalid
- [ ] 3.5 Optimize performance (avoid excessive recalculations)

## 4. Handle Viewport Boundary Constraints
- [ ] 4.1 Check if calculated x position exceeds viewport width
- [ ] 4.2 Check if calculated x position is less than 16px
- [ ] 4.3 Check if calculated y position exceeds viewport height
- [ ] 4.4 Check if calculated y position is less than 16px
- [ ] 4.5 Adjust position to maintain 16px minimum padding from all edges
- [ ] 4.6 Ensure icon size (32px) is accounted for in boundary calculations
- [ ] 4.7 Prioritize staying close to endpoint while ensuring visibility

## 5. Test Endpoint Positioning Scenarios
- [ ] 5.1 Test left-to-right text selection on single line
- [ ] 5.2 Test right-to-left text selection on single line
- [ ] 5.3 Test multi-line selection ending on different lines
- [ ] 5.4 Test selection at page boundaries (top, bottom, left, right)
- [ ] 5.5 Test selection in scrolled content
- [ ] 5.6 Test selection in elements with complex layouts (flex, grid, absolute positioning)
- [ ] 5.7 Test keyboard-based selection (Shift + arrows)
- [ ] 5.8 Test triple-click selection (whole paragraph)
- [ ] 5.9 Test selection in RTL languages (Arabic, Hebrew) if applicable

## 6. Edge Case Handling
- [ ] 6.1 Handle selections in iframes (if applicable)
- [ ] 6.2 Handle selections across multiple elements
- [ ] 6.3 Handle selections in fixed/sticky positioned elements
- [ ] 6.4 Handle selections during page scroll
- [ ] 6.5 Handle very small selections (1-2 characters)
- [ ] 6.6 Handle viewport resize while icon is visible

## 7. Performance Optimization
- [ ] 7.1 Ensure position calculation completes within debounce timeout (150ms)
- [ ] 7.2 Optimize getBoundingClientRect calls (cache when possible)
- [ ] 7.3 Avoid layout thrashing by batching DOM reads
- [ ] 7.4 Profile performance on pages with complex DOM structures

## 8. Visual Polish
- [ ] 8.1 Ensure icon appears smoothly at endpoint without jank
- [ ] 8.2 Verify 8px offset provides visual clarity
- [ ] 8.3 Test visual alignment with different font sizes
- [ ] 8.4 Ensure icon doesn't overlap selected text
- [ ] 8.5 Test appearance on different background colors

## 9. Cross-Browser Testing
- [ ] 9.1 Test on Chrome (primary target)
- [ ] 9.2 Test on Edge (Chromium-based)
- [ ] 9.3 Verify Range API compatibility
- [ ] 9.4 Test on different screen sizes and resolutions
