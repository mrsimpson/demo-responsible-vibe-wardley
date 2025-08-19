import React, { useRef, useCallback, useState, useEffect } from 'react'
import { useMapStore } from '../stores/mapStore'

interface DragState {
  componentId: string | null
  isDragging: boolean
  startPos: { x: number, y: number }
  offset: { x: number, y: number }
  currentPos: { x: number, y: number }
}

const Canvas: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragState, setDragState] = useState<DragState>({
    componentId: null,
    isDragging: false,
    startPos: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    currentPos: { x: 0, y: 0 }
  })
  
  const { 
    components, 
    selectedId, 
    selectComponent, 
    updateComponent,
    startDrag,
    endDrag,
    isDragging: storeIsDragging
  } = useMapStore()

  // Convert screen coordinates to map coordinates (0-1 scale)
  const screenToMapCoords = useCallback((screenX: number, screenY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 }
    
    const rect = svgRef.current.getBoundingClientRect()
    const x = (screenX - rect.left) / rect.width
    const y = (screenY - rect.top - 50) / 500 // Account for axis offset and canvas height
    
    return {
      x: Math.max(0, Math.min(1, x)),
      y: Math.max(0, Math.min(1, y))
    }
  }, [])

  // Convert map coordinates to SVG coordinates
  const mapToSVGCoords = useCallback((mapX: number, mapY: number) => {
    return {
      x: mapX * 1000,
      y: mapY * 500 + 50 // Account for axis offset
    }
  }, [])

  // Handle canvas click (deselect components when clicking empty space)
  const handleCanvasClick = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (event.target === svgRef.current && !dragState.isDragging) {
      selectComponent(null)
    }
  }, [selectComponent, dragState.isDragging])

  // Handle component mouse down (start drag)
  const handleComponentMouseDown = useCallback((event: React.MouseEvent, componentId: string) => {
    event.stopPropagation()
    event.preventDefault()
    
    const component = components.find(c => c.id === componentId)
    if (!component) return

    const screenCoords = screenToMapCoords(event.clientX, event.clientY)
    const svgCoords = mapToSVGCoords(component.x, component.y)
    
    const newDragState: DragState = {
      componentId,
      isDragging: true,
      startPos: { x: event.clientX, y: event.clientY },
      offset: {
        x: screenCoords.x - component.x,
        y: screenCoords.y - component.y
      },
      currentPos: { x: svgCoords.x, y: svgCoords.y }
    }
    
    setDragState(newDragState)
    startDrag(componentId)
    selectComponent(componentId)
    
    // Add global mouse event listeners
    document.addEventListener('mousemove', handleGlobalMouseMove)
    document.addEventListener('mouseup', handleGlobalMouseUp)
  }, [components, screenToMapCoords, mapToSVGCoords, startDrag, selectComponent])

  // Global mouse move handler
  const handleGlobalMouseMove = useCallback((event: MouseEvent) => {
    if (!dragState.isDragging || !dragState.componentId) return
    
    const mapCoords = screenToMapCoords(event.clientX, event.clientY)
    const constrainedCoords = {
      x: Math.max(0, Math.min(1, mapCoords.x - dragState.offset.x)),
      y: Math.max(0, Math.min(1, mapCoords.y - dragState.offset.y))
    }
    
    const svgCoords = mapToSVGCoords(constrainedCoords.x, constrainedCoords.y)
    
    // Update drag state for visual feedback
    setDragState(prev => ({
      ...prev,
      currentPos: svgCoords
    }))
    
    // Update component position in store
    updateComponent(dragState.componentId, constrainedCoords)
  }, [dragState, screenToMapCoords, mapToSVGCoords, updateComponent])

  // Global mouse up handler
  const handleGlobalMouseUp = useCallback(() => {
    if (dragState.isDragging) {
      setDragState({
        componentId: null,
        isDragging: false,
        startPos: { x: 0, y: 0 },
        offset: { x: 0, y: 0 },
        currentPos: { x: 0, y: 0 }
      })
      endDrag()
      
      // Remove global event listeners
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [dragState.isDragging, endDrag, handleGlobalMouseMove])

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [handleGlobalMouseMove, handleGlobalMouseUp])

  // Get evolution stage name for display
  const getEvolutionStage = (x: number) => {
    if (x < 0.25) return 'Genesis'
    if (x < 0.5) return 'Custom'
    if (x < 0.75) return 'Product'
    return 'Commodity'
  }

  return (
    <div style={{ flex: 1, overflow: 'hidden', backgroundColor: 'white' }}>
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 1000 600"
        style={{ 
          border: '1px solid #d1d5db', 
          cursor: dragState.isDragging ? 'grabbing' : 'default',
          userSelect: 'none'
        }}
        onClick={handleCanvasClick}
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
          
          {/* Drop shadow filter for dragging components */}
          <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Evolution Axis */}
        <g>
          {/* Stage backgrounds */}
          <rect x="0" y="50" width="250" height="500" fill="#fef3c7" opacity="0.2" />
          <rect x="250" y="50" width="250" height="500" fill="#ddd6fe" opacity="0.2" />
          <rect x="500" y="50" width="250" height="500" fill="#dcfce7" opacity="0.2" />
          <rect x="750" y="50" width="250" height="500" fill="#fee2e2" opacity="0.2" />
          
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
          
          {/* Grid lines */}
          <line x1="50" y1="50" x2="1000" y2="50" stroke="#e5e7eb" strokeWidth="1" opacity="0.5" />
          <line x1="50" y1="175" x2="1000" y2="175" stroke="#e5e7eb" strokeWidth="1" opacity="0.3" />
          <line x1="50" y1="300" x2="1000" y2="300" stroke="#e5e7eb" strokeWidth="1" opacity="0.3" />
          <line x1="50" y1="425" x2="1000" y2="425" stroke="#e5e7eb" strokeWidth="1" opacity="0.3" />
          <line x1="50" y1="550" x2="1000" y2="550" stroke="#e5e7eb" strokeWidth="1" opacity="0.5" />
          
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
          const isDraggingThis = dragState.isDragging && dragState.componentId === component.id
          
          // Use drag position if dragging, otherwise use component position
          const svgCoords = isDraggingThis 
            ? dragState.currentPos
            : mapToSVGCoords(component.x, component.y)
          
          return (
            <g key={component.id}>
              {/* Component circle */}
              <circle
                cx={svgCoords.x}
                cy={svgCoords.y}
                r={isDraggingThis ? "28" : "25"}
                fill={component.color}
                stroke={isSelected ? '#3B82F6' : '#374151'}
                strokeWidth={isSelected ? 3 : 2}
                style={{ 
                  cursor: isDraggingThis ? 'grabbing' : 'grab',
                  opacity: isDraggingThis ? 0.8 : 1,
                  filter: isDraggingThis ? 'url(#dropShadow)' : 'none',
                  transition: isDraggingThis ? 'none' : 'all 0.2s ease'
                }}
                onMouseDown={(e) => handleComponentMouseDown(e, component.id)}
              />
              
              {/* Component label */}
              <text
                x={svgCoords.x}
                y={svgCoords.y + 5}
                textAnchor="middle"
                fill="white"
                fontSize={isDraggingThis ? "13" : "12"}
                fontWeight="600"
                style={{ 
                  pointerEvents: 'none', 
                  userSelect: 'none',
                  filter: isDraggingThis ? 'url(#dropShadow)' : 'none'
                }}
              >
                {component.name}
              </text>
              
              {/* Selection indicator */}
              {isSelected && !isDraggingThis && (
                <circle
                  cx={svgCoords.x}
                  cy={svgCoords.y}
                  r="30"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  style={{ pointerEvents: 'none' }}
                >
                  <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    from={`0 ${svgCoords.x} ${svgCoords.y}`}
                    to={`360 ${svgCoords.x} ${svgCoords.y}`}
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              
              {/* Drag position indicator */}
              {isDraggingThis && (
                <g>
                  {/* Position info */}
                  <rect
                    x={svgCoords.x - 40}
                    y={svgCoords.y - 50}
                    width="80"
                    height="20"
                    fill="rgba(0,0,0,0.8)"
                    rx="4"
                  />
                  <text
                    x={svgCoords.x}
                    y={svgCoords.y - 37}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="500"
                  >
                    {getEvolutionStage(component.x)}
                  </text>
                </g>
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
