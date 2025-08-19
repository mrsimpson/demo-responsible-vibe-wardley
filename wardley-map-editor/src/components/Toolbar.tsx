import React from 'react'
import { useMapStore } from '../stores/mapStore'

// Predefined component templates
const COMPONENT_TEMPLATES = [
  { name: 'Customer', color: '#3B82F6', description: 'End user or customer' },
  { name: 'Product', color: '#10B981', description: 'Product or service offering' },
  { name: 'Service', color: '#F59E0B', description: 'Supporting service' },
  { name: 'Data', color: '#8B5CF6', description: 'Data or information' },
  { name: 'Platform', color: '#EF4444', description: 'Platform or infrastructure' },
  { name: 'Component', color: '#6B7280', description: 'Generic component' }
]

const Toolbar: React.FC = () => {
  const { addComponent, clearMap, components } = useMapStore()

  const handleAddComponent = (template: typeof COMPONENT_TEMPLATES[0]) => {
    // Add component at a random position in the middle area
    const x = 0.2 + Math.random() * 0.6 // Random position between 0.2 and 0.8
    const y = 0.2 + Math.random() * 0.6
    
    addComponent({
      name: template.name,
      x,
      y,
      color: template.color,
      notes: template.description
    })
  }

  const handleClearMap = () => {
    if (components.length > 0 && confirm('Clear all components from the map?')) {
      clearMap()
    }
  }

  return (
    <div style={{ 
      width: '16rem', 
      backgroundColor: '#f9fafb', 
      borderRight: '1px solid #e5e7eb', 
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div>
        <h2 style={{ 
          fontSize: '1.125rem', 
          fontWeight: '600', 
          color: '#1f2937', 
          marginBottom: '1rem',
          margin: 0
        }}>
          Components
        </h2>
        <p style={{ 
          fontSize: '0.875rem', 
          color: '#6b7280', 
          margin: '0.5rem 0 1rem 0'
        }}>
          Click to add components to your map
        </p>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {COMPONENT_TEMPLATES.map(template => (
          <button
            key={template.name}
            onClick={() => handleAddComponent(template)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb'
              e.currentTarget.style.borderColor = '#d1d5db'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          >
            <div
              style={{
                width: '1rem',
                height: '1rem',
                borderRadius: '50%',
                backgroundColor: template.color,
                flexShrink: 0
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#1f2937',
                margin: 0
              }}>
                {template.name}
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#6b7280',
                margin: 0
              }}>
                {template.description}
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <div style={{ 
        paddingTop: '1rem', 
        borderTop: '1px solid #e5e7eb',
        marginTop: 'auto'
      }}>
        <h3 style={{ 
          fontSize: '0.875rem', 
          fontWeight: '500', 
          color: '#374151', 
          marginBottom: '0.5rem',
          margin: '0 0 0.5rem 0'
        }}>
          Actions
        </h3>
        <button
          onClick={handleClearMap}
          disabled={components.length === 0}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            fontSize: '0.875rem',
            color: components.length === 0 ? '#9ca3af' : '#dc2626',
            backgroundColor: components.length === 0 ? '#f3f4f6' : '#fef2f2',
            border: `1px solid ${components.length === 0 ? '#e5e7eb' : '#fecaca'}`,
            borderRadius: '0.375rem',
            cursor: components.length === 0 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (components.length > 0) {
              e.currentTarget.style.backgroundColor = '#fee2e2'
            }
          }}
          onMouseLeave={(e) => {
            if (components.length > 0) {
              e.currentTarget.style.backgroundColor = '#fef2f2'
            }
          }}
        >
          Clear Map ({components.length})
        </button>
      </div>
    </div>
  )
}

export default Toolbar
