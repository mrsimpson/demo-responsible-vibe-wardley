import React from 'react'
import { useMapStore } from '../stores/mapStore'

const ConnectionPropertyPanel: React.FC = () => {
  const { 
    selectedConnectionId, 
    connections, 
    components,
    updateConnection, 
    deleteConnection 
  } = useMapStore()
  
  const selectedConnection = selectedConnectionId 
    ? connections.find(c => c.id === selectedConnectionId)
    : null

  if (!selectedConnection) return null

  const fromComponent = components.find(c => c.id === selectedConnection.fromId)
  const toComponent = components.find(c => c.id === selectedConnection.toId)

  const handleTypeChange = (type: 'dependency' | 'flow') => {
    updateConnection(selectedConnection.id, { type })
  }

  const handleStyleChange = (style: 'solid' | 'dashed') => {
    updateConnection(selectedConnection.id, { style })
  }

  const handleLabelChange = (label: string) => {
    updateConnection(selectedConnection.id, { label: label || undefined })
  }

  const handleDelete = () => {
    if (confirm(`Delete connection from "${fromComponent?.name}" to "${toComponent?.name}"?`)) {
      deleteConnection(selectedConnection.id)
    }
  }

  return (
    <div style={{ 
      borderTop: '1px solid #e5e7eb',
      paddingTop: '1rem',
      marginTop: '1rem'
    }}>
      <h3 style={{ 
        fontSize: '1rem', 
        fontWeight: '600', 
        color: '#1f2937', 
        margin: '0 0 1rem 0'
      }}>
        Connection Properties
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Connection info */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            color: '#374151', 
            marginBottom: '0.25rem' 
          }}>
            Connection
          </label>
          <div style={{ 
            padding: '0.5rem 0.75rem',
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            {fromComponent?.name} → {toComponent?.name}
          </div>
        </div>

        {/* Connection type */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            color: '#374151', 
            marginBottom: '0.25rem' 
          }}>
            Type
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => handleTypeChange('dependency')}
              style={{
                flex: 1,
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                color: selectedConnection.type === 'dependency' ? 'white' : '#374151',
                backgroundColor: selectedConnection.type === 'dependency' ? '#6b7280' : 'white',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Dependency
            </button>
            <button
              onClick={() => handleTypeChange('flow')}
              style={{
                flex: 1,
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                color: selectedConnection.type === 'flow' ? 'white' : '#374151',
                backgroundColor: selectedConnection.type === 'flow' ? '#10b981' : 'white',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Flow
            </button>
          </div>
        </div>

        {/* Connection style */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            color: '#374151', 
            marginBottom: '0.25rem' 
          }}>
            Style
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => handleStyleChange('solid')}
              style={{
                flex: 1,
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                color: selectedConnection.style === 'solid' ? 'white' : '#374151',
                backgroundColor: selectedConnection.style === 'solid' ? '#374151' : 'white',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Solid
            </button>
            <button
              onClick={() => handleStyleChange('dashed')}
              style={{
                flex: 1,
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                color: selectedConnection.style === 'dashed' ? 'white' : '#374151',
                backgroundColor: selectedConnection.style === 'dashed' ? '#374151' : 'white',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Dashed
            </button>
          </div>
        </div>

        {/* Connection label */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            color: '#374151', 
            marginBottom: '0.25rem' 
          }}>
            Label (optional)
          </label>
          <input
            type="text"
            value={selectedConnection.label || ''}
            onChange={(e) => handleLabelChange(e.target.value)}
            placeholder="Add connection label..."
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

        {/* Actions */}
        <div>
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
            Delete Connection
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConnectionPropertyPanel
