/**
 * Text measurement utilities for dynamic component sizing
 */

/**
 * Estimates the width of text based on character count and font metrics
 * This is a fast approximation that doesn't require DOM measurement
 * 
 * @param text - The text to measure
 * @param fontSize - Font size in pixels (default: 12)
 * @param fontWeight - Font weight (default: 600 for semi-bold)
 * @returns Estimated text width in pixels
 */
export function estimateTextWidth(text: string, fontSize: number = 12, fontWeight: number = 600): number {
  // Base character width for 12px semi-bold font
  // This is an approximation based on average character widths
  const baseCharWidth = 7.2
  
  // Adjust for font size
  const charWidth = (fontSize / 12) * baseCharWidth
  
  // Adjust for font weight (semi-bold is slightly wider than normal)
  const weightMultiplier = fontWeight >= 600 ? 1.1 : 1.0
  
  return text.length * charWidth * weightMultiplier
}

/**
 * Calculates the horizontal radius (rx) for an elliptical component bubble
 * 
 * @param text - The component name text
 * @param minWidth - Minimum bubble width in pixels (default: 50)
 * @param maxWidth - Maximum bubble width in pixels (default: 200)
 * @param padding - Horizontal padding inside the bubble (default: 16)
 * @returns Horizontal radius (rx) for the ellipse
 */
export function calculateBubbleRadius(
  text: string, 
  minWidth: number = 50, 
  maxWidth: number = 200, 
  padding: number = 16
): number {
  const textWidth = estimateTextWidth(text)
  const totalWidth = textWidth + padding
  
  // Ensure width is within bounds
  const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, totalWidth))
  
  // Return horizontal radius (half of width)
  return constrainedWidth / 2
}

/**
 * Gets the bubble dimensions for a component
 * 
 * @param text - The component name text
 * @returns Object with rx (horizontal radius) and ry (vertical radius)
 */
export function getBubbleDimensions(text: string) {
  return {
    rx: calculateBubbleRadius(text),
    ry: 25 // Fixed vertical radius to maintain consistent height
  }
}
