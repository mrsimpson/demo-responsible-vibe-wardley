import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MapState, MapComponent, MapConnection, Viewport } from '../types'

// Generate unique IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

interface MapStore extends MapState {
  // Component actions
  addComponent: (component: Omit<MapComponent, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateComponent: (id: string, updates: Partial<MapComponent>) => void
  deleteComponent: (id: string) => void
  duplicateComponent: (id: string) => void
  
  // Selection actions
  selectComponent: (id: string | null) => void
  
  // Connection actions
  addConnection: (connection: Omit<MapConnection, 'id'>) => void
  updateConnection: (id: string, updates: Partial<MapConnection>) => void
  deleteConnection: (id: string) => void
  
  // Viewport actions
  updateViewport: (viewport: Partial<Viewport>) => void
  resetViewport: () => void
  
  // Drag actions
  startDrag: (componentId: string, offset: { x: number, y: number }) => void
  updateDrag: (x: number, y: number) => void
  endDrag: () => void
  
  // Utility actions
  clearMap: () => void
  getComponentById: (id: string) => MapComponent | undefined
  getConnectionsForComponent: (componentId: string) => MapConnection[]
}

const initialState: MapState = {
  components: [],
  connections: [],
  selectedId: null,
  viewport: { x: 0, y: 0, zoom: 1 },
  isDragging: false,
  dragOffset: { x: 0, y: 0 }
}

export const useMapStore = create<MapStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Component actions
      addComponent: (componentData) => {
        const now = new Date()
        const component: MapComponent = {
          ...componentData,
          id: generateId(),
          createdAt: now,
          updatedAt: now
        }
        
        set((state) => ({
          components: [...state.components, component],
          selectedId: component.id
        }))
      },
      
      updateComponent: (id, updates) => {
        set((state) => ({
          components: state.components.map(component =>
            component.id === id
              ? { ...component, ...updates, updatedAt: new Date() }
              : component
          )
        }))
      },
      
      deleteComponent: (id) => {
        set((state) => ({
          components: state.components.filter(component => component.id !== id),
          connections: state.connections.filter(
            connection => connection.fromId !== id && connection.toId !== id
          ),
          selectedId: state.selectedId === id ? null : state.selectedId
        }))
      },
      
      duplicateComponent: (id) => {
        const component = get().getComponentById(id)
        if (component) {
          const now = new Date()
          const duplicated: MapComponent = {
            ...component,
            id: generateId(),
            name: `${component.name} Copy`,
            x: Math.min(component.x + 0.05, 1), // Offset slightly
            y: Math.min(component.y + 0.05, 1),
            createdAt: now,
            updatedAt: now
          }
          
          set((state) => ({
            components: [...state.components, duplicated],
            selectedId: duplicated.id
          }))
        }
      },
      
      // Selection actions
      selectComponent: (id) => {
        set({ selectedId: id })
      },
      
      // Connection actions
      addConnection: (connectionData) => {
        const connection: MapConnection = {
          ...connectionData,
          id: generateId()
        }
        
        set((state) => ({
          connections: [...state.connections, connection]
        }))
      },
      
      updateConnection: (id, updates) => {
        set((state) => ({
          connections: state.connections.map(connection =>
            connection.id === id ? { ...connection, ...updates } : connection
          )
        }))
      },
      
      deleteConnection: (id) => {
        set((state) => ({
          connections: state.connections.filter(connection => connection.id !== id)
        }))
      },
      
      // Viewport actions
      updateViewport: (viewportUpdates) => {
        set((state) => ({
          viewport: { ...state.viewport, ...viewportUpdates }
        }))
      },
      
      resetViewport: () => {
        set({ viewport: { x: 0, y: 0, zoom: 1 } })
      },
      
      // Drag actions
      startDrag: (componentId, offset) => {
        set({
          isDragging: true,
          dragOffset: offset,
          selectedId: componentId
        })
      },
      
      updateDrag: (x, y) => {
        const { selectedId, dragOffset } = get()
        if (selectedId && get().isDragging) {
          // Constrain to canvas bounds (0-1)
          const constrainedX = Math.max(0, Math.min(1, x - dragOffset.x))
          const constrainedY = Math.max(0, Math.min(1, y - dragOffset.y))
          
          get().updateComponent(selectedId, { x: constrainedX, y: constrainedY })
        }
      },
      
      endDrag: () => {
        set({
          isDragging: false,
          dragOffset: { x: 0, y: 0 }
        })
      },
      
      // Utility actions
      clearMap: () => {
        set(initialState)
      },
      
      getComponentById: (id) => {
        return get().components.find(component => component.id === id)
      },
      
      getConnectionsForComponent: (componentId) => {
        return get().connections.filter(
          connection => connection.fromId === componentId || connection.toId === componentId
        )
      }
    }),
    {
      name: 'wardley-map-storage', // localStorage key
      partialize: (state) => ({
        components: state.components,
        connections: state.connections,
        viewport: state.viewport
        // Don't persist UI state like selectedId, isDragging
      })
    }
  )
)
