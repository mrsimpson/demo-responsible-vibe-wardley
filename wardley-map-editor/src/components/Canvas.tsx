import React, { useRef, useCallback, forwardRef, useImperativeHandle } from 'react'
import { useMapStore } from '../stores/mapStore'
import ConnectionLayer from './ConnectionLayer'

const Canvas = forwardRef<SVGSVGElement>((props, ref) => {
  const svgRef = useRef<SVGSVGElement>(null)
  
  const { 
    components, 
    selectedId, 
    selectComponent, 
    updateComponent,
    // Connection state
    isConnecting,
    connectionStart,
    startConnection,
    completeConnection,
    cancelConnection
  } = useMapStore()

  // Properly expose the SVG ref
  useImperativeHandle(ref, () => svgRef.current!, [])

  // Convert screen coordinates to map coordinates (0-1 scale)
  const screenToMapCoords = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 }
    
    const rect = svgRef.current.getBoundingClientRect()
    
    // Calculate X coordinate (Evolution: 0-1 across canvas width)
    // SVG viewBox is now "-80 0 1080 600", so canvas area is from x=0 to x=1000 (1000 units wide)
    // Screen coordinates need to be mapped to this range
    const svgX = ((clientX - rect.left) / rect.width) * 1080 - 80 // Convert to SVG coordinates
    const canvasX = svgX / 1000 // Map to canvas area (0-1000 becomes 0-1)
    
    // Calculate Y coordinate (Value Chain: 0-1 from top to bottom)
    // SVG viewBox is 600 units tall, but canvas area is from y=50 to y=550 (500 units)
    const svgY = ((clientY - rect.top) / rect.height) * 600 // Convert to SVG coordinates
    const canvasY = (svgY - 50) / 500 // Map to canvas area (50-550 becomes 0-1)
    
    return {
      x: Math.max(0, Math.min(1, canvasX)),
      y: Math.max(0, Math.min(1, canvasY))
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
    if (event.target === svgRef.current) {
      if (isConnecting) {
        cancelConnection()
      } else {
        selectComponent(null)
      }
    }
  }, [selectComponent, isConnecting, cancelConnection])

  // Simple drag handlers
  const handleMouseDown = useCallback((event: React.MouseEvent, componentId: string) => {
    event.stopPropagation()
    event.preventDefault()
    
    // If we're in connection mode, complete the connection
    if (isConnecting && connectionStart) {
      completeConnection(componentId)
      return
    }
    
    selectComponent(componentId)
    
    const component = components.find(c => c.id === componentId)
    if (!component) return
    
    // Calculate initial offset between mouse and component center
    const startCoords = screenToMapCoords(event.clientX, event.clientY)
    const offsetX = startCoords.x - component.x
    const offsetY = startCoords.y - component.y
    
    const handleMouseMove = (e: MouseEvent) => {
      // Get current mouse position in map coordinates
      const currentCoords = screenToMapCoords(e.clientX, e.clientY)
      
      // Calculate new component position by subtracting the offset
      const newX = currentCoords.x - offsetX
      const newY = currentCoords.y - offsetY
      
      // Apply constraints to keep component within bounds
      const constrainedX = Math.max(0, Math.min(1, newX))
      const constrainedY = Math.max(0, Math.min(1, newY))
      
      updateComponent(componentId, { x: constrainedX, y: constrainedY })
    }
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [components, screenToMapCoords, updateComponent, selectComponent, isConnecting, connectionStart, completeConnection])

  // Handle component right-click (start connection)
  const handleRightClick = useCallback((event: React.MouseEvent, componentId: string) => {
    event.preventDefault()
    event.stopPropagation()
    
    if (!isConnecting) {
      startConnection(componentId)
    } else {
      cancelConnection()
    }
  }, [isConnecting, startConnection, cancelConnection])

  // Get evolution stage name
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
        viewBox="-80 0 1080 600"
        style={{ 
          border: '1px solid #d1d5db', 
          cursor: 'default',
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
          
          {/* Drop shadow filter */}
          <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Evolution Axis */}
        <g>
          {/* Stage backgrounds - start from x=0 to align with Genesis */}
          <rect x="0" y="50" width="250" height="500" fill="#fef3c7" opacity="0.2" />
          <rect x="250" y="50" width="250" height="500" fill="#ddd6fe" opacity="0.2" />
          <rect x="500" y="50" width="250" height="500" fill="#dcfce7" opacity="0.2" />
          <rect x="750" y="50" width="250" height="500" fill="#fee2e2" opacity="0.2" />
          
          {/* Main axis line - horizontal at bottom starting from x=0 */}
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
          {/* Main axis line - vertical from top to bottom at x=0 (Genesis position) */}
          <line x1="0" y1="50" x2="0" y2="550" stroke="#374151" strokeWidth="2" />
          
          {/* Grid lines - horizontal reference lines */}
          <line x1="0" y1="50" x2="1000" y2="50" stroke="#e5e7eb" strokeWidth="1" opacity="0.5" />
          <line x1="0" y1="175" x2="1000" y2="175" stroke="#e5e7eb" strokeWidth="1" opacity="0.3" />
          <line x1="0" y1="300" x2="1000" y2="300" stroke="#e5e7eb" strokeWidth="1" opacity="0.3" />
          <line x1="0" y1="425" x2="1000" y2="425" stroke="#e5e7eb" strokeWidth="1" opacity="0.3" />
          <line x1="0" y1="550" x2="1000" y2="550" stroke="#e5e7eb" strokeWidth="1" opacity="0.5" />
          
          {/* Labels - positioned in the left padding area */}
          <text x="-15" y="55" textAnchor="end" fill="#374151" fontSize="14" fontWeight="500">
            Visible
          </text>
          <text x="-15" y="555" textAnchor="end" fill="#374151" fontSize="14" fontWeight="500">
            Invisible
          </text>
          
          {/* Axis title (rotated) - positioned in the left padding area */}
          <text x="-50" y="300" textAnchor="middle" fill="#1f2937" fontSize="16" fontWeight="600" transform="rotate(-90, -50, 300)">
            Value Chain
          </text>
        </g>

        {/* Connections (drawn behind components) */}
        <ConnectionLayer mapToSVGCoords={mapToSVGCoords} />

        {/* Components */}
        {components.map(component => {
          const isSelected = component.id === selectedId
          const isConnectionStart = connectionStart === component.id
          const isConnectionTarget = isConnecting && connectionStart !== component.id
          
          const svgCoords = mapToSVGCoords(component.x, component.y)
          
          return (
            <g key={component.id}>
              {/* Component circle */}
              <circle
                cx={svgCoords.x}
                cy={svgCoords.y}
                r="25"
                fill={component.color}
                stroke={
                  isConnectionStart ? '#F59E0B' : 
                  isConnectionTarget ? '#10B981' :
                  isSelected ? '#3B82F6' : '#374151'
                }
                strokeWidth={isSelected || isConnectionStart ? 3 : 2}
                style={{ 
                  cursor: isConnecting ? 'crosshair' : 'grab',
                  transition: 'all 0.2s ease'
                }}
                onMouseDown={(e) => handleMouseDown(e, component.id)}
                onContextMenu={(e) => handleRightClick(e, component.id)}
              />
              
              {/* Component label */}
              <text
                x={svgCoords.x}
                y={svgCoords.y + 5}
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="600"
                style={{ 
                  pointerEvents: 'none', 
                  userSelect: 'none'
                }}
              >
                {component.name}
              </text>
              
              {/* Simple selection indicator - no animation */}
              {isSelected && !isConnectionStart && (
                <circle
                  cx={svgCoords.x}
                  cy={svgCoords.y}
                  r="30"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  style={{ pointerEvents: 'none' }}
                />
              )}
              
              {/* Connection start indicator */}
              {isConnectionStart && (
                <circle
                  cx={svgCoords.x}
                  cy={svgCoords.y}
                  r="35"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="3"
                  strokeDasharray="8,4"
                  style={{ pointerEvents: 'none' }}
                />
              )}
              
              {/* Connection target indicator */}
              {isConnectionTarget && (
                <circle
                  cx={svgCoords.x}
                  cy={svgCoords.y}
                  r="32"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeDasharray="4,4"
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
        
        {/* Connection mode instructions */}
        {isConnecting && (
          <g>
            <rect
              x="350"
              y="20"
              width="300"
              height="60"
              fill="rgba(245, 158, 11, 0.9)"
              rx="8"
            />
            <text x="500" y="40" textAnchor="middle" fill="white" fontSize="14" fontWeight="600">
              Connection Mode Active
            </text>
            <text x="500" y="58" textAnchor="middle" fill="white" fontSize="12">
              Click another component to connect, or click empty space to cancel
            </text>
          </g>
        )}
        
        {/* Help text */}
        {components.length > 0 && !isConnecting && (
          <text x="500" y="25" textAnchor="middle" fill="#9ca3af" fontSize="12">
            Right-click a component to start connecting • Double-click connections to delete
          </text>
        )}
      </svg>
    </div>
  )
})

Canvas.displayName = 'Canvas'

export default Canvas
