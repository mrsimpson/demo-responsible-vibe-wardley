import React, { useState, useRef } from 'react'
import Canvas from './components/Canvas'
import Toolbar from './components/Toolbar'
import PropertyPanel from './components/PropertyPanel'
import ExportModal from './components/ExportModal'

function App() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const canvasRef = useRef<SVGSVGElement>(null)

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
              Wardley Map Editor
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
              Create and visualize strategic maps
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => setIsExportModalOpen(true)}
              style={{ 
                padding: '0.5rem 1rem', 
                fontSize: '0.875rem', 
                color: '#374151', 
                backgroundColor: 'white', 
                border: '1px solid #d1d5db', 
                borderRadius: '0.375rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb'
                e.currentTarget.style.borderColor = '#9ca3af'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white'
                e.currentTarget.style.borderColor = '#d1d5db'
              }}
            >
              📄 Export PDF
            </button>
            <button 
              onClick={() => setIsExportModalOpen(true)}
              style={{ 
                padding: '0.5rem 1rem', 
                fontSize: '0.875rem', 
                color: '#374151', 
                backgroundColor: 'white', 
                border: '1px solid #d1d5db', 
                borderRadius: '0.375rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb'
                e.currentTarget.style.borderColor = '#9ca3af'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white'
                e.currentTarget.style.borderColor = '#d1d5db'
              }}
            >
              🔗 Export Draw.io
            </button>
            <button 
              onClick={() => setIsExportModalOpen(true)}
              style={{ 
                padding: '0.5rem 1rem', 
                fontSize: '0.875rem', 
                color: 'white', 
                backgroundColor: '#2563eb', 
                border: 'none', 
                borderRadius: '0.375rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1d4ed8'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb'
              }}
            >
              💾 Export & Import
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left sidebar - Component palette */}
        <Toolbar />
        
        {/* Center - Canvas */}
        <Canvas ref={canvasRef} />
        
        {/* Right sidebar - Properties panel */}
        <PropertyPanel />
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: 'white', borderTop: '1px solid #e5e7eb', padding: '0.5rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280' }}>
          <div>
            Local-first Wardley mapping tool with export capabilities
          </div>
          <div>
            Export ready: PDF • PNG • Draw.io • JSON
          </div>
        </div>
      </footer>

      {/* Export Modal */}
      <ExportModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        canvasRef={canvasRef}
      />
    </div>
  )
}

export default App
