import React from 'react'
import { useMapStore } from '../../stores/mapStore'
import { COMPONENT_TEMPLATES } from '../../types'

const Toolbar: React.FC = () => {
  const { addComponent } = useMapStore()

  const handleAddComponent = (template: typeof COMPONENT_TEMPLATES[0]) => {
    // Add component at center of canvas with some randomization
    const x = 0.3 + Math.random() * 0.4 // Random position between 0.3 and 0.7
    const y = 0.3 + Math.random() * 0.4
    
    addComponent({
      name: template.name,
      x,
      y,
      color: template.color,
      notes: template.description
    })
  }

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Components</h2>
      
      <div className="space-y-2">
        {COMPONENT_TEMPLATES.map(template => (
          <button
            key={template.name}
            onClick={() => handleAddComponent(template)}
            className="w-full flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: template.color }}
            />
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-gray-800">
                {template.name}
              </div>
              {template.description && (
                <div className="text-xs text-gray-500">
                  {template.description}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Actions</h3>
        <button
          onClick={() => useMapStore.getState().clearMap()}
          className="w-full px-3 py-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors"
        >
          Clear Map
        </button>
      </div>
    </div>
  )
}

export default Toolbar
