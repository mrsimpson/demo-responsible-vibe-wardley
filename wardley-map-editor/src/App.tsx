import { useState, useRef } from 'react'
import Canvas from './components/Canvas'
import Toolbar from './components/Toolbar'
import PropertyPanel from './components/PropertyPanel'
import ExportModal from './components/ExportModal'
import { ExportService } from './utils/exportService'
import { useMapStore } from './stores/mapStore'

function App() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [exportStatus, setExportStatus] = useState<string>('')
  const canvasRef = useRef<SVGSVGElement>(null)
  const { components, connections } = useMapStore()

  const createExportData = () => ({
    components,
    connections,
    metadata: {
      title: 'Wardley Map',
      createdAt: new Date().toISOString(),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }
  })

  const handleDirectExport = async (format: 'pdf' | 'drawio') => {
    if (!canvasRef.current) {
      setExportStatus('Error: Canvas not available')
      return
    }

    setExportStatus(`Exporting as ${format.toUpperCase()}...`)

    try {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      const filename = `wardley-map-${timestamp}`
      
      let success = false
      const exportData = createExportData()

      switch (format) {
        case 'pdf':
          success = await ExportService.exportToPDF(canvasRef.current, `${filename}.pdf`)
          break
        case 'drawio':
          success = ExportService.exportToDrawIO(exportData, `${filename}.drawio`)
          break
      }

      if (success) {
        setExportStatus(`Successfully exported as ${format.toUpperCase()}!`)
        setTimeout(() => setExportStatus(''), 3000)
      } else {
        setExportStatus(`Failed to export as ${format.toUpperCase()}`)
        setTimeout(() => setExportStatus(''), 3000)
      }
    } catch (error) {
      console.error('Export error:', error)
      setExportStatus('Export failed. Please try again.')
      setTimeout(() => setExportStatus(''), 3000)
    }
  }

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
              onClick={() => handleDirectExport('pdf')}
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
              onClick={() => handleDirectExport('drawio')}
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
              💾 More Options
            </button>
          </div>
        </div>
        
        {/* Export Status */}
        {exportStatus && (
          <div style={{
            marginTop: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: exportStatus.includes('Error') || exportStatus.includes('Failed') ? '#fef2f2' : '#f0f9ff',
            border: `1px solid ${exportStatus.includes('Error') || exportStatus.includes('Failed') ? '#fecaca' : '#bae6fd'}`,
            borderRadius: '0.375rem',
            color: exportStatus.includes('Error') || exportStatus.includes('Failed') ? '#dc2626' : '#0369a1',
            fontSize: '0.875rem'
          }}>
            {exportStatus}
          </div>
        )}
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
        canvasRef={canvasRef as React.RefObject<SVGSVGElement>}
      />
    </div>
  )
}

export default App
