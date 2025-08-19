import React from 'react'
import { useMapStore } from '../../stores/mapStore'

interface ComponentLayerProps {
  screenToMapCoords: (screenX: number, screenY: number) => { x: number, y: number }
}

const ComponentLayer: React.FC<ComponentLayerProps> = ({ screenToMapCoords }) => {
  const { components } = useMapStore()

  // Placeholder - will be implemented in Phase 4
  return (
    <g className="component-layer">
      {components.map(component => (
        <g key={component.id}>
          {/* Temporary simple representation */}
          <circle
            cx={component.x * 1000}
            cy={component.y * 600}
            r="20"
            fill={component.color}
            stroke="#374151"
            strokeWidth="2"
            opacity="0.8"
          />
          <text
            x={component.x * 1000}
            y={component.y * 600 + 5}
            textAnchor="middle"
            className="fill-white text-xs font-medium"
            style={{ fontSize: '12px' }}
          >
            {component.name}
          </text>
        </g>
      ))}
    </g>
  )
}

export default ComponentLayer
