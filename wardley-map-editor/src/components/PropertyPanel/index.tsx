import React from 'react'
import { useMapStore } from '../../stores/mapStore'

const PropertyPanel: React.FC = () => {
  const { selectedId, components, updateComponent, deleteComponent } = useMapStore()
  
  const selectedComponent = selectedId 
    ? components.find(c => c.id === selectedId)
    : null

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-gray-50 border-l border-gray-200 p-4">
        <div className="text-center text-gray-500 mt-8">
          <div className="text-lg mb-2">No component selected</div>
          <div className="text-sm">Click on a component to edit its properties</div>
        </div>
      </div>
    )
  }

  const handleNameChange = (name: string) => {
    updateComponent(selectedComponent.id, { name })
  }

  const handleNotesChange = (notes: string) => {
    updateComponent(selectedComponent.id, { notes })
  }

  const handleColorChange = (color: string) => {
    updateComponent(selectedComponent.id, { color })
  }

  const handleDelete = () => {
    if (confirm(`Delete "${selectedComponent.name}"?`)) {
      deleteComponent(selectedComponent.id)
    }
  }

  return (
    <div className="w-80 bg-gray-50 border-l border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Properties</h2>
      
      <div className="space-y-4">
        {/* Component Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={selectedComponent.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Component Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={selectedComponent.color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={selectedComponent.color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
            />
          </div>
        </div>

        {/* Position */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Evolution</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={selectedComponent.x.toFixed(2)}
                onChange={(e) => updateComponent(selectedComponent.id, { x: parseFloat(e.target.value) })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Value Chain</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={selectedComponent.y.toFixed(2)}
                onChange={(e) => updateComponent(selectedComponent.id, { y: parseFloat(e.target.value) })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={selectedComponent.notes || ''}
            onChange={(e) => handleNotesChange(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Add notes about this component..."
          />
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleDelete}
            className="w-full px-3 py-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors"
          >
            Delete Component
          </button>
        </div>
      </div>
    </div>
  )
}

export default PropertyPanel
