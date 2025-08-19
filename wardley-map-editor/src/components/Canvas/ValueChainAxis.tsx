import React from 'react'

const ValueChainAxis: React.FC = () => {
  const axisX = 50 // X position of the value chain axis
  const axisHeight = 500 // Height of the axis (from top to evolution axis)
  
  return (
    <g className="value-chain-axis">
      {/* Main axis line */}
      <line
        x1={axisX}
        y1="50"
        x2={axisX}
        y2="550"
        stroke="#374151"
        strokeWidth="2"
      />
      
      {/* Tick marks and labels */}
      {[0, 0.25, 0.5, 0.75, 1].map((position, index) => {
        const y = 50 + position * axisHeight
        const isVisible = position === 0 || position === 1 // Only show labels at top and bottom
        
        return (
          <g key={position}>
            {/* Tick mark */}
            <line
              x1={axisX - 5}
              y1={y}
              x2={axisX + 5}
              y2={y}
              stroke="#6B7280"
              strokeWidth="1"
            />
            
            {/* Grid line (subtle) */}
            <line
              x1={axisX}
              y1={y}
              x2="1000"
              y2={y}
              stroke="#E5E7EB"
              strokeWidth="1"
              opacity="0.5"
            />
            
            {/* Labels only at extremes */}
            {isVisible && (
              <text
                x={axisX - 15}
                y={y + 5}
                textAnchor="end"
                className="fill-gray-700 text-sm font-medium"
                style={{ fontSize: '14px' }}
              >
                {position === 0 ? 'Visible' : 'Invisible'}
              </text>
            )}
          </g>
        )
      })}
      
      {/* Axis title (rotated) */}
      <text
        x="20"
        y="300"
        textAnchor="middle"
        className="fill-gray-800 text-base font-semibold"
        style={{ fontSize: '16px' }}
        transform="rotate(-90, 20, 300)"
      >
        Value Chain
      </text>
      
      {/* Value chain direction arrow */}
      <defs>
        <marker
          id="value-chain-arrow"
          markerWidth="6"
          markerHeight="8"
          refX="3"
          refY="7"
          orient="auto"
        >
          <polygon
            points="0 0, 6 0, 3 8"
            fill="#374151"
          />
        </marker>
      </defs>
      
      <line
        x1={axisX - 25}
        y1="150"
        x2={axisX - 25}
        y2="100"
        stroke="#374151"
        strokeWidth="2"
        markerEnd="url(#value-chain-arrow)"
      />
      
      <text
        x={axisX - 35}
        y="125"
        textAnchor="middle"
        className="fill-gray-600 text-xs"
        style={{ fontSize: '12px' }}
        transform="rotate(-90, 15, 125)"
      >
        User need
      </text>
    </g>
  )
}

export default ValueChainAxis
