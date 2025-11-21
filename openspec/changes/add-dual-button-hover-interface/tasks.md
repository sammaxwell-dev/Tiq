# Implementation Tasks

## 1. Refactor FloatingIcon Component
- [ ] 1.1 Add hover state management using React useState
- [ ] 1.2 Create two button elements (Fast Translate, Manual Translate) within the component
- [ ] 1.3 Implement conditional rendering to show single icon vs dual buttons based on hover state
- [ ] 1.4 Add distinct icons for each button (e.g., Zap for fast, Settings for manual)
- [ ] 1.5 Add proper ARIA labels and accessibility attributes
- [ ] 1.6 Ensure buttons meet 40x40px minimum touch target size

## 2. Implement Expansion Animation
- [ ] 2.1 Design layout for expanded state (horizontal side-by-side or vertical stack)
- [ ] 2.2 Add Tailwind transition classes for smooth expansion/collapse
- [ ] 2.3 Implement hover detection with proper mouseenter/mouseleave handlers
- [ ] 2.4 Add 200ms transition duration for collapse animation
- [ ] 2.5 Test animation smoothness on various browsers

## 3. Update ContentApp Translation Logic
- [ ] 3.1 Modify FloatingIcon props to accept two separate onClick handlers
- [ ] 3.2 Create `handleFastTranslate` function for instant translation
- [ ] 3.3 Create `handleManualTranslate` function for modal-based translation
- [ ] 3.4 Implement fast translate flow: fetch translation, then show modal with result
- [ ] 3.5 Implement manual translate flow: show modal without pre-translation
- [ ] 3.6 Update error handling for both translation paths
- [ ] 3.7 Ensure both modes hide the floating icon when activated

## 4. Fast Translate Implementation
- [ ] 4.1 Extract translation API call logic into reusable function
- [ ] 4.2 Implement loading state for fast translate operation
- [ ] 4.3 Pre-populate modal with translation result on success
- [ ] 4.4 Handle API errors and display in modal
- [ ] 4.5 Test with valid API key and default language settings
- [ ] 4.6 Test error scenarios (no API key, network failure, rate limit)

## 5. Manual Translate Implementation
- [ ] 5.1 Ensure modal opens with selected text pre-filled
- [ ] 5.2 Verify translation field starts empty
- [ ] 5.3 Confirm language selection dropdown is functional
- [ ] 5.4 Maintain existing translate button behavior
- [ ] 5.5 Test that all modal features work correctly (copy, close, drag)

## 6. Styling and Visual Design
- [ ] 6.1 Design visual distinction between Fast and Manual buttons (colors/icons)
- [ ] 6.2 Add hover states for individual buttons within expanded interface
- [ ] 6.3 Ensure expanded interface fits within viewport boundaries
- [ ] 6.4 Test responsive behavior on mobile devices
- [ ] 6.5 Verify Shadow DOM style isolation still works

## 7. Testing
- [ ] 7.1 Test hover expansion and collapse animations
- [ ] 7.2 Test fast translate with various text selections
- [ ] 7.3 Test manual translate with various text selections
- [ ] 7.4 Test both buttons with different target languages
- [ ] 7.5 Test error handling for both translate modes
- [ ] 7.6 Test accessibility (keyboard navigation, screen readers)
- [ ] 7.7 Test on multiple websites with different styles
- [ ] 7.8 Test on mobile and desktop viewports
- [ ] 7.9 Verify instantTranslation setting doesn't conflict with new buttons
