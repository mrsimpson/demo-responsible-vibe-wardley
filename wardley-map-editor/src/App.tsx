import React, { useEffect } from 'react'
import Canvas from './components/Canvas'
import Toolbar from './components/Toolbar'
import PropertyPanel from './components/PropertyPanel'
import { useMapStore } from './stores/mapStore'
import { AutoSave } from './utils/storage'
import './App.css'

function App() {
  // Initialize auto-save
  useEffect(() => {
    const autoSave = AutoSave.getInstance()
    autoSave.start(() => useMapStore.getState())
    
    return () => {
      autoSave.stop()
    }
  }, [])

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Wardley Map Editor
            </h1>
            <p className="text-sm text-gray-600">
              Create and visualize strategic maps
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              Export PDF
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              Export Draw.io
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Save Map
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Component palette */}
        <Toolbar />
        
        {/* Center - Canvas */}
        <Canvas />
        
        {/* Right sidebar - Properties panel */}
        <PropertyPanel />
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-2">
        <div className="flex items-center justify-between text-sm text-gray-500">
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
