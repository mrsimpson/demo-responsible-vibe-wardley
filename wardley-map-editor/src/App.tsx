import React from 'react'

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
              borderRadius: '0.375rem' 
            }}>
              Export PDF
            </button>
            <button style={{ 
              padding: '0.5rem 1rem', 
              fontSize: '0.875rem', 
              color: '#374151', 
              backgroundColor: 'white', 
              border: '1px solid #d1d5db', 
              borderRadius: '0.375rem' 
            }}>
              Export Draw.io
            </button>
            <button style={{ 
              padding: '0.5rem 1rem', 
              fontSize: '0.875rem', 
              color: 'white', 
              backgroundColor: '#2563eb', 
              border: 'none', 
              borderRadius: '0.375rem' 
            }}>
              Save Map
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left sidebar - Component palette */}
        <div style={{ width: '16rem', backgroundColor: '#f9fafb', borderRight: '1px solid #e5e7eb', padding: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>Components</h2>
          <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Component palette will go here</p>
        </div>
        
        {/* Center - Canvas */}
        <div style={{ flex: 1, overflow: 'hidden', backgroundColor: 'white' }}>
          <div style={{ width: '100%', height: '100%', border: '1px solid #d1d5db' }}>
            <svg width="100%" height="100%" viewBox="0 0 1000 600">
              <rect width="100%" height="100%" fill="white" />
              <text x="500" y="300" textAnchor="middle" fill="#374151">
                Canvas will go here
              </text>
            </svg>
          </div>
        </div>
        
        {/* Right sidebar - Properties panel */}
        <div style={{ width: '20rem', backgroundColor: '#f9fafb', borderLeft: '1px solid #e5e7eb', padding: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>Properties</h2>
          <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Property panel will go here</p>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: 'white', borderTop: '1px solid #e5e7eb', padding: '0.5rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280' }}>
          <div>
            Local-first Wardley mapping tool
          </div>
          <div>
            Auto-save enabled
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
