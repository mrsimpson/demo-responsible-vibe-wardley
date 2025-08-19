import React from 'react'
import { useMapStore } from '../stores/mapStore'
import ConnectionPropertyPanel from './ConnectionPropertyPanel'

const PropertyPanel: React.FC = () => {
  const { selectedId, selectedConnectionId, components, updateComponent, deleteComponent } = useMapStore()
  
  const selectedComponent = selectedId 
    ? components.find(c => c.id === selectedId)
    : null

  if (!selectedComponent && !selectedConnectionId) {
    return (
      <div style={{ 
        width: '20rem', 
        backgroundColor: '#f9fafb', 
        borderLeft: '1px solid #e5e7eb', 
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <div style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
            No selection
          </div>
          <div style={{ fontSize: '0.875rem' }}>
            Click on a component or connection to edit its properties
          </div>
        </div>
      </div>
    )
  }

  // If a connection is selected, only show connection properties
  if (selectedConnectionId && !selectedComponent) {
    return (
      <div style={{ 
        width: '20rem', 
        backgroundColor: '#f9fafb', 
        borderLeft: '1px solid #e5e7eb', 
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <h2 style={{ 
          fontSize: '1.125rem', 
          fontWeight: '600', 
          color: '#1f2937', 
          margin: 0
        }}>
          Properties
        </h2>
        
        <ConnectionPropertyPanel />
      </div>
    )
  }

  // If a component is selected, show component properties
  if (selectedComponent) {
    const handleNameChange = (name: string) => {
      updateComponent(selectedComponent.id, { name })
    }

    const handleNotesChange = (notes: string) => {
      updateComponent(selectedComponent.id, { notes })
    }

    const handleColorChange = (color: string) => {
      updateComponent(selectedComponent.id, { color })
    }

    const handlePositionChange = (field: 'x' | 'y', value: number) => {
      updateComponent(selectedComponent.id, { [field]: Math.max(0, Math.min(1, value)) })
    }

    const handleDelete = () => {
      if (confirm(`Delete "${selectedComponent.name}"?`)) {
        deleteComponent(selectedComponent.id)
      }
    }

    // Get evolution stage name
    const getEvolutionStage = (x: number) => {
      if (x < 0.25) return 'Genesis'
      if (x < 0.5) return 'Custom'
      if (x < 0.75) return 'Product'
      return 'Commodity'
    }

    return (
      <div style={{ 
        width: '20rem', 
        backgroundColor: '#f9fafb', 
        borderLeft: '1px solid #e5e7eb', 
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <h2 style={{ 
          fontSize: '1.125rem', 
          fontWeight: '600', 
          color: '#1f2937', 
          margin: 0
        }}>
          Properties
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Component Name */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '0.25rem' 
            }}>
              Name
            </label>
            <input
              type="text"
              value={selectedComponent.name}
              onChange={(e) => handleNameChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                backgroundColor: 'white'
              }}
            />
          </div>

          {/* Component Color */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '0.25rem' 
            }}>
              Color
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="color"
                value={selectedComponent.color}
                onChange={(e) => handleColorChange(e.target.value)}
                style={{
                  width: '3rem',
                  height: '2rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              />
              <input
                type="text"
                value={selectedComponent.color}
                onChange={(e) => handleColorChange(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontFamily: 'monospace',
                  backgroundColor: 'white'
                }}
              />
            </div>
          </div>

          {/* Position */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '0.25rem' 
            }}>
              Position
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.75rem', 
                  color: '#6b7280', 
                  marginBottom: '0.25rem' 
                }}>
                  Evolution ({getEvolutionStage(selectedComponent.x)})
                </label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={selectedComponent.x.toFixed(2)}
                  onChange={(e) => handlePositionChange('x', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.25rem 0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    backgroundColor: 'white'
                  }}
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.75rem', 
                  color: '#6b7280', 
                  marginBottom: '0.25rem' 
                }}>
                  Value Chain
                </label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={selectedComponent.y.toFixed(2)}
                  onChange={(e) => handlePositionChange('y', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.25rem 0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    backgroundColor: 'white'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '0.25rem' 
            }}>
              Notes
            </label>
            <textarea
              value={selectedComponent.notes || ''}
              onChange={(e) => handleNotesChange(e.target.value)}
              rows={4}
              placeholder="Add notes about this component..."
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                resize: 'none',
                backgroundColor: 'white'
              }}
            />
          </div>

          {/* Actions */}
          <div style={{ 
            paddingTop: '1rem', 
            borderTop: '1px solid #e5e7eb' 
          }}>
            <button
              onClick={handleDelete}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                color: '#dc2626',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fee2e2'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fef2f2'
              }}
            >
              Delete Component
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default PropertyPanel
