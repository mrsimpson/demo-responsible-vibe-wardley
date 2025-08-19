import React from 'react'
import { useMapStore } from '../stores/mapStore'

interface ConnectionLayerProps {
  mapToSVGCoords: (mapX: number, mapY: number) => { x: number, y: number }
}

const ConnectionLayer: React.FC<ConnectionLayerProps> = ({ mapToSVGCoords }) => {
  const { 
    connections, 
    components, 
    selectedConnectionId, 
    selectConnection,
    deleteConnection 
  } = useMapStore()

  // Calculate arrow path between two points
  const calculateArrowPath = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = x2 - x1
    const dy = y2 - y1
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // Offset from component centers (radius = 25)
    const offset = 30
    const offsetX1 = (dx / distance) * offset
    const offsetY1 = (dy / distance) * offset
    const offsetX2 = (dx / distance) * offset
    const offsetY2 = (dy / distance) * offset
    
    return {
      x1: x1 + offsetX1,
      y1: y1 + offsetY1,
      x2: x2 - offsetX2,
      y2: y2 - offsetY2
    }
  }

  // Handle connection click
  const handleConnectionClick = (event: React.MouseEvent, connectionId: string) => {
    event.stopPropagation()
    selectConnection(connectionId)
  }

  // Handle connection double-click (delete)
  const handleConnectionDoubleClick = (event: React.MouseEvent, connectionId: string) => {
    event.stopPropagation()
    if (confirm('Delete this connection?')) {
      deleteConnection(connectionId)
    }
  }

  return (
    <g className="connection-layer">
      {/* Define arrow markers */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
          markerUnits="strokeWidth"
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
          markerUnits="strokeWidth"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#3B82F6"
          />
        </marker>
        
        <marker
          id="arrowhead-flow"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#10B981"
          />
        </marker>
      </defs>

      {connections.map(connection => {
        const fromComponent = components.find(c => c.id === connection.fromId)
        const toComponent = components.find(c => c.id === connection.toId)
        
        if (!fromComponent || !toComponent) return null
        
        const fromCoords = mapToSVGCoords(fromComponent.x, fromComponent.y)
        const toCoords = mapToSVGCoords(toComponent.x, toComponent.y)
        const arrowPath = calculateArrowPath(fromCoords.x, fromCoords.y, toCoords.x, toCoords.y)
        
        const isSelected = connection.id === selectedConnectionId
        const isDependency = connection.type === 'dependency'
        
        return (
          <g key={connection.id}>
            {/* Connection line */}
            <line
              x1={arrowPath.x1}
              y1={arrowPath.y1}
              x2={arrowPath.x2}
              y2={arrowPath.y2}
              stroke={isSelected ? '#3B82F6' : (isDependency ? '#666' : '#10B981')}
              strokeWidth={isSelected ? 3 : 2}
              strokeDasharray={connection.style === 'dashed' ? '5,5' : 'none'}
              markerEnd={`url(#${isSelected ? 'arrowhead-selected' : (isDependency ? 'arrowhead' : 'arrowhead-flow')})`}
              style={{ 
                cursor: 'pointer',
                opacity: 0.8
              }}
              onClick={(e) => handleConnectionClick(e, connection.id)}
              onDoubleClick={(e) => handleConnectionDoubleClick(e, connection.id)}
            />
            
            {/* Invisible wider line for easier clicking */}
            <line
              x1={arrowPath.x1}
              y1={arrowPath.y1}
              x2={arrowPath.x2}
              y2={arrowPath.y2}
              stroke="transparent"
              strokeWidth="10"
              style={{ cursor: 'pointer' }}
              onClick={(e) => handleConnectionClick(e, connection.id)}
              onDoubleClick={(e) => handleConnectionDoubleClick(e, connection.id)}
            />
            
            {/* Connection label */}
            {connection.label && (
              <text
                x={(arrowPath.x1 + arrowPath.x2) / 2}
                y={(arrowPath.y1 + arrowPath.y2) / 2 - 5}
                textAnchor="middle"
                fill={isSelected ? '#3B82F6' : '#374151'}
                fontSize="10"
                fontWeight="500"
                style={{ pointerEvents: 'none' }}
              >
                {connection.label}
              </text>
            )}
            
            {/* Selection indicator */}
            {isSelected && (
              <circle
                cx={(arrowPath.x1 + arrowPath.x2) / 2}
                cy={(arrowPath.y1 + arrowPath.y2) / 2}
                r="8"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
                strokeDasharray="3,3"
                style={{ pointerEvents: 'none' }}
              >
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="rotate"
                  from={`0 ${(arrowPath.x1 + arrowPath.x2) / 2} ${(arrowPath.y1 + arrowPath.y2) / 2}`}
                  to={`360 ${(arrowPath.x1 + arrowPath.x2) / 2} ${(arrowPath.y1 + arrowPath.y2) / 2}`}
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>
        )
      })}
    </g>
  )
}

export default ConnectionLayer
