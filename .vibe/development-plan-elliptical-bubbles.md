# Development Plan: demo-responsible-vibe-wardley (elliptical-bubbles branch)

*Generated on 2025-08-25 by Vibe Feature MCP*
*Workflow: [minor](https://mrsimpson.github.io/responsible-vibe-mcp/workflows/minor)*

## Goal
Fix text truncation issue in Wardley Map Editor by replacing circular bubbles with elliptical/rectangular shapes that better accommodate text content.

## Explore
### Tasks
- [x] Analyze current bubble rendering implementation
- [x] Identify where circular shapes are defined
- [x] Research text measurement and optimal bubble sizing
- [x] Design elliptical/rectangular bubble approach
- [x] Consider impact on existing maps and visual consistency

### Completed
- [x] Created development plan file
- [x] Found bubble rendering in Canvas.tsx - components use fixed 25px radius circles
- [x] Located text rendering inside circles at lines 232-244
- [x] Researched text measurement approaches (getBBox, Canvas measureText, estimation)
- [x] Designed elliptical bubble solution with dynamic width calculation
- [x] Assessed impact: backward compatible, improves UX, maintains visual hierarchy

## Implement
### Phase Entrance Criteria:
- [x] Current bubble implementation has been analyzed and understood
- [x] Text truncation problem root cause has been identified
- [x] Design approach for elliptical/rectangular bubbles has been defined
- [x] Impact on existing functionality has been assessed

### Tasks
- [x] Create text width calculation utility function
- [x] Replace circle elements with ellipse elements in Canvas.tsx
- [x] Update component rendering with dynamic width calculation
- [x] Update selection indicators to match elliptical shape
- [x] Update connection indicators to match elliptical shape
- [x] Test with various text lengths (short, medium, long names)
- [x] Verify existing functionality still works (drag, select, connect)
- [x] Test export functionality with new elliptical shapes

### Completed
- [x] Created textUtils.ts with text width estimation and bubble dimension calculation
- [x] Updated Canvas.tsx to import getBubbleDimensions utility
- [x] Replaced circle elements with ellipse elements using dynamic rx/ry values
- [x] Updated all selection and connection indicators to use elliptical shapes
- [x] User verified implementation works correctly with dynamic text sizing
- [x] Confirmed existing drag, select, and connect functionality remains intact
- [x] Verified export service already uses ellipse shapes with appropriate dimensions for each format

## Finalize
### Phase Entrance Criteria:
- [x] New bubble shape implementation is complete and functional
- [x] Text truncation issue has been resolved
- [x] Existing maps still render correctly
- [x] Code changes have been tested

### Tasks
- [x] Remove any debug output or temporary code
- [x] Review and clean up TODO/FIXME comments
- [x] Verify code quality and consistency
- [x] Update documentation if needed
- [x] Final validation of functionality

### Completed
- [x] Verified no debug output, console statements, or temporary code in implementation
- [x] Confirmed no TODO/FIXME comments need addressing
- [x] Code quality review: well-documented, properly typed, follows consistent patterns
- [x] Documentation review: no updates needed (enhancement is transparent to users)
- [x] Final validation: user confirmed functionality works correctly

## Key Decisions
**Current Implementation Analysis:**
- Components are rendered as SVG circles with fixed 25px radius in Canvas.tsx (line 217)
- Text is centered inside circles using `textAnchor="middle"` with 12px font size
- No dynamic sizing based on text length - causes truncation for longer names
- Text styling: white color, 600 font weight, 12px size

**Root Cause:**
- Fixed circle radius (25px) doesn't adapt to text content length
- Longer component names get visually cut off within the circular boundary

**Chosen Solution: Elliptical Bubbles**
- Replace `<circle>` with `<ellipse>` elements
- Dynamic width calculation: `textWidth + padding`
- Fixed height: maintain current 25px radius for vertical consistency
- Text measurement using estimated character width (~7px) + padding (16px total)
- Minimum width: 50px (current circle diameter)
- Maximum width: 200px (prevent overly wide bubbles)

**Implementation Plan:**
1. Create text width calculation utility function
2. Replace circle elements with ellipse elements
3. Calculate rx (horizontal radius) dynamically, keep ry (vertical radius) fixed
4. Update selection indicators to match elliptical shape
5. Test with various text lengths

**Final Implementation Summary:**
- Successfully replaced fixed circular bubbles with dynamic elliptical bubbles
- Text truncation issue completely resolved
- Maintains visual consistency and existing functionality
- Clean, well-documented code with proper TypeScript types
- No breaking changes - enhancement is transparent to users
- Export functionality remains compatible with all formats

## Notes
**Text Measurement Research:**

SVG text measurement approaches:
1. **getBBox()** - Most accurate, requires DOM element to exist
2. **Canvas measureText()** - Good approximation, works without DOM
3. **Estimated calculation** - Fast but less accurate, based on character count and font metrics

**Design Considerations:**
- Need to balance text readability with visual consistency
- Should maintain similar visual weight to current circular design
- Consider minimum and maximum bubble sizes
- Ensure bubbles don't overlap when text is very long
- Maintain proper spacing and alignment

**Potential Solutions:**
1. **Elliptical bubbles** - Stretch horizontally based on text width
2. **Rounded rectangles** - More space-efficient, better text accommodation
3. **Dynamic circles** - Increase radius based on text, but may look inconsistent

**Font Metrics (current):**
- Font size: 12px
- Font weight: 600 (semi-bold)
- Font family: Default system font
- Approximate character width: ~7-8px for average characters

**Impact Assessment:**
- **Backward Compatibility**: Existing maps will automatically benefit from better text display
- **Visual Consistency**: Maintains vertical alignment and spacing, only adjusts horizontal width
- **User Experience**: Significantly improves readability, reduces frustration with truncated text
- **Performance**: Minimal impact - simple text width calculation
- **Export Compatibility**: SVG ellipse elements supported in all export formats (PDF, PNG, Draw.io)

**Risks & Mitigations:**
- Risk: Very long names could create overly wide bubbles
- Mitigation: Implement maximum width limit (200px) with text wrapping or ellipsis
- Risk: Overlapping components with wider bubbles  
- Mitigation: Users can adjust positioning as needed (existing drag functionality)

---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
