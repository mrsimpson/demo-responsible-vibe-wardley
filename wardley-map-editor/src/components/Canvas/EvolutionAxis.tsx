import React from 'react'
import { EVOLUTION_STAGES } from '../../types'

const EvolutionAxis: React.FC = () => {
  const axisY = 550 // Y position of the evolution axis
  const labelY = 580 // Y position of the labels
  
  return (
    <g className="evolution-axis">
      {/* Main axis line */}
      <line
        x1="0"
        y1={axisY}
        x2="1000"
        y2={axisY}
        stroke="#374151"
        strokeWidth="2"
      />
      
      {/* Stage dividers and labels */}
      {Object.entries(EVOLUTION_STAGES).map(([key, stage], index) => {
        const x = stage.min * 1000 + (stage.max - stage.min) * 500 // Center of stage
        const dividerX = stage.max * 1000 // Right edge of stage
        
        return (
          <g key={key}>
            {/* Stage divider (except for the last one) */}
            {index < Object.keys(EVOLUTION_STAGES).length - 1 && (
              <line
                x1={dividerX}
                y1={axisY - 10}
                x2={dividerX}
                y2={axisY + 10}
                stroke="#6B7280"
                strokeWidth="1"
              />
            )}
            
            {/* Stage label */}
            <text
              x={x}
              y={labelY}
              textAnchor="middle"
              className="fill-gray-700 text-sm font-medium"
              style={{ fontSize: '14px' }}
            >
              {stage.name}
            </text>
            
            {/* Stage background (subtle) */}
            <rect
              x={stage.min * 1000}
              y="0"
              width={(stage.max - stage.min) * 1000}
              height={axisY}
              fill={index % 2 === 0 ? '#F9FAFB' : '#F3F4F6'}
              opacity="0.3"
            />
          </g>
        )
      })}
      
      {/* Axis title */}
      <text
        x="500"
        y="595"
        textAnchor="middle"
        className="fill-gray-800 text-base font-semibold"
        style={{ fontSize: '16px' }}
      >
        Evolution
      </text>
      
      {/* Evolution direction arrow */}
      <defs>
        <marker
          id="evolution-arrow"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 8 3, 0 6"
            fill="#374151"
          />
        </marker>
      </defs>
      
      <line
        x1="850"
        y1={axisY + 25}
        x2="950"
        y2={axisY + 25}
        stroke="#374151"
        strokeWidth="2"
        markerEnd="url(#evolution-arrow)"
      />
      
      <text
        x="900"
        y={axisY + 20}
        textAnchor="middle"
        className="fill-gray-600 text-xs"
        style={{ fontSize: '12px' }}
      >
        More evolved
      </text>
    </g>
  )
}

export default EvolutionAxis
