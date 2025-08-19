import React, { useState, useRef } from 'react'
import { ExportService } from '../utils/exportService'
import type { ExportData } from '../utils/exportService'
import { useMapStore } from '../stores/mapStore'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  canvasRef: React.RefObject<SVGSVGElement>
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, canvasRef }) => {
  const { components, connections } = useMapStore()
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const createExportData = (): ExportData => ({
    components,
    connections,
    metadata: {
      title: 'Wardley Map',
      createdAt: new Date().toISOString(),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }
  })

  const handleExport = async (format: 'png' | 'pdf' | 'drawio' | 'json') => {
    if (!canvasRef.current) {
      setExportStatus('Error: Canvas not available')
      return
    }

    setIsExporting(true)
    setExportStatus(`Exporting as ${format.toUpperCase()}...`)

    try {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      const filename = `wardley-map-${timestamp}`
      
      let success = false
      const exportData = createExportData()

      switch (format) {
        case 'png':
          success = await ExportService.exportToPNG(canvasRef.current, `${filename}.png`)
          break
        case 'pdf':
          success = await ExportService.exportToPDF(canvasRef.current, `${filename}.pdf`)
          break
        case 'drawio':
          success = ExportService.exportToDrawIO(exportData, `${filename}.drawio`)
          break
        case 'json':
          success = ExportService.exportToJSON(exportData, `${filename}.json`)
          break
      }

      if (success) {
        setExportStatus(`Successfully exported as ${format.toUpperCase()}!`)
        setTimeout(() => {
          setExportStatus('')
          onClose()
        }, 2000)
      } else {
        setExportStatus(`Failed to export as ${format.toUpperCase()}`)
      }
    } catch (error) {
      console.error('Export error:', error)
      setExportStatus('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsExporting(true)
    setExportStatus('Importing map...')

    try {
      const importedData = await ExportService.importFromJSON(file)
      if (importedData) {
        // Clear current map and load imported data
        const { clearMap, addComponent, addConnection } = useMapStore.getState()
        clearMap()
        
        // Add components
        importedData.components.forEach(component => {
          addComponent({
            name: component.name,
            x: component.x,
            y: component.y,
            color: component.color,
            notes: component.notes
          })
        })
        
        // Add connections (need to map old IDs to new ones)
        const componentIdMap = new Map()
        const currentComponents = useMapStore.getState().components
        importedData.components.forEach((importedComp, index) => {
          componentIdMap.set(importedComp.id, currentComponents[index]?.id)
        })
        
        importedData.connections.forEach(connection => {
          const newFromId = componentIdMap.get(connection.fromId)
          const newToId = componentIdMap.get(connection.toId)
          
          if (newFromId && newToId) {
            addConnection({
              fromId: newFromId,
              toId: newToId,
              type: connection.type,
              style: connection.style,
              label: connection.label
            })
          }
        })
        
        setExportStatus('Map imported successfully!')
        setTimeout(() => {
          setExportStatus('')
          onClose()
        }, 2000)
      } else {
        setExportStatus('Failed to import map. Invalid file format.')
      }
    } catch (error) {
      console.error('Import error:', error)
      setExportStatus('Import failed. Please check the file format.')
    } finally {
      setIsExporting(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '2rem',
        width: '90%',
        maxWidth: '500px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            Export & Import
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              color: '#6b7280',
              cursor: 'pointer',
              borderRadius: '0.25rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            ×
          </button>
        </div>

        {exportStatus && (
          <div style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: exportStatus.includes('Error') || exportStatus.includes('Failed') ? '#fef2f2' : '#f0f9ff',
            border: `1px solid ${exportStatus.includes('Error') || exportStatus.includes('Failed') ? '#fecaca' : '#bae6fd'}`,
            borderRadius: '0.375rem',
            color: exportStatus.includes('Error') || exportStatus.includes('Failed') ? '#dc2626' : '#0369a1',
            fontSize: '0.875rem'
          }}>
            {exportStatus}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#374151', margin: '0 0 0.75rem 0' }}>
              Export Options
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                onClick={() => handleExport('png')}
                disabled={isExporting}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: isExporting ? '#f3f4f6' : '#3b82f6',
                  color: isExporting ? '#9ca3af' : 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: isExporting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isExporting) e.currentTarget.style.backgroundColor = '#2563eb'
                }}
                onMouseLeave={(e) => {
                  if (!isExporting) e.currentTarget.style.backgroundColor = '#3b82f6'
                }}
              >
                Export PNG
              </button>
              
              <button
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: isExporting ? '#f3f4f6' : '#dc2626',
                  color: isExporting ? '#9ca3af' : 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: isExporting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isExporting) e.currentTarget.style.backgroundColor = '#b91c1c'
                }}
                onMouseLeave={(e) => {
                  if (!isExporting) e.currentTarget.style.backgroundColor = '#dc2626'
                }}
              >
                Export PDF
              </button>
              
              <button
                onClick={() => handleExport('drawio')}
                disabled={isExporting}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: isExporting ? '#f3f4f6' : '#f59e0b',
                  color: isExporting ? '#9ca3af' : 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: isExporting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isExporting) e.currentTarget.style.backgroundColor = '#d97706'
                }}
                onMouseLeave={(e) => {
                  if (!isExporting) e.currentTarget.style.backgroundColor = '#f59e0b'
                }}
              >
                Export Draw.io
              </button>
              
              <button
                onClick={() => handleExport('json')}
                disabled={isExporting}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: isExporting ? '#f3f4f6' : '#10b981',
                  color: isExporting ? '#9ca3af' : 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: isExporting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isExporting) e.currentTarget.style.backgroundColor = '#059669'
                }}
                onMouseLeave={(e) => {
                  if (!isExporting) e.currentTarget.style.backgroundColor = '#10b981'
                }}
              >
                Export JSON
              </button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#374151', margin: '0 0 0.75rem 0' }}>
              Import Map
            </h3>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={isExporting}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px dashed #d1d5db',
                borderRadius: '0.375rem',
                backgroundColor: '#f9fafb',
                cursor: isExporting ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                color: '#6b7280'
              }}
            />
            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.5rem 0 0 0' }}>
              Import a previously exported JSON file to restore a map
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExportModal
