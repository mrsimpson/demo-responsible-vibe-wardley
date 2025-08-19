import React from 'react'
import Canvas from './components/Canvas'
import Toolbar from './components/Toolbar'
import PropertyPanel from './components/PropertyPanel'

function App() {
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
            <button style={{ 
              padding: '0.5rem 1rem', 
              fontSize: '0.875rem', 
              color: '#374151', 
              backgroundColor: 'white', 
              border: '1px solid #d1d5db', 
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}>
              Export PDF
            </button>
            <button style={{ 
              padding: '0.5rem 1rem', 
              fontSize: '0.875rem', 
              color: '#374151', 
              backgroundColor: 'white', 
              border: '1px solid #d1d5db', 
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}>
              Export Draw.io
            </button>
            <button style={{ 
              padding: '0.5rem 1rem', 
              fontSize: '0.875rem', 
              color: 'white', 
              backgroundColor: '#2563eb', 
              border: 'none', 
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}>
              Save Map
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left sidebar - Component palette */}
        <Toolbar />
        
        {/* Center - Canvas */}
        <Canvas />
        
        {/* Right sidebar - Properties panel */}
        <PropertyPanel />
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: 'white', borderTop: '1px solid #e5e7eb', padding: '0.5rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280' }}>
          <div>
            Local-first Wardley mapping tool
          </div>
          <div>
            Interactive components ready
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
