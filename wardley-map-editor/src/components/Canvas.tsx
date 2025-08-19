import React, { useRef, useCallback, useState } from 'react'
import { useMapStore } from '../stores/mapStore'

const Canvas: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragState, setDragState] = useState<{ componentId: string | null, offset: { x: number, y: number } }>({
    componentId: null,
    offset: { x: 0, y: 0 }
  })
  
  const { 
    components, 
    selectedId, 
    selectComponent, 
    updateComponent,
    startDrag,
    endDrag,
    isDragging 
  } = useMapStore()

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
    if (event.target === svgRef.current && !isDragging) {
      selectComponent(null)
    }
  }, [selectComponent, isDragging])

  // Handle component mouse down (start drag)
  const handleComponentMouseDown = useCallback((event: React.MouseEvent, componentId: string) => {
    event.stopPropagation()
    const coords = screenToMapCoords(event.clientX, event.clientY)
    const component = components.find(c => c.id === componentId)
    
    if (component) {
      const offset = {
        x: coords.x - component.x,
        y: coords.y - component.y
      }
      
      setDragState({ componentId, offset })
      startDrag(componentId)
      selectComponent(componentId)
    }
  }, [components, screenToMapCoords, startDrag, selectComponent])

  // Handle mouse move (drag component)
  const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging && dragState.componentId) {
      const coords = screenToMapCoords(event.clientX, event.clientY)
      const newX = coords.x - dragState.offset.x
      const newY = coords.y - dragState.offset.y
      
      updateComponent(dragState.componentId, { 
        x: Math.max(0, Math.min(1, newX)), 
        y: Math.max(0, Math.min(1, newY)) 
      })
    }
  }, [isDragging, dragState, screenToMapCoords, updateComponent])

  // Handle mouse up (end drag)
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      endDrag()
      setDragState({ componentId: null, offset: { x: 0, y: 0 } })
    }
  }, [isDragging, endDrag])

  return (
    <div style={{ flex: 1, overflow: 'hidden', backgroundColor: 'white' }}>
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 1000 600"
        style={{ border: '1px solid #d1d5db', cursor: isDragging ? 'grabbing' : 'default' }}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Background grid */}
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

        {/* Evolution Axis */}
        <g>
          {/* Main axis line */}
          <line x1="0" y1="550" x2="1000" y2="550" stroke="#374151" strokeWidth="2" />
          
          {/* Stage labels */}
          <text x="125" y="580" textAnchor="middle" fill="#374151" fontSize="14" fontWeight="500">
            Genesis
          </text>
          <text x="375" y="580" textAnchor="middle" fill="#374151" fontSize="14" fontWeight="500">
            Custom
          </text>
          <text x="625" y="580" textAnchor="middle" fill="#374151" fontSize="14" fontWeight="500">
            Product
          </text>
          <text x="875" y="580" textAnchor="middle" fill="#374151" fontSize="14" fontWeight="500">
            Commodity
          </text>
          
          {/* Stage dividers */}
          <line x1="250" y1="540" x2="250" y2="560" stroke="#6B7280" strokeWidth="1" />
          <line x1="500" y1="540" x2="500" y2="560" stroke="#6B7280" strokeWidth="1" />
          <line x1="750" y1="540" x2="750" y2="560" stroke="#6B7280" strokeWidth="1" />
          
          {/* Axis title */}
          <text x="500" y="595" textAnchor="middle" fill="#1f2937" fontSize="16" fontWeight="600">
            Evolution
          </text>
        </g>

        {/* Value Chain Axis */}
        <g>
          {/* Main axis line */}
          <line x1="50" y1="50" x2="50" y2="550" stroke="#374151" strokeWidth="2" />
          
          {/* Labels */}
          <text x="35" y="55" textAnchor="end" fill="#374151" fontSize="14" fontWeight="500">
            Visible
          </text>
          <text x="35" y="555" textAnchor="end" fill="#374151" fontSize="14" fontWeight="500">
            Invisible
          </text>
          
          {/* Axis title (rotated) */}
          <text x="20" y="300" textAnchor="middle" fill="#1f2937" fontSize="16" fontWeight="600" transform="rotate(-90, 20, 300)">
            Value Chain
          </text>
        </g>

        {/* Components */}
        {components.map(component => {
          const isSelected = component.id === selectedId
          const x = component.x * 1000
          const y = component.y * 500 + 50 // Offset for axis space
          
          return (
            <g key={component.id}>
              {/* Component circle */}
              <circle
                cx={x}
                cy={y}
                r="25"
                fill={component.color}
                stroke={isSelected ? '#3B82F6' : '#374151'}
                strokeWidth={isSelected ? 3 : 2}
                style={{ 
                  cursor: 'grab',
                  opacity: isDragging && dragState.componentId === component.id ? 0.7 : 1,
                  transition: isDragging ? 'none' : 'all 0.2s ease'
                }}
                onMouseDown={(e) => handleComponentMouseDown(e, component.id)}
              />
              
              {/* Component label */}
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="600"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {component.name}
              </text>
              
              {/* Selection indicator */}
              {isSelected && (
                <circle
                  cx={x}
                  cy={y}
                  r="30"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  style={{ pointerEvents: 'none' }}
                />
              )}
            </g>
          )
        })}
        
        {/* Instructions when no components */}
        {components.length === 0 && (
          <text x="500" y="300" textAnchor="middle" fill="#6b7280" fontSize="16">
            Add components from the left panel to start creating your Wardley map
          </text>
        )}
      </svg>
    </div>
  )
}

export default Canvas
