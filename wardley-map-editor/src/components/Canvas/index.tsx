import React, { useRef, useCallback } from 'react'
import { useMapStore } from '../../stores/mapStore'
import EvolutionAxis from './EvolutionAxis'
import ValueChainAxis from './ValueChainAxis'
import ComponentLayer from './ComponentLayer'
import ConnectionLayer from './ConnectionLayer'

const Canvas: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const { viewport, updateViewport, selectComponent, isDragging } = useMapStore()

  // Convert screen coordinates to map coordinates (0-1 scale)
  const screenToMapCoords = useCallback((screenX: number, screenY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 }
    
    const rect = svgRef.current.getBoundingClientRect()
    const x = (screenX - rect.left) / rect.width
    const y = (screenY - rect.top) / rect.height
    
    return {
      x: Math.max(0, Math.min(1, x)),
      y: Math.max(0, Math.min(1, y))
    }
  }, [])

  // Handle canvas click (deselect components when clicking empty space)
  const handleCanvasClick = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    // Only deselect if we clicked directly on the canvas (not on a component)
    if (event.target === svgRef.current && !isDragging) {
      selectComponent(null)
    }
  }, [selectComponent, isDragging])

  // Handle mouse move for drag operations
  const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) {
      const coords = screenToMapCoords(event.clientX, event.clientY)
      useMapStore.getState().updateDrag(coords.x, coords.y)
    }
  }, [isDragging, screenToMapCoords])

  // Handle mouse up to end drag operations
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      useMapStore.getState().endDrag()
    }
  }, [isDragging])

  return (
    <div className="flex-1 overflow-hidden bg-white">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 1000 600"
        className="border border-gray-300 cursor-default"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // End drag if mouse leaves canvas
      >
        {/* Define arrow markers for connections */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#666"
            />
          </marker>
          
          <marker
            id="arrowhead-selected"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#3B82F6"
            />
          </marker>
        </defs>

        {/* Background grid (optional) */}
        <defs>
          <pattern
            id="grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="#f0f0f0"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Axes */}
        <EvolutionAxis />
        <ValueChainAxis />
        
        {/* Connections (drawn behind components) */}
        <ConnectionLayer />
        
        {/* Components */}
        <ComponentLayer screenToMapCoords={screenToMapCoords} />
      </svg>
    </div>
  )
}

export default Canvas
