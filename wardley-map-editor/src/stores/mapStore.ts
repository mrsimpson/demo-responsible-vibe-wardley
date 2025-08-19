import { create } from 'zustand'

// Core interfaces
export interface MapComponent {
  id: string
  name: string
  x: number // Evolution position (0-1)
  y: number // Value chain position (0-1)
  color: string
  notes?: string
}

export interface MapConnection {
  id: string
  fromId: string
  toId: string
  type: 'dependency' | 'flow'
  style?: 'solid' | 'dashed'
  label?: string
}

export interface MapState {
  components: MapComponent[]
  connections: MapConnection[]
  selectedId: string | null
  selectedConnectionId: string | null
  isDragging: boolean
  isConnecting: boolean
  connectionStart: string | null // Component ID for connection start
}

// Generate unique IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

interface MapStore extends MapState {
  // Component actions
  addComponent: (component: Omit<MapComponent, 'id'>) => void
  updateComponent: (id: string, updates: Partial<MapComponent>) => void
  deleteComponent: (id: string) => void
  selectComponent: (id: string | null) => void
  
  // Connection actions
  addConnection: (connection: Omit<MapConnection, 'id'>) => void
  updateConnection: (id: string, updates: Partial<MapConnection>) => void
  deleteConnection: (id: string) => void
  selectConnection: (id: string | null) => void
  
  // Connection creation workflow
  startConnection: (componentId: string) => void
  completeConnection: (toComponentId: string) => void
  cancelConnection: () => void
  
  // Drag actions
  startDrag: (componentId: string) => void
  updateDrag: (id: string, x: number, y: number) => void
  endDrag: () => void
  
  // Utility
  clearMap: () => void
  getComponentById: (id: string) => MapComponent | undefined
  getConnectionById: (id: string) => MapConnection | undefined
  getConnectionsForComponent: (componentId: string) => MapConnection[]
}

export const useMapStore = create<MapStore>((set, get) => ({
  // Initial state
  components: [],
  connections: [],
  selectedId: null,
  selectedConnectionId: null,
  isDragging: false,
  isConnecting: false,
  connectionStart: null,
  
  // Component actions
  addComponent: (componentData) => {
    const component: MapComponent = {
      ...componentData,
      id: generateId()
    }
    
    set((state) => ({
      components: [...state.components, component],
      selectedId: component.id,
      selectedConnectionId: null
    }))
  },
  
  updateComponent: (id, updates) => {
    set((state) => ({
      components: state.components.map(component =>
        component.id === id ? { ...component, ...updates } : component
      )
    }))
  },
  
  deleteComponent: (id) => {
    set((state) => ({
      components: state.components.filter(component => component.id !== id),
      connections: state.connections.filter(
        connection => connection.fromId !== id && connection.toId !== id
      ),
      selectedId: state.selectedId === id ? null : state.selectedId,
      selectedConnectionId: null
    }))
  },
  
  selectComponent: (id) => {
    set({ 
      selectedId: id, 
      selectedConnectionId: null,
      isConnecting: false,
      connectionStart: null
    })
  },
  
  // Connection actions
  addConnection: (connectionData) => {
    const connection: MapConnection = {
      ...connectionData,
      id: generateId()
    }
    
    set((state) => ({
      connections: [...state.connections, connection],
      selectedConnectionId: connection.id,
      selectedId: null
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
      connections: state.connections.filter(connection => connection.id !== id),
      selectedConnectionId: state.selectedConnectionId === id ? null : state.selectedConnectionId
    }))
  },
  
  selectConnection: (id) => {
    set({ 
      selectedConnectionId: id, 
      selectedId: null,
      isConnecting: false,
      connectionStart: null
    })
  },
  
  // Connection creation workflow
  startConnection: (componentId) => {
    set({
      isConnecting: true,
      connectionStart: componentId,
      selectedId: null,
      selectedConnectionId: null
    })
  },
  
  completeConnection: (toComponentId) => {
    const { connectionStart } = get()
    if (connectionStart && connectionStart !== toComponentId) {
      get().addConnection({
        fromId: connectionStart,
        toId: toComponentId,
        type: 'dependency',
        style: 'solid'
      })
    }
    
    set({
      isConnecting: false,
      connectionStart: null
    })
  },
  
  cancelConnection: () => {
    set({
      isConnecting: false,
      connectionStart: null
    })
  },
  
  // Drag actions
  startDrag: (componentId) => {
    set({
      isDragging: true,
      selectedId: componentId,
      selectedConnectionId: null,
      isConnecting: false,
      connectionStart: null
    })
  },
  
  updateDrag: (id, x, y) => {
    // Constrain to canvas bounds (0-1)
    const constrainedX = Math.max(0, Math.min(1, x))
    const constrainedY = Math.max(0, Math.min(1, y))
    
    get().updateComponent(id, { x: constrainedX, y: constrainedY })
  },
  
  endDrag: () => {
    set({ isDragging: false })
  },
  
  // Utility actions
  clearMap: () => {
    set({
      components: [],
      connections: [],
      selectedId: null,
      selectedConnectionId: null,
      isDragging: false,
      isConnecting: false,
      connectionStart: null
    })
  },
  
  getComponentById: (id) => {
    return get().components.find(component => component.id === id)
  },
  
  getConnectionById: (id) => {
    return get().connections.find(connection => connection.id === id)
  },
  
  getConnectionsForComponent: (componentId) => {
    return get().connections.filter(
      connection => connection.fromId === componentId || connection.toId === componentId
    )
  }
}))
