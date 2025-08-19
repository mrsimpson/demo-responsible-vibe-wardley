import React from 'react'
import { useMapStore } from '../../stores/mapStore'

const ConnectionLayer: React.FC = () => {
  const { connections, components } = useMapStore()

  return (
    <g className="connection-layer">
      {connections.map(connection => {
        const fromComponent = components.find(c => c.id === connection.fromId)
        const toComponent = components.find(c => c.id === connection.toId)
        
        if (!fromComponent || !toComponent) return null
        
        return (
          <line
            key={connection.id}
            x1={fromComponent.x * 1000}
            y1={fromComponent.y * 600}
            x2={toComponent.x * 1000}
            y2={toComponent.y * 600}
            stroke="#666"
            strokeWidth="2"
            strokeDasharray={connection.style === 'dashed' ? '5,5' : 'none'}
            markerEnd="url(#arrowhead)"
            opacity="0.7"
          />
        )
      })}
    </g>
  )
}

export default ConnectionLayer
